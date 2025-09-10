import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, MessageSquare, Calendar, MapPin, Clock } from "lucide-react";

const MemberHome = () => {
  // TODO: Replace with real data from API
  const memberData = {
    currentGroup: {
      name: "Downtown Dinner Group",
      nextMeeting: "Thursday, Dec 12 at 7:00 PM",
      location: "Sarah's House - 123 Main St",
      members: 6
    },
    careCredits: 12,
    recentActivity: [
      { type: "group", message: "New message in Downtown Dinner Group", time: "2 hours ago" },
      { type: "care", message: "John requested help with moving", time: "5 hours ago" },
      { type: "system", message: "Welcome to the community!", time: "2 days ago" }
    ],
    upcomingEvents: [
      { title: "Group Dinner", date: "Dec 12", time: "7:00 PM" },
      { title: "Community Service Day", date: "Dec 15", time: "9:00 AM" }
    ]
  };

  const quickActions = [
    { title: "Message My Group", icon: MessageSquare, description: "Chat with group members", action: "/app/messages" },
    { title: "Request Care", icon: Heart, description: "Ask for help from community", action: "/app/care" },
    { title: "View Profile", icon: Users, description: "Update your information", action: "/app/profile" }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's what's happening in your community today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Group</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberData.currentGroup.name}</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Users className="w-4 h-4" />
              {memberData.currentGroup.members} members
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Care Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberData.careCredits}</div>
            <div className="text-sm text-muted-foreground mt-1">Available to spend</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Meeting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">Thursday</div>
            <div className="text-sm text-muted-foreground">Dec 12 at 7:00 PM</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Group Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              My Group
            </CardTitle>
            <CardDescription>Your current dinner group details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{memberData.currentGroup.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{memberData.currentGroup.nextMeeting}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{memberData.currentGroup.location}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm">Message Group</Button>
              <Button size="sm" variant="outline">View Details</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and activities</CardDescription>
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
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {memberData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'group' ? 'bg-blue-500' :
                    activity.type === 'care' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Don't miss these community activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {memberData.upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">{event.date} at {event.time}</div>
                  </div>
                  <Badge variant="outline">Upcoming</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Events
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberHome;