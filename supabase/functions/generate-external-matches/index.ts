import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExternalProfile {
  id: string;
  mapped_data: any;
  validation_status: string;
  neighborhood_id?: string;
}

interface MatchingCriteria {
  id: string;
  name: string;
  weight: number;
  is_active: boolean;
  criteria_type: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { batchId, neighborhoodId } = await req.json();

    if (!batchId) {
      throw new Error('Batch ID is required');
    }

    console.log('Generating external matches for batch:', batchId);

    // Fetch valid external profiles from the batch
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('external_profiles')
      .select('*')
      .eq('batch_id', batchId)
      .eq('validation_status', 'valid');

    if (profilesError) throw profilesError;

    if (!profiles || profiles.length < 4) {
      throw new Error('Need at least 4 valid profiles to generate groups');
    }

    console.log(`Found ${profiles.length} valid profiles`);

    // Fetch active matching criteria
    const { data: criteria, error: criteriaError } = await supabaseClient
      .from('matching_criteria')
      .select('*')
      .eq('is_active', true);

    if (criteriaError) throw criteriaError;

    // Generate groups
    const groups = generateOptimalGroups(profiles, criteria || []);
    console.log(`Generated ${groups.length} groups`);

    let groupsCreated = 0;

    // Insert groups and members
    for (const group of groups) {
      // Insert group
      const { data: groupData, error: groupError } = await supabaseClient
        .from('external_groups')
        .insert({
          batch_id: batchId,
          name: `External Group ${groupsCreated + 1}`,
          description: `Generated from batch import`,
          group_size: group.members.length,
          neighborhood_id: neighborhoodId,
          compatibility_score: group.compatibility_score,
          status: 'pending_approval'
        })
        .select()
        .single();

      if (groupError) {
        console.error('Error creating group:', groupError);
        continue;
      }

      // Insert group members
      const memberRecords = group.members.map(member => ({
        group_id: groupData.id,
        profile_id: member.id,
        status: 'assigned'
      }));

      const { error: membersError } = await supabaseClient
        .from('external_group_members')
        .insert(memberRecords);

      if (membersError) {
        console.error('Error adding group members:', membersError);
        continue;
      }

      groupsCreated++;
    }

    console.log(`Successfully created ${groupsCreated} groups`);

