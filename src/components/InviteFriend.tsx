import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Mail, 
  MessageSquare, 
  Users, 
  Facebook, 
  Copy,
  Send,
  Plus,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const InviteFriend = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [emailInvites, setEmailInvites] = useState<string[]>([""]);
  const [phoneInvites, setPhoneInvites] = useState<string[]>([""]);
  const [personalMessage, setPersonalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const defaultMessage = `Hi! I've been using this amazing neighborhood dinner app that helps neighbors connect through shared meals. I thought you'd love it too! Join me and let's build a stronger community together.`;

  const addEmailField = () => {
    setEmailInvites([...emailInvites, ""]);
  };

  const removeEmailField = (index: number) => {
    setEmailInvites(emailInvites.filter((_, i) => i !== index));
  };

  const updateEmail = (index: number, value: string) => {
    const updated = [...emailInvites];
    updated[index] = value;
    setEmailInvites(updated);
  };

  const addPhoneField = () => {
    setPhoneInvites([...phoneInvites, ""]);
  };

  const removePhoneField = (index: number) => {
    setPhoneInvites(phoneInvites.filter((_, i) => i !== index));
  };

  const updatePhone = (index: number, value: string) => {
    const updated = [...phoneInvites];
    updated[index] = value;
    setPhoneInvites(updated);
  };

  const handleEmailInvites = async () => {
    if (!user) {
      toast.error("Please log in to send invites");
      return;
    }

    const validEmails = emailInvites.filter(email => email.trim() && email.includes("@"));
    if (validEmails.length === 0) {
      toast.error("Please enter at least one valid email address");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement email invitation logic
      console.log("Sending email invites to:", validEmails);
      console.log("Message:", personalMessage || defaultMessage);
      
      toast.success(`Invitations sent to ${validEmails.length} email${validEmails.length > 1 ? 's' : ''}!`);
      setEmailInvites([""]);
      setPersonalMessage("");
    } catch (error) {
      toast.error("Failed to send invitations");
    } finally {
      setLoading(false);
    }
  };

  const handleSMSInvites = async () => {
    if (!user) {
      toast.error("Please log in to send invites");
      return;
    }

    const validPhones = phoneInvites.filter(phone => phone.trim());
    if (validPhones.length === 0) {
      toast.error("Please enter at least one phone number");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement SMS invitation logic
      console.log("Sending SMS invites to:", validPhones);
      console.log("Message:", personalMessage || defaultMessage);
      
      toast.success(`SMS invitations sent to ${validPhones.length} number${validPhones.length > 1 ? 's' : ''}!`);
      setPhoneInvites([""]);
      setPersonalMessage("");
    } catch (error) {
      toast.error("Failed to send SMS invitations");
    } finally {
      setLoading(false);
    }
  };

  const handleContactsImport = async () => {
    try {
      if ('contacts' in navigator && 'ContactsManager' in window) {
        // @ts-ignore - Contacts API is experimental
        const contacts = await navigator.contacts.select(['name', 'email'], { multiple: true });
        const emails = contacts.map((contact: any) => contact.email?.[0]).filter(Boolean);
        setEmailInvites([...emailInvites.filter(e => e.trim()), ...emails]);
        toast.success(`Imported ${emails.length} contacts`);
      } else {
        toast.error("Contacts import not supported on this device");
      }
    } catch (error) {
      toast.error("Failed to import contacts");
    }
  };

  const handleFacebookShare = () => {
    const url = window.location.origin;
    const text = personalMessage || defaultMessage;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const copyInviteLink = () => {
    const inviteUrl = `${window.location.origin}?ref=${user?.id || 'guest'}`;
    navigator.clipboard.writeText(inviteUrl);
    toast.success("Invite link copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="min-w-[200px]">
          <Users className="w-5 h-5 mr-2" />
          Invite Friends
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Invite Friends to Join</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              SMS
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Facebook className="w-4 h-4" />
              Social
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <Label htmlFor="message">Personal Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder={defaultMessage}
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Invitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {emailInvites.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="friend@example.com"
                      value={email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      className="flex-1"
                    />
                    {emailInvites.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeEmailField(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={addEmailField}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Email
                  </Button>
                  <Button onClick={handleEmailInvites} disabled={loading}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Email Invites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  SMS Invitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {phoneInvites.map((phone, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => updatePhone(index, e.target.value)}
                      className="flex-1"
                    />
                    {phoneInvites.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removePhoneField(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={addPhoneField}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Number
                  </Button>
                  <Button onClick={handleSMSInvites} disabled={loading}>
                    <Send className="w-4 h-4 mr-2" />
                    Send SMS Invites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Import from Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Import contacts from your device to easily invite multiple friends at once.
                </p>
                <Badge variant="outline" className="mb-4">
                  Note: Contact access requires permission and may not be available on all devices
                </Badge>
                <Button onClick={handleContactsImport} className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Import Contacts
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Facebook className="w-5 h-5" />
                  Social Media & Link Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button onClick={handleFacebookShare} variant="outline" className="w-full">
                    <Facebook className="w-4 h-4 mr-2" />
                    Share on Facebook
                  </Button>
                  <Button onClick={copyInviteLink} variant="outline" className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Invite Link
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share your personalized invite link on any social platform or messaging app.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default InviteFriend;