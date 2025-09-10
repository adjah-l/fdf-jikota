/**
 * 5C Framework Helper Library
 * Computes each C status for groups based on events and existing data
 */

export interface FiveCStatus {
  commitment: { active: boolean; lastActivity?: Date };
  communication: { active: boolean; lastActivity?: Date };
  connection: { active: boolean; lastActivity?: Date };
  crisis: { active: boolean; lastActivity?: Date };
  celebration: { active: boolean; lastActivity?: Date };
}

export type FiveCKey = 'commitment' | 'communication' | 'connection' | 'crisis' | 'celebration';

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

  // Commitment: active if there's a commitment event in the last 14 days
  const commitment = hasRecentEvent('commitment', 14);

  // Communication: active if there's a communication event in the last 14 days
  const communication = hasRecentEvent('communication', 14);

  // Connection: active if there's a connection event in the last 14 days
  const connection = hasRecentEvent('connection', 14);

  // Crisis: active if there's a crisis event in the last 30 days
  const crisis = hasRecentEvent('crisis', 30);

  // Celebration: active if there's a celebration event in the last 60 days
  const celebration = hasRecentEvent('celebration', 60);

  return {
    commitment,
    communication,
    connection,
    crisis,
    celebration
  };
}

/**
 * Get the next suggested action to strengthen a specific C
 */
export function getNextAction(key: FiveCKey): { title: string; description: string } {
  const actions = {
    commitment: {
      title: "Renew commitment",
      description: "Reaffirm your dedication to the group"
    },
    communication: {
      title: "Start a conversation",
      description: "Check in with group members"
    },
    connection: {
      title: "Deepen relationships",
      description: "Share more personally with your group"
    },
    crisis: {
      title: "Offer support",
      description: "Help someone through a difficult time"
    },
    celebration: {
      title: "Share a win",
      description: "Celebrate a milestone or good news"
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