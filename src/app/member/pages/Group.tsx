import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Users, MessageSquare, Phone, Mail, Clock } from "lucide-react";
import { FiveCMeter } from "@/components/fivec/FiveCMeter";
import { FiveCStatus } from "@/lib/fiveC";
import { flags } from "@/config/flags";

const MemberGroup = () => {
  // TODO: Replace with real data from API
  const groupData = {
    name: "Downtown Dinner Group",
    status: "Active",
    description: "A friendly group of neighbors who love good food and great conversation. We meet monthly for potluck dinners and seasonal activities.",
    nextMeeting: {
      date: "Thursday, December 12, 2024",
      time: "7:00 PM",
      location: "Sarah's House",
      address: "123 Main Street, Downtown",
      host: "Sarah Johnson"
    },
    members: [
      { id: 1, name: "Sarah Johnson", role: "Host", avatar: "", email: "sarah@example.com", phone: "(555) 123-4567", bio: "Love cooking and hosting!" },
      { id: 2, name: "Mike Chen", role: "Member", avatar: "", email: "mike@example.com", phone: "(555) 234-5678", bio: "Always up for trying new cuisines" },
      { id: 3, name: "Emma Davis", role: "Member", avatar: "", email: "emma@example.com", phone: "(555) 345-6789", bio: "Enjoys good conversations over dinner" },
      { id: 4, name: "John Smith", role: "Member", avatar: "", email: "john@example.com", phone: "(555) 456-7890", bio: "New to the neighborhood" },
      { id: 5, name: "Lisa Wilson", role: "Member", avatar: "", email: "lisa@example.com", phone: "(555) 567-8901", bio: "Vegetarian chef and gardener" }
    ],
    recentMessages: [
      { sender: "Sarah Johnson", message: "Looking forward to seeing everyone Thursday!", time: "2 hours ago" },
      { sender: "Mike Chen", message: "I'll bring my famous spring rolls", time: "4 hours ago" },
      { sender: "Emma Davis", message: "Should I bring a dessert?", time: "1 day ago" }
    ],
    upcomingMeetings: [
      { date: "Dec 12", time: "7:00 PM", type: "Monthly Dinner", host: "Sarah" },
      { date: "Jan 15", time: "6:30 PM", type: "New Year Celebration", host: "Mike" },
      { date: "Feb 20", time: "7:00 PM", type: "Valentine's Potluck", host: "Emma" }
    ]
  };

  // Mock 5C status - replace with real data
  const fiveCStatus: FiveCStatus = {
    commitment: { active: true, lastActivity: new Date('2024-12-09') },
    communication: { active: false },
    connection: { active: true, lastActivity: new Date('2024-12-01') },
    crisis: { active: false },
    celebration: { active: true, lastActivity: new Date('2024-12-05') }
  };

  return (
    <div className="space-y-8">
      {/* Group Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{groupData.name}</h1>
            <Badge className="bg-green-100 text-green-800">{groupData.status}</Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">{groupData.description}</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <MessageSquare className="w-4 h-4 mr-2" />
            Message Group
          </Button>
          <Button variant="outline">Share Group</Button>
        </div>
      </div>

      {/* Next Meeting Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Next Meeting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{groupData.nextMeeting.date}</span>
                <span className="text-muted-foreground">at {groupData.nextMeeting.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{groupData.nextMeeting.location}</div>
                  <div className="text-sm text-muted-foreground">{groupData.nextMeeting.address}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>Hosted by {groupData.nextMeeting.host}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="w-full">Confirm Attendance</Button>
              <Button variant="outline" className="w-full">Get Directions</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5C Framework Meter (if enabled) */}
      {flags.enable5C && (
        <FiveCMeter status={fiveCStatus} className="mb-8" />
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Group Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Group Members ({groupData.members.length})
            </CardTitle>
            <CardDescription>Your dinner group community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupData.members.map((member, index) => (
                <div key={member.id}>
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{member.name}</span>
                        {member.role === 'Host' && <Badge variant="secondary" className="text-xs">Host</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{member.bio}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < groupData.members.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages & Upcoming */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Recent Messages
              </CardTitle>
              <CardDescription>Latest group chat activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {groupData.recentMessages.map((msg, index) => (
                  <div key={index} className="border-l-2 border-muted pl-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{msg.sender}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.message}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Messages
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>Future group gatherings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {groupData.upcomingMeetings.map((meeting, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium">{meeting.type}</div>
                      <div className="text-sm text-muted-foreground">
                        {meeting.date} at {meeting.time} • Hosted by {meeting.host}
                      </div>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberGroup;