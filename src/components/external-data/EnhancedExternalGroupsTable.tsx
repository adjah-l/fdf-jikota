import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronDown, 
  ChevronRight, 
  Mail, 
  MailCheck, 
  Undo2, 
  CheckCircle, 
  XCircle,
  Users,
  MapPin,
  FileText,
  Download,
  Trash2
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ExternalGroup } from '@/hooks/useExternalData';
import { useEnhancedExternalData } from '@/hooks/useEnhancedExternalData';
import { useToast } from '@/hooks/use-toast';

interface EnhancedExternalGroupsTableProps {
  groups: ExternalGroup[];
  onApprove?: (groupId: string) => void;
  onReject?: (groupId: string) => void;
  onExport?: (format: 'pdf' | 'excel', groupIds?: string[], batchId?: string) => void;
  loading?: boolean;
  batchId?: string;
}

export const EnhancedExternalGroupsTable: React.FC<EnhancedExternalGroupsTableProps> = ({
  groups,
  onApprove,
  onReject,
  onExport,
  loading,
  batchId
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const { 
    revertGroupApproval, 
    sendGroupIntroduction, 
    clearAllGroups,
    loading: actionLoading 
  } = useEnhancedExternalData();
  const { toast } = useToast();

  const toggleExpanded = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleSelected = (groupId: string) => {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(groupId)) {
      newSelected.delete(groupId);
    } else {
      newSelected.add(groupId);
    }
    setSelectedGroups(newSelected);
  };

  const selectAll = () => {
    if (selectedGroups.size === groups.length) {
      setSelectedGroups(new Set());
    } else {
      setSelectedGroups(new Set(groups.map(g => g.id)));
    }
  };

  const handleRevertApproval = async (groupId: string) => {
    const success = await revertGroupApproval(groupId);
    if (success) {
      toast({
        title: "Group Reverted",
        description: "Group approval has been reverted successfully."
      });
      // Refresh would be handled by parent component
    } else {
      toast({
        title: "Error",
        description: "Failed to revert group approval.",
        variant: "destructive"
      });
    }
  };

  const handleSendIntroduction = async (groupId: string) => {
    const success = await sendGroupIntroduction(groupId);
    if (success) {
      toast({
        title: "Introduction Sent",
        description: "Group introduction email has been sent successfully."
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to send introduction email.",
        variant: "destructive"
      });
    }
  };

  const handleClearAllGroups = async () => {
    if (!batchId) return;
    
    try {
      await clearAllGroups(batchId);
      toast({
        title: "Success",
        description: "All groups cleared successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to clear groups",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string, emailSent: boolean = false) => {
    switch (status) {
      case 'pending_approval':
        return <Badge variant="outline">Pending Review</Badge>;
      case 'approved':
        return (
          <div className="flex items-center gap-2">
            <Badge variant="default">Approved</Badge>
            {emailSent && <Badge variant="secondary"><MailCheck className="h-3 w-3 mr-1" />Email Sent</Badge>}
          </div>
        );
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCityFromMembers = (members: any[]) => {
    const cities = members
      .map(member => member.external_profiles?.mapped_data?.city)
      .filter(Boolean);
    return cities.length > 0 ? cities[0] : 'N/A';
  };

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No groups found for this batch.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            External Groups ({groups.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              disabled={loading}
            >
              {selectedGroups.size === groups.length ? 'Deselect All' : 'Select All'}
            </Button>
            {selectedGroups.size > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExport?.('excel', Array.from(selectedGroups), batchId)}
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExport?.('excel', undefined, batchId)}
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export All
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={loading || groups.length === 0}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear All Groups</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all groups in this batch. This action cannot be undone.
                        Are you sure you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearAllGroups} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Clear All Groups
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="w-10"></TableHead>
              <TableHead>Group Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Compatibility</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <React.Fragment key={group.id}>
                <TableRow className="border-b">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedGroups.has(group.id)}
                      onChange={() => toggleSelected(group.id)}
                      className="rounded border-border"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(group.id)}
                      className="p-0 h-6 w-6"
                    >
                      {expandedGroups.has(group.id) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {group.external_group_members?.length || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {getCityFromMembers(group.external_group_members || [])}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(group.status, !!group.email_sent_at)}
                  </TableCell>
                  <TableCell>
                    {group.compatibility_score ? 
                      <Badge variant="outline">{Math.round(group.compatibility_score)}%</Badge> : 
                      'N/A'
                    }
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(group.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      {group.status === 'pending_approval' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => onApprove?.(group.id)}
                            disabled={loading || actionLoading}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onReject?.(group.id)}
                            disabled={loading || actionLoading}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {group.status === 'approved' && (
                        <>
                          {!group.email_sent_at ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendIntroduction(group.id)}
                              disabled={actionLoading}
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              Send Intro
                            </Button>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              <MailCheck className="h-3 w-3 mr-1" />
                              Sent
                            </Badge>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRevertApproval(group.id)}
                            disabled={actionLoading}
                          >
                            <Undo2 className="h-3 w-3 mr-1" />
                            Revert
                          </Button>
                        </>
                      )}
                      
                      {group.status === 'rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRevertApproval(group.id)}
                          disabled={actionLoading}
                        >
                          <Undo2 className="h-3 w-3 mr-1" />
                          Undo Reject
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Expanded Member Details */}
                {expandedGroups.has(group.id) && (
                  <TableRow>
                    <TableCell colSpan={9} className="p-0">
                      <div className="px-4 py-3 bg-muted/30">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Users className="h-4 w-4" />
                            Group Members ({group.external_group_members?.length || 0})
                          </div>
                          
                          {group.external_group_members?.map((member, index) => {
                            const profile = member.external_profiles;
                            const mappedData = profile?.mapped_data || {};
                            const rawData = profile?.raw_data || {};
                            
                            return (
                              <div key={member.id} className="pl-6 border-l-2 border-border">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium">{mappedData.first_name} {mappedData.last_name}</p>
                                    <p className="text-muted-foreground">{mappedData.email}</p>
                                    <p className="text-muted-foreground">{mappedData.phone_number}</p>
                                  </div>
                                  <div>
                                    <p><span className="font-medium">City:</span> {mappedData.city}</p>
                                    <p><span className="font-medium">Age Group:</span> {mappedData.age_group}</p>
                                    <p><span className="font-medium">Family:</span> {mappedData.family_profile}</p>
                                  </div>
                                  <div>
                                    <p><span className="font-medium">Interests:</span> {mappedData.activities || 'N/A'}</p>
                                    <p><span className="font-medium">Group Interest:</span> {mappedData.group_interest || 'N/A'}</p>
                                  </div>
                                </div>
                                {index < (group.external_group_members?.length || 0) - 1 && (
                                  <Separator className="mt-3" />
                                )}
                              </div>
                            );
                          })}
                          
                          {group.description && (
                            <div className="pt-3 border-t border-border">
                              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                <FileText className="h-4 w-4" />
                                Group Description
                              </div>
                              <p className="text-sm text-muted-foreground pl-6">{group.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};