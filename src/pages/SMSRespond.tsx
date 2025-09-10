import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Smartphone, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SMSThread {
  id: string;
  phone_number: string;
  thread_token: string;
  created_at: string;
  group_id?: string;
}

interface SMSMessage {
  id: string;
  body: string;
  direction: 'inbound' | 'outbound';
  created_at: string;
  from_number: string;
}

const SMSRespond = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState<SMSThread | null>(null);
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (token) {
      loadThread();
    }
  }, [token]);

  const loadThread = async () => {
    try {
      // Get thread by token
      const { data: threadData, error: threadError } = await supabase
        .rpc('get_thread_by_token', { token_param: token });

      if (threadError || !threadData) {
        toast.error("Invalid or expired link");
        navigate('/');
        return;
      }

      setThread(threadData);

      // Load messages for this thread
      const { data: messagesData, error: messagesError } = await supabase
        .from('sms_messages')
        .select('*')
        .eq('thread_id', threadData.id)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error loading messages:', messagesError);
      } else {
        setMessages((messagesData || []).map(msg => ({
          ...msg,
          direction: msg.direction as 'inbound' | 'outbound'
        })));
      }

    } catch (error) {
      console.error('Error loading thread:', error);
      toast.error("Failed to load conversation");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !thread) return;

    setSending(true);
    try {
      // Send SMS via our edge function
      const { data, error } = await supabase.functions.invoke('send-sms-notification', {
        body: {
          to: thread.phone_number,
          message: newMessage,
          threadId: thread.id,
        }
      });

      if (error) throw error;

      // Add message to local state immediately
      const newMsg: SMSMessage = {
        id: Date.now().toString(),
        body: newMessage,
        direction: 'outbound',
        created_at: new Date().toISOString(),
        from_number: 'system',
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
      toast.success("Message sent!");

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Link Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This conversation link is invalid or has expired.
            </p>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              SMS Conversation
            </CardTitle>
            <CardDescription>
              Respond to messages from {thread.phone_number}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{thread.phone_number}</Badge>
                <Badge variant="secondary">
                  {messages.length} message{messages.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/app')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Go to App
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.direction === 'outbound'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.body}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="mt-4 flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                rows={2}
              />
              <Button 
                onClick={sendMessage} 
                disabled={!newMessage.trim() || sending}
                size="sm"
                className="self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">How SMS Integration Works</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• You can respond directly via SMS to any message</li>
              <li>• Use this web interface for longer conversations</li>
              <li>• Text "LINK" to get this web link again</li>
              <li>• Text "STOP" to unsubscribe from notifications</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SMSRespond;