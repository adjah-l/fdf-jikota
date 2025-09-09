import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileUploadDialog } from './FileUploadDialog';
import { ExternalGroupsTable } from './ExternalGroupsTable';
import { Upload, Database, Loader2, FileSpreadsheet, Users } from 'lucide-react';
import { useExternalData, ExternalDataSource, ImportBatch, ExternalGroup } from '@/hooks/useExternalData';
import { supabase } from '@/integrations/supabase/client';

export const DataSourcesManager: React.FC = () => {
  const [dataSources, setDataSources] = useState<ExternalDataSource[]>([]);
  const [importBatches, setImportBatches] = useState<ImportBatch[]>([]);
  const [externalGroups, setExternalGroups] = useState<ExternalGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const { 
    getDataSources, 
    getImportBatches, 
    getExternalGroups,
    approveExternalGroup,
    generateExternalMatches,
    exportExternalGroups,
    loading: actionLoading 
  } = useExternalData();

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
      console.log('Fetching external data...');
      const [sources, batches, groups] = await Promise.all([
        getDataSources(),
        getImportBatches(),
        getExternalGroups()
      ]);
      
      console.log('Fetched data:', { sources: sources?.length, batches: batches?.length, groups: groups?.length });
      
      setDataSources(sources || []);
      setImportBatches(batches || []);
      setExternalGroups(groups || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays to prevent crash
      setDataSources([]);
      setImportBatches([]);
      setExternalGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = () => {
    fetchData();
  };

  const handleApproveGroup = async (groupId: string) => {
    try {
      await approveExternalGroup(groupId);
      fetchData();
    } catch (error) {
      console.error('Error approving group:', error);
    }
  };

  const handleMarkBatchFailed = async (batchId: string) => {
    try {
      await supabase
        .from('import_batches')
        .update({ status: 'failed' })
        .eq('id', batchId);
      fetchData();
    } catch (error) {
      console.error('Error marking batch as failed:', error);
    }
  };
  const handleGenerateMatches = async (batchId: string) => {
    try {
      await generateExternalMatches(batchId);
      fetchData();
    } catch (error) {
      console.error('Error generating matches:', error);
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

  const getSourceTypeIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'csv_upload':
      case 'excel_upload':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'google_sheets':
        return <Database className="h-4 w-4" />;
      case 'jotform':
        return <Database className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload External Data
          </CardTitle>
          <CardDescription>
            Upload CSV or Excel files with participant data to generate dinner groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadDialog onUploadComplete={handleUploadComplete}>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </FileUploadDialog>
        </CardContent>
      </Card>

      {/* Data Sources */}
      {dataSources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>
              Configured external data sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataSources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getSourceTypeIcon(source.source_type)}
                        <span className="font-medium">{source.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {source.source_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={source.is_active ? 'default' : 'secondary'}>
                        {source.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(source.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Import Batches */}
      {importBatches.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Import History</CardTitle>
                <CardDescription>
                  Recent data imports and their status. File processing typically takes 10-30 seconds.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processing Time</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">
                      {batch.filename || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Total: {batch.total_records}</div>
                        <div className="text-green-600">Valid: {batch.valid_records}</div>
                        {batch.invalid_records > 0 && (
                          <div className="text-red-600">Invalid: {batch.invalid_records}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            batch.status === 'completed' ? 'default' : 
                            batch.status === 'failed' ? 'destructive' : 
                            batch.status === 'processing' ? 'outline' : 'secondary'
                          }
                        >
                          {batch.status === 'processing' && (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          )}
                          {batch.status.toUpperCase()}
                        </Badge>
                        {batch.status === 'processing' && (
                          <span className="text-xs text-muted-foreground">
                            This usually takes 10-30 seconds
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {batch.status === 'completed' ? (
                          <span>
                            {Math.round((new Date(batch.updated_at).getTime() - new Date(batch.created_at).getTime()) / 1000)}s
                          </span>
                        ) : batch.status === 'processing' ? (
                          <span>Processing...</span>
                        ) : (
                          <span>—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(batch.created_at)}
                    </TableCell>
                    <TableCell>
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
          </CardContent>
        </Card>
      )}

      {/* External Groups */}
      <ExternalGroupsTable 
        groups={externalGroups}
        onApprove={handleApproveGroup}
        onExport={exportExternalGroups}
        loading={actionLoading}
      />
    </div>
  );
};