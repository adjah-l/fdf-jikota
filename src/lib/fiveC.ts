/**
 * 5C Framework Helper Library
 * Computes each C status for groups based on events and existing data
 */

export interface FiveCStatus {
  connection: { active: boolean; lastActivity?: Date };
  care: { active: boolean; lastActivity?: Date };
  contribution: { active: boolean; lastActivity?: Date };
  celebration: { active: boolean; lastActivity?: Date };
  consistency: { active: boolean; lastActivity?: Date };
}

export type FiveCKey = 'connection' | 'care' | 'contribution' | 'celebration' | 'consistency';

export interface FiveCEvent {
  id: string;
  c_key: FiveCKey;
  occurred_at: string;
  meta?: Record<string, any>;
}

/**
 * Compute 5C status for a group based on events and group data
 */
export function computeFiveCStatus(
  events: FiveCEvent[],
  groupData?: {
    lastMeetingDate?: Date;
    targetCadenceDays?: number;
  }
): FiveCStatus {
  const now = new Date();
  
  // Helper to check if an event is within the timeframe
  const hasRecentEvent = (key: FiveCKey, daysBack: number) => {
    const cutoff = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    const recentEvents = events
      .filter(e => e.c_key === key && new Date(e.occurred_at) >= cutoff)
      .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());
    
    return {
      active: recentEvents.length > 0,
      lastActivity: recentEvents[0] ? new Date(recentEvents[0].occurred_at) : undefined
    };
  };

  // Connection: active if there's a connection event in the last 14 days
  const connection = hasRecentEvent('connection', 14);

  // Care: active if there's a care event in the last 30 days
  const care = hasRecentEvent('care', 30);

  // Contribution: active if there's a contribution event in the last 60 days
  const contribution = hasRecentEvent('contribution', 60);

  // Celebration: active if there's a celebration event in the last 60 days
  const celebration = hasRecentEvent('celebration', 60);

  // Consistency: active if group met within target cadence
  let consistency = { active: false, lastActivity: undefined as Date | undefined };
  if (groupData?.lastMeetingDate && groupData?.targetCadenceDays) {
    const daysSinceMeeting = Math.floor(
      (now.getTime() - groupData.lastMeetingDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    consistency = {
      active: daysSinceMeeting <= groupData.targetCadenceDays,
      lastActivity: groupData.lastMeetingDate
    };
  } else {
    // Fallback: check for consistency events
    consistency = hasRecentEvent('consistency', 30);
  }

  return {
    connection,
    care,
    contribution,
    celebration,
    consistency
  };
}

/**
 * Get the next suggested action to strengthen a specific C
 */
export function getNextAction(key: FiveCKey): { title: string; description: string } {
  const actions = {
    connection: {
      title: "Log a check-in",
      description: "Share how you're doing with your group"
    },
    care: {
      title: "Offer help",
      description: "Post a service you can provide to others"
    },
    contribution: {
      title: "Host next meeting",
      description: "Take a turn hosting or organizing"
    },
    celebration: {
      title: "Share a win",
      description: "Celebrate a milestone or good news"
    },
    consistency: {
      title: "Schedule next meeting",
      description: "Keep your regular gathering rhythm"
    }
  };

  return actions[key];
}

/**
 * Get overall 5C health score (0-100)
 */
export function getFiveCHealthScore(status: FiveCStatus): number {
  const activeCount = Object.values(status).filter(s => s.active).length;
  return Math.round((activeCount / 5) * 100);
}