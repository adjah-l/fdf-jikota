import { describe, it, expect } from 'vitest';
import { getActivityTypeLabel, type ActivityType } from '@/lib/activityTypes';

describe('Activity Types', () => {
  it('should return correct labels for all activity types', () => {
    const expectedLabels: Record<ActivityType, string> = {
      'dinner': 'Dinner',
      'prayer_study': 'Prayer / Bible Study', 
      'workout': 'Working Out',
      'sports': 'Watch Sporting Events',
      'flexible': 'Flexible'
    };

    Object.entries(expectedLabels).forEach(([type, expectedLabel]) => {
      const actualLabel = getActivityTypeLabel(type as ActivityType);
      expect(actualLabel).toBe(expectedLabel);
    });
  });

  it('should handle invalid activity types gracefully', () => {
    // @ts-expect-error - testing invalid input
    const result = getActivityTypeLabel('invalid_type');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should maintain consistent activity type list', () => {
    const activityTypes: ActivityType[] = [
      'dinner',
      'prayer_study', 
      'workout',
      'sports',
      'flexible'
    ];

    // Should have exactly 5 activity types
    expect(activityTypes).toHaveLength(5);
    
    // Each should return a valid label
    activityTypes.forEach(type => {
      const label = getActivityTypeLabel(type);
      expect(label).toBeTruthy();
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('should not contain group terminology in labels', () => {
    const activityTypes: ActivityType[] = [
      'dinner',
      'prayer_study',
      'workout', 
      'sports',
      'flexible'
    ];

    activityTypes.forEach(type => {
      const label = getActivityTypeLabel(type);
      expect(label).not.toContain('Group');
      expect(label).not.toContain('group');
    });
  });

  it('should use proper capitalization and formatting', () => {
    expect(getActivityTypeLabel('prayer_study')).toBe('Prayer / Bible Study');
    expect(getActivityTypeLabel('workout')).toBe('Working Out');
    expect(getActivityTypeLabel('sports')).toBe('Watch Sporting Events');
    
    // Should not have inconsistent formatting
    expect(getActivityTypeLabel('prayer_study')).not.toBe('prayer / bible study');
    expect(getActivityTypeLabel('workout')).not.toBe('working out');
  });
});