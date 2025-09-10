import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Smartphone, MessageSquare, Bell, Link, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSMS } from "@/hooks/useSMS";
import { toast } from "sonner";

interface SMSSettings {
  phone_number: string;
  sms_notifications: boolean;
  sms_replies: boolean;
}

export const SMSSettings = () => {
  const { user } = useAuth();
  const { getUserThreads, generateResponseLink } = useSMS();
  const [settings, setSettings] = useState<SMSSettings>({
    phone_number: "",
    sms_notifications: true,
    sms_replies: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [threads, setThreads] = useState<any[]>([]);

  useEffect(() => {
    loadSettings();
    if (user) {
      loadThreads();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('phone_number, sms_notifications, sms_replies')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading SMS settings:', error);
        return;
      }

      if (data) {
        setSettings({
          phone_number: data.phone_number || "",
          sms_notifications: data.sms_notifications ?? true,
          sms_replies: data.sms_replies ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading SMS settings:', error);
    }
  };

  const loadThreads = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userThreads = await getUserThreads(user.id);
      setThreads(userThreads);
    } catch (error) {
      console.error('Error loading threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          phone_number: settings.phone_number,
          sms_notifications: settings.sms_notifications,
          sms_replies: settings.sms_replies,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("SMS settings saved successfully!");
    } catch (error: any) {
      console.error('Error saving SMS settings:', error);
      toast.error("Failed to save SMS settings");
    } finally {
      setSaving(false);
    }
  };

  const copyResponseLink = (threadToken: string) => {
    const link = generateResponseLink(threadToken);
    navigator.clipboard.writeText(link);
    toast.success("Response link copied to clipboard!");
  };

  const formatPhoneNumber = (value: string) => {
    // Simple phone number formatting for US numbers
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `+1${cleaned.slice(-10)}`;
    }
    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setSettings(prev => ({ ...prev, phone_number: formatted }));
  };

  return (
    <div className="space-y-6">
      {/* SMS Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            SMS Settings
          </CardTitle>
          <CardDescription>
            Configure how you receive and respond to messages via SMS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              value={settings.phone_number}
              onChange={handlePhoneChange}
              placeholder="+1234567890"
              type="tel"
            />
            <p className="text-xs text-muted-foreground">
              Used for SMS notifications and responses
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive SMS alerts for new messages
                </p>
              </div>
              <Switch
                checked={settings.sms_notifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, sms_notifications: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Replies</Label>
                <p className="text-sm text-muted-foreground">
                  Allow responding directly via SMS
                </p>
              </div>
              <Switch
                checked={settings.sms_replies}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, sms_replies: checked }))
                }
              />
            </div>
          </div>

          <Button onClick={saveSettings} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>

      {/* Active SMS Threads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Active SMS Conversations
          </CardTitle>
          <CardDescription>
            Your current SMS threads and response links
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading conversations...</p>
          ) : threads.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              No SMS conversations yet
            </p>
          ) : (
            <div className="space-y-3">
              {threads.map((thread) => (
                <div key={thread.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">{thread.phone_number}</p>
                      <p className="text-sm text-muted-foreground">
                        Started {new Date(thread.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={thread.is_active ? "default" : "secondary"}>
                      {thread.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyResponseLink(thread.thread_token)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SMS Commands */}
      <Card>
        <CardHeader>
          <CardTitle>SMS Commands</CardTitle>
          <CardDescription>
            Available commands when responding via SMS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline">LINK</Badge>
              <p className="text-sm">Get a web link to view and respond to messages</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">STOP</Badge>
              <p className="text-sm">Unsubscribe from SMS notifications</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">START</Badge>
              <p className="text-sm">Resubscribe to SMS notifications</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">Any text</Badge>
              <p className="text-sm">Send a message to the conversation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};