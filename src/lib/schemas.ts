import { z } from 'zod'

// Core organization schemas
export const organizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Organization name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  settings: z.record(z.any()).default({}),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  is_active: z.boolean().default(true),
})

export const orgRoleSchema = z.enum(['owner', 'admin', 'moderator', 'member'])

export const organizationMemberSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: orgRoleSchema,
  joined_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  is_active: z.boolean().default(true),
})

// Profile schemas with enhanced validation
export const profileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  full_name: z.string().min(1, 'Full name is required').max(100),
  first_name: z.string().min(1, 'First name is required').max(50).optional(),
  last_name: z.string().min(1, 'Last name is required').max(50).optional(),
  email: z.string().email('Invalid email address').optional(),
  phone_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  date_of_birth: z.string().date().optional(),
  avatar_url: z.string().url('Invalid avatar URL').optional(),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
  city: z.string().max(100).optional(),
  state_region: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  age_group: z.enum(['18-25', '26-35', '36-45', '46-55', '56-65', '65+']).optional(),
  family_profile: z.enum(['single', 'couple', 'family_with_kids', 'empty_nesters']).optional(),
  activities: z.array(z.string()).optional(),
  ways_to_serve: z.array(z.string()).optional(),
  willing_to_welcome: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

// Matching engine schemas
export const matchingPolicySchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  neighborhood_id: z.string().uuid(),
  mode: z.enum(['automatic', 'manual']).default('automatic'),
  default_group_size: z.number().int().min(3).max(12).default(5),
  family_group_size: z.number().int().min(2).max(8).default(4),
  
  // Weighting system (0-100)
  age_weight: z.number().int().min(0).max(100).default(30),
  location_weight: z.number().int().min(0).max(100).default(50),
  family_stage_weight: z.number().int().min(0).max(100).default(40),
  same_community_weight: z.number().int().min(0).max(100).default(50),
  gender_weight: z.number().int().min(0).max(100).default(40),
  stage_weight: z.number().int().min(0).max(100).default(60),
  
  // Hard constraints
  age_hard: z.boolean().default(false),
  location_hard: z.boolean().default(true),
  family_stage_hard: z.boolean().default(false),
  gender_hard: z.boolean().default(false),
  stage_hard: z.boolean().default(false),
  
  // Configuration options
  gender_mode: z.enum(['mixed', 'separate', 'flexible']).default('mixed'),
  gender_allowed: z.array(z.enum(['men', 'women', 'non_binary'])).default(['men', 'women']),
  max_distance_miles: z.number().int().min(1).max(100).default(25),
  
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const matchingRunSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  neighborhood_id: z.string().uuid().optional(),
  policy_snapshot: z.record(z.any()),
  input_criteria: z.record(z.any()),
  output_summary: z.record(z.any()),
  groups_created: z.number().int().min(0).default(0),
  members_matched: z.number().int().min(0).default(0),
  waitlist_count: z.number().int().min(0).default(0),
  run_by: z.string().uuid(),
  status: z.enum(['pending', 'running', 'completed', 'failed']).default('pending'),
  created_at: z.string().datetime(),
  completed_at: z.string().datetime().optional(),
})

// Messaging system schemas
export const messageTemplateSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  name: z.string().min(1, 'Template name is required').max(100),
  event_type: z.enum([
    'group_draft',
    'group_approval', 
    'group_introduction',
    'group_reminder',
    'care_request',
    'care_fulfilled',
    'credits_low',
    'welcome',
  ]),
  channel: z.enum(['email', 'sms', 'push']),
  subject: z.string().max(200).optional(),
  template_body: z.string().min(1, 'Template body is required'),
  variables: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const messageEventSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  template_id: z.string().uuid().optional(),
  recipient_id: z.string().uuid(),
  channel: z.enum(['email', 'sms', 'push']),
  event_type: z.string(),
  message_data: z.record(z.any()),
  status: z.enum(['pending', 'sent', 'delivered', 'failed']).default('pending'),
  sent_at: z.string().datetime().optional(),
  delivered_at: z.string().datetime().optional(),
  error_message: z.string().optional(),
  created_at: z.string().datetime(),
})

