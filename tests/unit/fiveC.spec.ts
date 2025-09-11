import { describe, it, expect } from 'vitest';
import { FiveCStatus, getNextAction } from '@/lib/fiveC';

describe('5C Framework', () => {
  it('should have correct 5C structure', () => {
    const mockStatus: FiveCStatus = {
      commitment: { active: true, lastActivity: new Date() },
      communication: { active: false },
      connection: { active: true, lastActivity: new Date() },
      crisis: { active: false },
      celebration: { active: false }
    };

    // Should have exactly 5 C's
    const keys = Object.keys(mockStatus);
    expect(keys).toHaveLength(5);
    
    // Should contain all expected C's
    expect(keys).toContain('commitment');
    expect(keys).toContain('communication');
    expect(keys).toContain('connection');
    expect(keys).toContain('crisis');
    expect(keys).toContain('celebration');
  });

  it('should provide next action recommendations', () => {
    const cKeys: (keyof FiveCStatus)[] = [
      'commitment',
      'communication', 
      'connection',
      'crisis',
      'celebration'
    ];

    cKeys.forEach(cKey => {
      const action = getNextAction(cKey);
      expect(action).toHaveProperty('title');
      expect(action).toHaveProperty('description');
      expect(typeof action.title).toBe('string');
      expect(typeof action.description).toBe('string');
      expect(action.title.length).toBeGreaterThan(0);
      expect(action.description.length).toBeGreaterThan(0);
    });
  });

  it('should track activity status correctly', () => {
    const activeStatus: FiveCStatus = {
      commitment: { active: true, lastActivity: new Date('2024-12-09') },
      communication: { active: true, lastActivity: new Date('2024-12-08') },
      connection: { active: true, lastActivity: new Date('2024-12-07') },
      crisis: { active: false },
      celebration: { active: true, lastActivity: new Date('2024-12-06') }
    };

    // Should properly track active/inactive states
    expect(activeStatus.commitment.active).toBe(true);
    expect(activeStatus.communication.active).toBe(true);
    expect(activeStatus.connection.active).toBe(true);
    expect(activeStatus.crisis.active).toBe(false);
    expect(activeStatus.celebration.active).toBe(true);

    // Active items should have lastActivity dates
    expect(activeStatus.commitment.lastActivity).toBeInstanceOf(Date);
    expect(activeStatus.communication.lastActivity).toBeInstanceOf(Date);
    expect(activeStatus.connection.lastActivity).toBeInstanceOf(Date);
    expect(activeStatus.celebration.lastActivity).toBeInstanceOf(Date);

    // Inactive items may not have lastActivity
    expect(activeStatus.crisis.lastActivity).toBeUndefined();
  });

  it('should identify next focus area', () => {
    const mixedStatus: FiveCStatus = {
      commitment: { active: true, lastActivity: new Date() },
      communication: { active: false },
      connection: { active: true, lastActivity: new Date() },
      crisis: { active: false },
      celebration: { active: false }
    };

    // Find inactive C's
    const inactiveCs = Object.entries(mixedStatus)
      .filter(([_, status]) => !status.active)
      .map(([key, _]) => key as keyof FiveCStatus);

    expect(inactiveCs).toContain('communication');
    expect(inactiveCs).toContain('crisis');
    expect(inactiveCs).toContain('celebration');
    expect(inactiveCs).toHaveLength(3);

    // Should be able to get action for first inactive
    if (inactiveCs.length > 0) {
      const nextAction = getNextAction(inactiveCs[0]);
      expect(nextAction).toBeTruthy();
    }
  });

  it('should handle edge cases in 5C status', () => {
    // All active
    const allActiveStatus: FiveCStatus = {
      commitment: { active: true, lastActivity: new Date() },
      communication: { active: true, lastActivity: new Date() },
      connection: { active: true, lastActivity: new Date() },
      crisis: { active: true, lastActivity: new Date() },
      celebration: { active: true, lastActivity: new Date() }
    };

    const activeCount = Object.values(allActiveStatus).filter(status => status.active).length;
    expect(activeCount).toBe(5);

    // All inactive
    const allInactiveStatus: FiveCStatus = {
      commitment: { active: false },
      communication: { active: false },
      connection: { active: false },
      crisis: { active: false },
      celebration: { active: false }
    };

    const inactiveCount = Object.values(allInactiveStatus).filter(status => !status.active).length;
    expect(inactiveCount).toBe(5);
  });
});