    return new Response(
      JSON.stringify({
        groupsCreated,
        totalProfiles: profiles.length,
        membersMatched: groupsCreated * Math.floor(profiles.length / groupsCreated)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error generating external matches:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate matches'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});

function generateOptimalGroups(profiles: ExternalProfile[], criteria: MatchingCriteria[]) {
  const groups: Array<{ members: ExternalProfile[], compatibility_score: number }> = [];
  const usedProfiles = new Set<string>();
  
  // Shuffle profiles for randomness
  const shuffledProfiles = [...profiles].sort(() => Math.random() - 0.5);
  
  for (const profile of shuffledProfiles) {
    if (usedProfiles.has(profile.id)) continue;
    
    const group = [profile];
    usedProfiles.add(profile.id);
    
    // Find compatible members for this group (target group size of 4-6)
    const targetSize = Math.min(6, Math.max(4, Math.floor(profiles.length / Math.ceil(profiles.length / 5))));
    
    const remainingProfiles = shuffledProfiles.filter(p => !usedProfiles.has(p.id));
    
    while (group.length < targetSize && remainingProfiles.length > 0) {
      let bestMatch: ExternalProfile | null = null;
      let bestScore = -1;
      
      for (const candidate of remainingProfiles) {
        const score = calculateGroupCompatibility(candidate, group, criteria);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = candidate;
        }
      }
      
      if (bestMatch && bestScore > 0.3) { // Minimum compatibility threshold
        group.push(bestMatch);
        usedProfiles.add(bestMatch.id);
        remainingProfiles.splice(remainingProfiles.indexOf(bestMatch), 1);
      } else {
        break;
      }
    }
    
    if (group.length >= 4) {
      const compatibility_score = calculateGroupCompatibility(group[0], group.slice(1), criteria);
      groups.push({ members: group, compatibility_score });
    }
  }
  
  return groups;
}

function calculateGroupCompatibility(candidate: ExternalProfile, groupMembers: ExternalProfile[], criteria: MatchingCriteria[]): number {
  if (groupMembers.length === 0) return 1;
  
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const criterion of criteria) {
    const weight = criterion.weight;
    let score = 0;
    
    switch (criterion.criteria_type) {
      case 'age_group':
        score = calculateAgeGroupCompatibility(candidate, groupMembers);
        break;
      case 'family_profile':
        score = calculateFamilyCompatibility(candidate, groupMembers);
        break;
      case 'work_from_home':
        score = calculateWorkCompatibility(candidate, groupMembers);
        break;
      case 'location':
        score = calculateLocationCompatibility(candidate, groupMembers);
        break;
      case 'season_interest':
        score = calculateSeasonCompatibility(candidate, groupMembers);
        break;
      default:
        score = 0.5; // Neutral score for unknown criteria
    }
    
    totalScore += score * weight;
    totalWeight += weight;
  }
  
  return totalWeight > 0 ? totalScore / totalWeight : 0.5;
}

function calculateAgeGroupCompatibility(candidate: ExternalProfile, groupMembers: ExternalProfile[]): number {
  const candidateAge = candidate.mapped_data?.age_group;
  if (!candidateAge) return 0.5;
  
  const groupAges = groupMembers.map(m => m.mapped_data?.age_group).filter(Boolean);
  if (groupAges.length === 0) return 1;
  
  const sameAgeCount = groupAges.filter(age => age === candidateAge).length;
  const diversityBonus = groupAges.includes(candidateAge) ? 0.8 : 1.2; // Slight preference for diversity
  
  return Math.min(1, (sameAgeCount / groupAges.length) * diversityBonus);
}

function calculateFamilyCompatibility(candidate: ExternalProfile, groupMembers: ExternalProfile[]): number {
  const candidateFamily = candidate.mapped_data?.family_profile;
  if (!candidateFamily) return 0.5;
  
  const groupFamilies = groupMembers.map(m => m.mapped_data?.family_profile).filter(Boolean);
  if (groupFamilies.length === 0) return 1;
  
  const sameFamilyCount = groupFamilies.filter(family => family === candidateFamily).length;
  return sameFamilyCount > 0 ? 0.9 : 0.7; // Slight preference for similar family situations
}

function calculateWorkCompatibility(candidate: ExternalProfile, groupMembers: ExternalProfile[]): number {
  const candidateWork = candidate.mapped_data?.work_from_home;
  if (!candidateWork) return 0.5;
  
  const groupWork = groupMembers.map(m => m.mapped_data?.work_from_home).filter(Boolean);
  if (groupWork.length === 0) return 1;
  
  const sameWorkCount = groupWork.filter(work => work === candidateWork).length;
  return sameWorkCount > 0 ? 0.8 : 0.6;
}

function calculateLocationCompatibility(candidate: ExternalProfile, groupMembers: ExternalProfile[]): number {
  const candidateCity = candidate.mapped_data?.city;
  if (!candidateCity) return 0.5;
  
  const groupCities = groupMembers.map(m => m.mapped_data?.city).filter(Boolean);
  if (groupCities.length === 0) return 1;
  
  const sameCityCount = groupCities.filter(city => city === candidateCity).length;
  return sameCityCount > 0 ? 1 : 0.3; // Strong preference for same city
}

function calculateSeasonCompatibility(candidate: ExternalProfile, groupMembers: ExternalProfile[]): number {
  const candidateSeason = candidate.mapped_data?.season_interest;
  if (!candidateSeason) return 0.5;
  
  const groupSeasons = groupMembers.map(m => m.mapped_data?.season_interest).filter(Boolean);
  if (groupSeasons.length === 0) return 1;
  
  const sameSeasonCount = groupSeasons.filter(season => season === candidateSeason).length;
  return sameSeasonCount > 0 ? 0.9 : 0.7;
}