// Mutual care system schemas
export const serviceOfferSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  category: z.enum([
    'transportation',
    'childcare',
    'meals',
    'errands',
    'home_help',
    'tech_support',
    'emotional_support',
    'professional_skills',
    'other'
  ]),
  tags: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
  max_requests: z.number().int().min(1).optional(),
  credits_per_request: z.number().int().min(1).max(10).default(1),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const serviceRequestSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  requester_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  category: z.enum([
    'transportation',
    'childcare', 
    'meals',
    'errands',
    'home_help',
    'tech_support',
    'emotional_support',
    'professional_skills',
    'other'
  ]),
  urgency: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  tags: z.array(z.string()).default([]),
  status: z.enum(['open', 'assigned', 'completed', 'cancelled']).default('open'),
  credits_offered: z.number().int().min(1).max(10).default(1),
  fulfilled_by: z.string().uuid().optional(),
  fulfilled_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const transactionSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  from_user_id: z.string().uuid().optional(),
  to_user_id: z.string().uuid().optional(),
  amount: z.number().int(),
  transaction_type: z.enum(['service_completion', 'bonus', 'penalty', 'adjustment']),
  reference_id: z.string().uuid().optional(),
  reference_type: z.enum(['service_request', 'service_offer', 'admin_adjustment']).optional(),
  description: z.string().max(200).optional(),
  created_at: z.string().datetime(),
})

// External data schemas
export const externalDataSourceSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  name: z.string().min(1, 'Data source name is required').max(100),
  source_type: z.enum(['csv_upload', 'excel_upload', 'google_sheets', 'jotform', 'api']),
  source_identifier: z.string().optional(),
  configuration: z.record(z.any()).default({}),
  field_mapping: z.record(z.string()).default({}),
  is_active: z.boolean().default(true),
  created_by: z.string().uuid().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

// Activity Groups schema
export const activityGroupSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid().nullable(),
  name: z.string(),
  activity_type: z.enum(['dinner', 'prayer_study', 'workout', 'sports', 'flexible']),
  description: z.string().nullable(),
  criteria_snapshot: z.record(z.any()).nullable(),
  five_c_focus: z.string().nullable(),
  status: z.string(),
  scheduled_date: z.string().nullable(),
  host_user_id: z.string().uuid().nullable(),
  approved_by: z.string().uuid().nullable(),
  created_by: z.string().uuid().nullable(),
  max_members: z.number(),
  location_type: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Form validation schemas for user input
export const createOrganizationSchema = organizationSchema.pick({
  name: true,
  slug: true,
  description: true,
})

export const updateProfileSchema = profileSchema.partial().omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
})

export const createServiceOfferSchema = serviceOfferSchema.pick({
  title: true,
  description: true,
  category: true,
  tags: true,  
  max_requests: true,
  credits_per_request: true,
})

export const createServiceRequestSchema = serviceRequestSchema.pick({
  title: true,
  description: true,
  category: true,
  urgency: true,
  tags: true,
  credits_offered: true,
})

export const createActivityGroupSchema = activityGroupSchema.pick({
  name: true,
  activity_type: true,
  description: true,
  five_c_focus: true,
  max_members: true,
  location_type: true,
})

// Type exports
export type Organization = z.infer<typeof organizationSchema>
export type OrganizationMember = z.infer<typeof organizationMemberSchema>
export type OrgRole = z.infer<typeof orgRoleSchema>
export type Profile = z.infer<typeof profileSchema>
export type MatchingPolicy = z.infer<typeof matchingPolicySchema>
export type MatchingRun = z.infer<typeof matchingRunSchema>
export type MessageTemplate = z.infer<typeof messageTemplateSchema>
export type MessageEvent = z.infer<typeof messageEventSchema>
export type ServiceOffer = z.infer<typeof serviceOfferSchema>
export type ServiceRequest = z.infer<typeof serviceRequestSchema>
export type Transaction = z.infer<typeof transactionSchema>
export type ExternalDataSource = z.infer<typeof externalDataSourceSchema>
export type ActivityGroup = z.infer<typeof activityGroupSchema>

// Form types
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type CreateServiceOfferInput = z.infer<typeof createServiceOfferSchema>
export type CreateServiceRequestInput = z.infer<typeof createServiceRequestSchema>
export type CreateActivityGroupInput = z.infer<typeof createActivityGroupSchema>