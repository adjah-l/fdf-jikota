import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, Mail } from 'lucide-react';
import { useEnhancedExternalData, ExternalBatchEmailConfig } from '@/hooks/useEnhancedExternalData';
import { useToast } from '@/hooks/use-toast';

interface ExternalEmailConfigFormProps {
  batchId: string;
  onConfigChange?: (config: Partial<ExternalBatchEmailConfig>) => void;
}

export const ExternalEmailConfigForm: React.FC<ExternalEmailConfigFormProps> = ({
  batchId,
  onConfigChange
}) => {
  const [config, setConfig] = useState<Partial<ExternalBatchEmailConfig>>({
    subject: 'Your Five Course Dinner Group Assignment',
    from_name: 'Five Course',
    from_email: 'groups@fivecourse.org',
    body_template: `Hello {{member_names}}!

We're excited to introduce you to your Five Course dinner group! You've been carefully matched based on your shared interests and proximity.

Your Group Members:
{{group_member_details}}

Group Details:
- Group Name: {{group_name}}
- Suggested Meeting: {{suggested_meeting_time}}
- Location: {{group_location}}

Next Steps:
1. Reach out to your group members to coordinate your dinner
2. Decide on a host location or restaurant
3. Plan your menu and enjoy getting to know each other!

If you have any questions, please don't hesitate to reach out.

Best regards,
{{from_name}}`
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { 
    loading, 
    getEmailConfig, 
    createOrUpdateEmailConfig 
  } = useEnhancedExternalData();
  const { toast } = useToast();

  useEffect(() => {
    loadExistingConfig();
  }, [batchId]);

  const loadExistingConfig = async () => {
    const existingConfig = await getEmailConfig(batchId);
    if (existingConfig) {
      setConfig(existingConfig);
    }
  };

  const handleConfigChange = (field: keyof ExternalBatchEmailConfig, value: string) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    setHasChanges(true);
    onConfigChange?.(newConfig);
  };

  const saveConfig = async () => {
    const success = await createOrUpdateEmailConfig(batchId, config);
    if (success) {
      setHasChanges(false);
      toast({
        title: "Email Template Saved",
        description: "Email configuration has been saved successfully."
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save email configuration.",
        variant: "destructive"
      });
    }
  };

  const renderPreview = () => {
    const sampleData: Record<string, string> = {};
    sampleData["member_names"] = "John and Sarah";
    sampleData["group_member_details"] = "• John Smith (john@email.com) - 555-0123\n• Sarah Jones (sarah@email.com) - 555-0124";
    sampleData["group_name"] = "Downtown Foodies";
    sampleData["suggested_meeting_time"] = "Next Friday at 7:00 PM";
    sampleData["group_location"] = "Downtown area";
    sampleData["from_name"] = config.from_name || "Five Course";

    let preview = config.body_template || '';
    Object.entries(sampleData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return preview;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Email Configuration
          {hasChanges && <Badge variant="secondary">Unsaved Changes</Badge>}
        </CardTitle>
        <CardDescription>
          Customize the email template sent to group members when groups are approved.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Headers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from-name">From Name</Label>
            <Input
              id="from-name"
              value={config.from_name || ''}
              onChange={(e) => handleConfigChange('from_name', e.target.value)}
              placeholder="Five Course"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="from-email">From Email</Label>
            <Input
              id="from-email"
              type="email"
              value={config.from_email || ''}
              onChange={(e) => handleConfigChange('from_email', e.target.value)}
              placeholder="groups@fivecourse.org"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject Line</Label>
          <Input
            id="subject"
            value={config.subject || ''}
            onChange={(e) => handleConfigChange('subject', e.target.value)}
            placeholder="Your Five Course Dinner Group Assignment"
          />
        </div>

        {/* Email Body */}
        <div className="space-y-2">
          <Label htmlFor="body-template">Email Body Template</Label>
          <Textarea
            id="body-template"
            value={config.body_template || ''}
            onChange={(e) => handleConfigChange('body_template', e.target.value)}
            rows={12}
            placeholder="Enter your email template..."
            className="font-mono text-sm"
          />
          <div className="text-xs text-muted-foreground">
            Available merge fields: member_names, group_member_details, group_name, 
            suggested_meeting_time, group_location, from_name
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Email Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>From:</strong> {config.from_name} &lt;{config.from_email}&gt;</div>
                <div><strong>Subject:</strong> {config.subject}</div>
                <hr className="my-3" />
                <div className="whitespace-pre-wrap bg-muted p-3 rounded">
                  {renderPreview()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={saveConfig} 
            disabled={!hasChanges || loading}
            variant="outline"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
          
          <Button 
            onClick={() => setShowPreview(!showPreview)} 
            variant="outline"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};