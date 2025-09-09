import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileUploadDialog } from './FileUploadDialog';
import { EnhancedExternalGroupsTable } from './EnhancedExternalGroupsTable';
import { ExternalMatchingPolicyForm } from './ExternalMatchingPolicyForm';
import { ExternalEmailConfigForm } from './ExternalEmailConfigForm';
import { Upload, Database, Loader2, FileSpreadsheet, Users, Settings, Mail, RefreshCw } from 'lucide-react';
import { useExternalData, ExternalDataSource, ImportBatch, ExternalGroup } from '@/hooks/useExternalData';
import { useEnhancedExternalData } from '@/hooks/useEnhancedExternalData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const EnhancedDataSourcesManager: React.FC = () => {
  const [dataSources, setDataSources] = useState<ExternalDataSource[]>([]);
  const [importBatches, setImportBatches] = useState<ImportBatch[]>([]);
  const [externalGroups, setExternalGroups] = useState<ExternalGroup[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const { 
    uploadFile, 
    getDataSources, 
    getImportBatches, 
    getExternalGroups, 
    approveExternalGroup, 
    generateExternalMatches, 
    exportExternalGroups
  } = useExternalData();
  
  const enhancedData = useEnhancedExternalData();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();

    // Auto-refresh every 30s by checking server for any processing batches
    const interval = setInterval(async () => {
      try {
        const batches = await getImportBatches();
        if (batches?.some(b => b.status === 'processing')) {
          console.log('Auto-refreshing due to processing batches...');
          fetchData();
        }
      } catch (e) {
        console.warn('Auto-refresh check failed', e);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sourcesData, batchesData] = await Promise.all([
        getDataSources(),
        getImportBatches()
      ]);
      
      setDataSources(sourcesData || []);
      setImportBatches(batchesData || []);
      
      // If we have a selected batch, fetch its groups
      if (selectedBatch) {
        await fetchExternalGroups(selectedBatch);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data sources.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExternalGroups = async (batchId: string) => {
    try {
      const groupsData = await getExternalGroups(batchId);
      setExternalGroups(groupsData || []);
    } catch (error) {
      console.error('Error fetching external groups:', error);
      toast({
        title: "Error",
        description: "Failed to fetch groups.",
        variant: "destructive"
      });
    }
  };

  const handleBatchSelect = (batchId: string) => {
    setSelectedBatch(batchId);
    fetchExternalGroups(batchId);
  };

  const handleMarkBatchFailed = async (batchId: string) => {
    try {
      await supabase
        .from('import_batches')
        .update({ status: 'failed' })
        .eq('id', batchId);
      fetchData();
      toast({
        title: "Batch Marked Failed",
        description: "The batch has been marked as failed."
      });
    } catch (error) {
      console.error('Error marking batch as failed:', error);
      toast({
        title: "Error",
        description: "Failed to mark batch as failed.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateMatches = async (batchId: string) => {
    try {
      setActionLoading(true);
      await generateExternalMatches(batchId);
      await fetchExternalGroups(batchId);
      toast({
        title: "Matches Generated",
        description: "Groups have been generated successfully."
      });
    } catch (error) {
      console.error('Error generating matches:', error);
      toast({
        title: "Error",
        description: "Failed to generate matches.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveGroup = async (groupId: string) => {
    try {
      setActionLoading(true);
      await approveExternalGroup(groupId);
      if (selectedBatch) {
        await fetchExternalGroups(selectedBatch);
      }
      toast({
        title: "Group Approved",
        description: "Group has been approved successfully."
      });
    } catch (error) {
      console.error('Error approving group:', error);
      toast({
        title: "Error",
        description: "Failed to approve group.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectGroup = async (groupId: string) => {
    try {
      setActionLoading(true);
      await supabase
        .from('external_groups')
        .update({ status: 'rejected' })
        .eq('id', groupId);
      
      if (selectedBatch) {
        await fetchExternalGroups(selectedBatch);
      }
      toast({
        title: "Group Rejected",
        description: "Group has been rejected."
      });
    } catch (error) {
      console.error('Error rejecting group:', error);
      toast({
        title: "Error",
        description: "Failed to reject group.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportGroups = async (format: 'pdf' | 'excel', groupIds?: string[], batchId?: string) => {
    try {
      setActionLoading(true);
      await exportExternalGroups(format, groupIds, batchId);
      toast({
        title: "Export Started",
        description: `${format.toUpperCase()} export has been initiated.`
      });
    } catch (error) {
      console.error('Error exporting groups:', error);
      toast({
        title: "Error",
        description: "Failed to export groups.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileUpload = async (file: File, sourceType: 'csv_upload' | 'excel_upload', fieldMapping: Record<string, string>) => {
    try {
      await uploadFile(file, sourceType, fieldMapping);
      await fetchData();
      toast({
        title: "File Uploaded",
        description: "File has been uploaded and is being processed."
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'processing':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading external data sources...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import External Data
          </CardTitle>
          <CardDescription>
            Upload CSV or Excel files containing member information to create dinner groups.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadDialog>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </FileUploadDialog>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Import History
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {importBatches.length === 0 ? (
            <div className="text-center py-8">
              <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No import batches found. Upload a file to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importBatches.map((batch) => (
                  <TableRow 
                    key={batch.id}
                    className={selectedBatch === batch.id ? 'bg-muted/50' : ''}
                  >
                    <TableCell>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-medium text-left"
                        onClick={() => handleBatchSelect(batch.id)}
                      >
                        {batch.filename || 'Unknown file'}
                      </Button>
                    </TableCell>
                    <TableCell>{getStatusBadge(batch.status)}</TableCell>
                    <TableCell>
                      {batch.valid_records} valid, {batch.invalid_records} invalid
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(batch.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      {batch.status === 'completed' && batch.valid_records > 0 ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateMatches(batch.id)}
                          disabled={actionLoading}
                        >
                          <Users className="h-3 w-3 mr-1" />
                          Generate Groups
                        </Button>
                      ) : batch.status === 'processing' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkBatchFailed(batch.id)}
                          disabled={actionLoading}
                        >
                          Mark Failed
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Batch Details - Only show if a batch is selected */}
      {selectedBatch && (
        <Card>
          <CardHeader>
            <CardTitle>Batch Details</CardTitle>
            <CardDescription>
              Manage groups, matching configuration, and email templates for the selected batch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="groups" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="groups" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Groups ({externalGroups.length})
                </TabsTrigger>
                <TabsTrigger value="matching" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Matching Config
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Templates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="groups" className="mt-6">
                <EnhancedExternalGroupsTable
                  groups={externalGroups}
                  onApprove={handleApproveGroup}
                  onReject={handleRejectGroup}
                  onExport={handleExportGroups}
                  loading={actionLoading}
                  batchId={selectedBatch}
                />
              </TabsContent>
              
              <TabsContent value="matching" className="mt-6">
                <ExternalMatchingPolicyForm
                  batchId={selectedBatch}
                  onGenerateMatches={() => fetchExternalGroups(selectedBatch)}
                />
              </TabsContent>
              
              <TabsContent value="email" className="mt-6">
                <ExternalEmailConfigForm
                  batchId={selectedBatch}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};