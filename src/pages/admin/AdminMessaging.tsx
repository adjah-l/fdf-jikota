import { useState, useEffect } from 'react'
import { useOrganizations } from '@/hooks/useOrganizations'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Bell, 
  Plus, 
  Send, 
  Eye, 
  Edit,
  Trash2,
  Users,
  Calendar 
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageTemplateSchema } from '@/lib/schemas'
import type { MessageTemplate, MessageEvent } from '@/lib/schemas'

const eventTypes = [
  { value: 'group_draft', label: 'Group Draft Created', description: 'When a new group is initially formed' },
  { value: 'group_approval', label: 'Group Approved', description: 'When an admin approves a group' },
  { value: 'group_introduction', label: 'Group Introduction', description: 'Introduction email with member details' },
  { value: 'group_reminder', label: 'Group Reminder', description: 'Reminders about upcoming dinners' },
  { value: 'care_request', label: 'Care Request', description: 'New community care request posted' },
  { value: 'care_fulfilled', label: 'Care Fulfilled', description: 'Care request has been fulfilled' },
  { value: 'credits_low', label: 'Credits Low', description: 'User is running low on credits' },
  { value: 'welcome', label: 'Welcome Message', description: 'New member welcome message' },
]

const channels = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'sms', label: 'SMS', icon: Smartphone },
  { value: 'push', label: 'Push Notification', icon: Bell },
]

const templateVariables = [
  '{{user_name}}',
  '{{group_name}}',
  '{{group_members}}',
  '{{dinner_date}}',
  '{{location}}',
  '{{organization_name}}',
  '{{credits_balance}}',
  '{{request_title}}',
]

