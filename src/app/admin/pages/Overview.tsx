import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, UserCheck, Heart, MessageSquare, TrendingUp, AlertCircle, Target } from "lucide-react";
import { flags } from "@/config/flags";

const AdminOverview = () => {
  // TODO: Replace with real data from API
  const overviewData = {
    stats: {
      totalMembers: 847,
      activeGroups: 124,
      pendingRequests: 12,
      careTransactions: 89,
      messagesThisWeek: 1247
    },
    trends: {
      memberGrowth: 12.5,
      groupFormation: 8.3,
      careActivity: 15.2,
      engagement: 9.7
    },
    recentActivity: [
      { type: "member", message: "25 new members joined this week", time: "Today", priority: "normal" },
      { type: "group", message: "5 groups ready for approval", time: "2 hours ago", priority: "high" },
      { type: "care", message: "Care request volume increased 20%", time: "4 hours ago", priority: "normal" },
      { type: "system", message: "Monthly matching run completed", time: "Yesterday", priority: "normal" }
    ],
    upcomingTasks: [
      { title: "Review group approvals", count: 5, urgent: true },
      { title: "Process care requests", count: 12, urgent: false },
      { title: "Send weekly newsletter", count: 1, urgent: false },
      { title: "Update matching policies", count: 2, urgent: false }
    ],
    membershipGoals: {
      current: 847,
      target: 1000,
      progress: 84.7
    }
  };

  const quickActions = [
    { title: "Create Groups", description: "Run matching algorithm", action: "/admin2/matching-preview", icon: UserCheck },
    { title: "Import Members", description: "Add new members", action: "/admin2/import", icon: Users },
    { title: "Send Messages", description: "Broadcast to community", action: "/admin2/messaging-campaigns", icon: MessageSquare },
    { title: "View Analytics", description: "Detailed reports", action: "/admin2/analytics", icon: BarChart3 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Overview</h1>
        <p className="text-muted-foreground">
          Monitor your community health and manage key activities
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.stats.totalMembers.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{overviewData.trends.memberGrowth}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.stats.activeGroups}</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{overviewData.trends.groupFormation}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.stats.pendingRequests}</div>
            <div className="text-sm text-muted-foreground mt-1">Need review</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Care Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.stats.careTransactions}</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{overviewData.trends.careActivity}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.stats.messagesThisWeek.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">This week</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Towards Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Goal Progress</CardTitle>
          <CardDescription>Track progress towards your community goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Members</span>
              <span className="text-sm text-muted-foreground">
                {overviewData.membershipGoals.current} / {overviewData.membershipGoals.target}
              </span>
            </div>
            <Progress value={overviewData.membershipGoals.progress} className="h-2" />
            <div className="text-sm text-muted-foreground">
              {overviewData.membershipGoals.progress}% complete • {overviewData.membershipGoals.target - overviewData.membershipGoals.current} members to go
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5C KPIs (if enabled) */}
      {flags.enable5C && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              5C Framework Health
            </CardTitle>
            <CardDescription>Community practice indicators across all groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">78%</div>
                <div className="text-sm text-muted-foreground">Connection</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">65%</div>
                <div className="text-sm text-muted-foreground">Care</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">82%</div>
                <div className="text-sm text-muted-foreground">Contribution</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">45%</div>
                <div className="text-sm text-muted-foreground">Celebration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">89%</div>
                <div className="text-sm text-muted-foreground">Consistency</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickActions.map((action, index) => (
                <Button key={index} variant="ghost" className="justify-start h-auto p-3">
                  <action.icon className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overviewData.upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {task.urgent && <AlertCircle className="w-4 h-4 text-orange-500" />}
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">{task.count} items</div>
                    </div>
                  </div>
                  <Badge variant={task.urgent ? "destructive" : "outline"}>
                    {task.urgent ? "Urgent" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {overviewData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'member' ? 'bg-blue-500' :
                  activity.type === 'group' ? 'bg-green-500' :
                  activity.type === 'care' ? 'bg-purple-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  {activity.priority === 'high' && (
                    <Badge variant="destructive" className="text-xs">
                      High Priority
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;