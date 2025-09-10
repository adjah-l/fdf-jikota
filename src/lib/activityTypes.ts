export const ACTIVITY_TYPES = [
  { key: 'dinner', label: 'Dinner' },
  { key: 'prayer_study', label: 'Prayer / Bible Study' },
  { key: 'workout', label: 'Working Out' },
  { key: 'sports', label: 'Watch Sporting Events' },
  { key: 'flexible', label: 'Flexible' }
] as const;

export type ActivityType = typeof ACTIVITY_TYPES[number]["key"];

export function getActivityTypeLabel(key: ActivityType): string {
  return ACTIVITY_TYPES.find(type => type.key === key)?.label || 'Unknown';
}