import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, Send, Search, Users, Bell, Settings, Smartphone, Link } from "lucide-react";
import { flags } from "@/config/flags";
import { useSMS } from "@/hooks/useSMS";
import { toast } from "sonner";

const MemberMessages = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sendSMSNotification, setSendSMSNotification] = useState(true);
  const { sendGroupNotification, loading: smsLoading } = useSMS();

  // TODO: Replace with real data from API
  const messagesData = {
    chats: [
      {
        id: 1,
        type: "group",
        name: "Downtown Group",
        lastMessage: "Looking forward to seeing everyone Thursday!",
        lastMessageTime: "2:30 PM",
        unreadCount: 2,
        avatar: "",
        participants: ["Sarah Johnson", "Mike Chen", "Emma Davis", "John Smith", "Lisa Wilson"],
        phoneNumbers: ["+1234567890", "+1234567891", "+1234567892", "+1234567893", "+1234567894"] // SMS integration
      },
      {
        id: 2,
        type: "direct",
        name: "Sarah Johnson",
        lastMessage: "Thanks for helping with the groceries!",
        lastMessageTime: "Yesterday",
        unreadCount: 0,
        avatar: "",
        participants: ["Sarah Johnson"],
        phoneNumbers: ["+1234567890"]
      },
      {
        id: 3,
        type: "group",
        name: "Community Announcements",
        lastMessage: "New care request: Babysitting needed",
        lastMessageTime: "Yesterday",
        unreadCount: 1,
        avatar: "",
        participants: ["System"],
        phoneNumbers: []
      }
    ],
    messages: [
      {
        id: 1,
        chatId: 1,
        sender: "Sarah Johnson",
        content: "Hey everyone! Just confirming for Thursday's dinner at my place. Should we do potluck style again?",
        timestamp: "2:00 PM",
        isOwn: false
      },
      {
        id: 2,
        chatId: 1,
        sender: "Mike Chen",
        content: "Sounds great! I'll bring my famous spring rolls 🥟",
        timestamp: "2:15 PM",
        isOwn: false
      },
      {
        id: 3,
        chatId: 1,
        sender: "You",
        content: "Perfect! I can bring a salad and dessert. What time should we arrive?",
        timestamp: "2:20 PM",
        isOwn: true
      },
      {
        id: 4,
        chatId: 1,
        sender: "Sarah Johnson",
        content: "Looking forward to seeing everyone Thursday!",
        timestamp: "2:30 PM",
        isOwn: false
      }
    ]
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    const chatData = messagesData.chats.find(chat => chat.id === selectedChat);
    
    // Send SMS notifications if enabled and chat has phone numbers
    if (sendSMSNotification && chatData?.phoneNumbers && chatData.phoneNumbers.length > 0) {
      await sendGroupNotification(
        chatData.phoneNumbers,
        messageInput,
        chatData.name,
        "You" // In real app, use actual user name
      );
    }
    
    // TODO: Implement API call to send message to web platform
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  const filteredChats = messagesData.chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChatData = messagesData.chats.find(chat => chat.id === selectedChat);
  const chatMessages = messagesData.messages.filter(msg => msg.chatId === selectedChat);

  if (!flags.enableMessaging) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Messaging Coming Soon</h3>
          <p className="text-muted-foreground">
            Group messaging and direct chat features are currently in development.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)]">
      <div className="flex h-full">
        {/* Chat List Sidebar */}
        <div className="w-80 border-r bg-muted/30 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Messages</h1>
              <Button size="sm" variant="ghost">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                  selectedChat === chat.id ? 'bg-muted' : ''
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback>
                        {chat.type === 'group' ? (
                          <Users className="w-5 h-5" />
                        ) : (
                          chat.name.split(' ').map(n => n[0]).join('')
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {chat.unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {chat.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.type === 'group' && (
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {chat.participants.length} members
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChatData ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-background">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedChatData.avatar} alt={selectedChatData.name} />
                      <AvatarFallback>
                        {selectedChatData.type === 'group' ? (
                          <Users className="w-5 h-5" />
                        ) : (
                          selectedChatData.name.split(' ').map(n => n[0]).join('')
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">{selectedChatData.name}</h2>
                      {selectedChatData.type === 'group' && (
                        <p className="text-sm text-muted-foreground">
                          {selectedChatData.participants.length} members
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Bell className="w-4 h-4" />
                    </Button>
                    {selectedChatData.phoneNumbers && selectedChatData.phoneNumbers.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Smartphone className="w-3 h-3 mr-1" />
                        SMS Enabled
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      {!message.isOwn && selectedChatData.type === 'group' && (
                        <p className="text-xs font-semibold mb-1 opacity-75">
                          {message.sender}
                        </p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isOwn ? 'opacity-75' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-background">
                {/* SMS Options */}
                {selectedChatData.phoneNumbers && selectedChatData.phoneNumbers.length > 0 && (
                  <div className="mb-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sms-notification"
                          checked={sendSMSNotification}
                          onCheckedChange={(checked) => setSendSMSNotification(checked as boolean)}
                        />
                        <label htmlFor="sms-notification" className="text-sm font-medium">
                          Send SMS notifications
                        </label>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <Smartphone className="w-3 h-3 mr-1" />
                        {selectedChatData.phoneNumbers.length} recipients
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Group members will receive SMS notifications and can respond via text or web link
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleSendMessage}
                    disabled={smsLoading}
                  >
                    {smsLoading ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberMessages;