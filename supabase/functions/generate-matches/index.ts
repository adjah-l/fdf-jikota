import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  age_group: string;
  city: string;
  state_region: string;
  country: string;
  neighborhood_name: string;
  family_profile: string;
  work_from_home: string;
  season_interest: string;
}

interface MatchingCriteria {
  criteria_type: string;
  weight: number;
  is_active: boolean;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { criteriaWeights } = await req.json();
    
    console.log('Starting matching algorithm...');

    // Get active matching criteria
    const { data: criteria, error: criteriaError } = await supabase
      .from('matching_criteria')
      .select('*')
      .eq('is_active', true);

    if (criteriaError) throw criteriaError;

    // Get all profiles with required data
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id, user_id, full_name, age_group, city, state_region, country,
        neighborhood_name, family_profile, work_from_home, season_interest
      `)
      .not('full_name', 'is', null);

    if (profilesError) throw profilesError;

    console.log(`Found ${profiles.length} profiles to match`);

    // Calculate compatibility scores and create groups
    const groups = generateOptimalGroups(profiles, criteria, criteriaWeights);

    console.log(`Generated ${groups.length} groups`);

    // Save groups to database
    let groupsCreated = 0;
    let membersMatched = 0;

    for (const group of groups) {
      // Create group
      const { data: newGroup, error: groupError } = await supabase
        .from('dinner_groups')
        .insert({
          name: group.name,
          description: group.description,
          max_members: 8,
          status: 'pending_approval',
          created_by: null
        })
        .select()
        .single();

      if (groupError) {
        console.error('Error creating group:', groupError);
        continue;
      }

      // Add members to group
      const memberInserts = group.members.map(member => ({
        group_id: newGroup.id,
        user_id: member.user_id,
        status: 'assigned'
      }));

      const { error: membersError } = await supabase
        .from('group_members')
        .insert(memberInserts);

      if (membersError) {
        console.error('Error adding members:', membersError);
        continue;
      }

      groupsCreated++;
      membersMatched += group.members.length;
    }

    return new Response(JSON.stringify({
      success: true,
      groupsCreated,
      membersMatched,
      totalProfiles: profiles.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-matches:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

function generateOptimalGroups(profiles: Profile[], criteria: MatchingCriteria[], customWeights?: Record<string, number>) {
  const groups = [];
  const usedProfiles = new Set<string>();
  
  // Shuffle profiles for randomness
  const shuffledProfiles = [...profiles].sort(() => Math.random() - 0.5);
  
  let groupIndex = 1;
  
  while (shuffledProfiles.length - usedProfiles.size >= 4) { // Minimum group size
    const availableProfiles = shuffledProfiles.filter(p => !usedProfiles.has(p.user_id));
    
    if (availableProfiles.length < 4) break;
    
    // Start with a random seed profile
    const seedProfile = availableProfiles[0];
    const groupMembers = [seedProfile];
    usedProfiles.add(seedProfile.user_id);
    
    // Find best matches for this seed
    const candidates = availableProfiles.slice(1);
    
    while (groupMembers.length < 8 && candidates.length > 0) {
      let bestMatch = null;
      let bestScore = -1;
      let bestIndex = -1;
      
      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        if (usedProfiles.has(candidate.user_id)) continue;
        
        const score = calculateGroupCompatibility(groupMembers, candidate, criteria, customWeights);
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = candidate;
          bestIndex = i;
        }
      }
      
      if (bestMatch && bestScore > 0.3) { // Minimum compatibility threshold
        groupMembers.push(bestMatch);
        usedProfiles.add(bestMatch.user_id);
        candidates.splice(bestIndex, 1);
      } else {
        break;
      }
    }
    
    if (groupMembers.length >= 4) {
      groups.push({
        name: `Dinner Group ${groupIndex}`,
        description: `Auto-generated group with ${groupMembers.length} members based on compatibility matching`,
        members: groupMembers
      });
      groupIndex++;
    }
  }
  
  return groups;
}

function calculateGroupCompatibility(
  currentMembers: Profile[], 
  candidate: Profile, 
  criteria: MatchingCriteria[], 
  customWeights?: Record<string, number>
): number {
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const criterion of criteria) {
    const weight = customWeights?.[criterion.criteria_type] ?? criterion.weight;
    totalWeight += weight;
    
    let score = 0;
    
    switch (criterion.criteria_type) {
      case 'age_group':
        score = calculateAgeGroupCompatibility(currentMembers, candidate);
        break;
      case 'location':
        score = calculateLocationCompatibility(currentMembers, candidate);
        break;
      case 'family_profile':
        score = calculateFamilyCompatibility(currentMembers, candidate);
        break;
      case 'work_from_home':
        score = calculateWorkCompatibility(currentMembers, candidate);
        break;
      case 'season_interest':
        score = calculateSeasonCompatibility(currentMembers, candidate);
        break;
      default:
        score = 0.5; // Neutral score for unknown criteria
    }
    
    totalScore += score * weight;
  }
  
  return totalWeight > 0 ? totalScore / totalWeight : 0;
}

function calculateAgeGroupCompatibility(members: Profile[], candidate: Profile): number {
  const ageGroups = members.map(m => m.age_group).filter(Boolean);
  if (ageGroups.length === 0 || !candidate.age_group) return 0.5;
  
  const hasMatchingAge = ageGroups.includes(candidate.age_group);
  const ageVariety = new Set(ageGroups).size;
  
  // Prefer some age variety but with some similarity
  if (hasMatchingAge) return 0.8;
  if (ageVariety < 3) return 0.6; // Add variety
  return 0.3; // Too much variety
}

function calculateLocationCompatibility(members: Profile[], candidate: Profile): number {
  let score = 0;
  let factors = 0;
  
  // City compatibility
  const cities = members.map(m => m.city).filter(Boolean);
  if (cities.length > 0 && candidate.city) {
    score += cities.includes(candidate.city) ? 1 : 0.3;
    factors++;
  }
  
  // State compatibility
  const states = members.map(m => m.state_region).filter(Boolean);
  if (states.length > 0 && candidate.state_region) {
    score += states.includes(candidate.state_region) ? 1 : 0.1;
    factors++;
  }
  
  // Neighborhood compatibility (bonus)
  const neighborhoods = members.map(m => m.neighborhood_name).filter(Boolean);
  if (neighborhoods.length > 0 && candidate.neighborhood_name) {
    score += neighborhoods.includes(candidate.neighborhood_name) ? 0.2 : 0;
  }
  
  return factors > 0 ? Math.min(score / factors, 1) : 0.5;
}

function calculateFamilyCompatibility(members: Profile[], candidate: Profile): number {
  const familyProfiles = members.map(m => m.family_profile).filter(Boolean);
  if (familyProfiles.length === 0 || !candidate.family_profile) return 0.5;
  
  const hasMatchingFamily = familyProfiles.includes(candidate.family_profile);
  const familyVariety = new Set(familyProfiles).size;
  
  // Prefer some family stage variety
  if (hasMatchingFamily && familyVariety <= 2) return 0.9;
  if (!hasMatchingFamily && familyVariety < 3) return 0.7;
  return 0.4;
}

function calculateWorkCompatibility(members: Profile[], candidate: Profile): number {
  const workStyles = members.map(m => m.work_from_home).filter(Boolean);
  if (workStyles.length === 0 || !candidate.work_from_home) return 0.5;
  
  const hasMatchingWork = workStyles.includes(candidate.work_from_home);
  return hasMatchingWork ? 0.7 : 0.6; // Slight preference for similar work styles
}

function calculateSeasonCompatibility(members: Profile[], candidate: Profile): number {
  const seasonInterests = members.map(m => m.season_interest).filter(Boolean);
  if (seasonInterests.length === 0 || !candidate.season_interest) return 0.5;
  
  const hasMatchingSeason = seasonInterests.includes(candidate.season_interest);
  return hasMatchingSeason ? 0.8 : 0.4;
}

serve(handler);