export const AdminMessagingPage = () => {
  const { currentOrg, hasRole } = useOrganizations()
  const { toast } = useToast()
  const [templates, setTemplates] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)
  const [testDialogOpen, setTestDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  const form = useForm<Partial<MessageTemplate>>({
    resolver: zodResolver(messageTemplateSchema.partial()),
    defaultValues: {
      is_active: true,
      variables: [],
    },
  })

  const fetchTemplates = async () => {
    if (!currentOrg) return

    try {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('org_id', currentOrg.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTemplates(data || [])
    } catch (error: any) {
      console.error('Error fetching templates:', error)
      toast({
        title: 'Error',
        description: 'Failed to load message templates',
        variant: 'destructive',
      })
    }
  }

  const fetchEvents = async () => {
    if (!currentOrg) return

    try {
      const { data, error } = await supabase
        .from('message_events')
        .select('*')
        .eq('org_id', currentOrg.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setEvents(data || [])
    } catch (error: any) {
      console.error('Error fetching events:', error)
    }
  }

  const saveTemplate = async (data: Partial<MessageTemplate>) => {
    if (!currentOrg) return

    setLoading(true)
    try {
      const templateData = {
        ...data,
        org_id: currentOrg.id,
      } as any

      let result
      if (editingTemplate) {
        result = await supabase
          .from('message_templates')
          .update(templateData)
          .eq('id', editingTemplate.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('message_templates')
          .insert(templateData)
          .select()
          .single()
      }

      if (result.error) throw result.error

      toast({
        title: 'Success',
        description: `Template ${editingTemplate ? 'updated' : 'created'} successfully`,
      })

      setTemplateDialogOpen(false)
      setEditingTemplate(null)
      form.reset()
      await fetchTemplates()
    } catch (error: any) {
      console.error('Error saving template:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to save template',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', templateId)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      })

      await fetchTemplates()
    } catch (error: any) {
      console.error('Error deleting template:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive',
      })
    }
  }

  const toggleTemplate = async (templateId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('message_templates')
        .update({ is_active: isActive })
        .eq('id', templateId)

      if (error) throw error

      toast({
        title: 'Success',
        description: `Template ${isActive ? 'activated' : 'deactivated'}`,
      })

      await fetchTemplates()
    } catch (error: any) {
      console.error('Error updating template:', error)
      toast({
        title: 'Error',
        description: 'Failed to update template',
        variant: 'destructive',
      })
    }
  }

  const sendTestMessage = async (templateId: string, testEmail: string) => {
    try {
      // In a real implementation, this would trigger a test message
      toast({
        title: 'Test Sent',
        description: `Test message sent to ${testEmail}`,
      })
      setTestDialogOpen(false)
    } catch (error: any) {
      console.error('Error sending test:', error)
      toast({
        title: 'Error',
        description: 'Failed to send test message',
        variant: 'destructive',
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'delivered':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getChannelIcon = (channel: string) => {
    const channelConfig = channels.find(c => c.value === channel)
    return channelConfig?.icon || Mail
  }

  useEffect(() => {
    if (currentOrg && hasRole(currentOrg.id, 'admin')) {
      fetchTemplates()
      fetchEvents()
    }
  }, [currentOrg])

  if (!currentOrg || !hasRole(currentOrg.id, 'admin')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground">You need admin permissions to access this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            Message Templates
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage automated messages for your community
          </p>
        </div>
        <Button onClick={() => setTemplateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Content */}
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Templates ({templates.length})</TabsTrigger>
          <TabsTrigger value="events">Recent Events ({events.length})</TabsTrigger>
          <TabsTrigger value="settings">Channel Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          {templates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((template) => {
                const eventType = eventTypes.find(e => e.value === template.event_type)
                const ChannelIcon = getChannelIcon(template.channel)
                
                return (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <ChannelIcon className="h-4 w-4" />
                            {template.name}
                          </CardTitle>
                          <CardDescription>
                            {eventType?.label} • {template.channel}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={template.is_active ? 'default' : 'secondary'}>
                            {template.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Switch
                            checked={template.is_active}
                            onCheckedChange={(checked) => toggleTemplate(template.id, checked)}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {template.subject && (
                          <div>
                            <Label className="text-xs text-muted-foreground">Subject</Label>
                            <p className="text-sm font-medium">{template.subject}</p>
                          </div>
                        )}
                        
                        <div>
                          <Label className="text-xs text-muted-foreground">Content Preview</Label>
                          <p className="text-sm line-clamp-2">{template.template_body}</p>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingTemplate(template)
                              form.reset(template)
                              setTemplateDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedTemplate(template)
                              setTestDialogOpen(true)
                            }}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Test
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first message template to get started
              </p>
              <Button onClick={() => setTemplateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => {
                const ChannelIcon = getChannelIcon(event.channel)
                
                return (
                  <Card key={event.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-full">
                            <ChannelIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{event.event_type}</p>
                            <p className="text-sm text-muted-foreground">
                              {event.channel} • {new Date(event.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No events yet</h3>
              <p className="text-muted-foreground">
                Message events will appear here once templates are active
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {channels.map((channel) => {
              const Icon = channel.icon
              
              return (
                <Card key={channel.value}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {channel.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Enabled</Label>
                        <Switch defaultChecked={channel.value === 'email'} />
                      </div>
                      <Button variant="outline" className="w-full">
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </DialogTitle>
            <DialogDescription>
              Create automated messages for different community events
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(saveTemplate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="e.g., Welcome New Members"
                  {...form.register('name')}
                />
              </div>
              <div>
                <Label htmlFor="template-channel">Channel</Label>
                <Select onValueChange={(value) => form.setValue('channel', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {channels.map(channel => (
                      <SelectItem key={channel.value} value={channel.value}>
                        <div className="flex items-center gap-2">
                          <channel.icon className="h-4 w-4" />
                          {channel.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="template-event">Event Type</Label>
              <Select onValueChange={(value) => form.setValue('event_type', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(event => (
                    <SelectItem key={event.value} value={event.value}>
                      <div>
                        <div className="font-medium">{event.label}</div>
                        <div className="text-xs text-muted-foreground">{event.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {form.watch('channel') === 'email' && (
              <div>
                <Label htmlFor="template-subject">Subject Line</Label>
                <Input
                  id="template-subject"
                  placeholder="Welcome to {{organization_name}}!"
                  {...form.register('subject')}
                />
              </div>
            )}

            <div>
              <Label htmlFor="template-body">Message Content</Label>
              <Textarea
                id="template-body"
                placeholder="Hello {{user_name}}, welcome to our community..."
                rows={8}
                {...form.register('template_body')}
              />
              <div className="mt-2">
                <Label className="text-xs text-muted-foreground">Available Variables:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {templateVariables.map(variable => (
                    <Badge key={variable} variant="outline" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setTemplateDialogOpen(false)
                  setEditingTemplate(null)
                  form.reset()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingTemplate ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Test Dialog */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Message</DialogTitle>
            <DialogDescription>
              Send a test message to verify your template
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="test-email">Test Email Address</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="test@example.com"
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => sendTestMessage(selectedTemplate?.id || '', '')}>
                <Send className="h-4 w-4 mr-2" />
                Send Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}