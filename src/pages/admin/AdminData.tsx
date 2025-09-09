import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useOrganizations } from '@/hooks/useOrganizations'
import { useEnhancedExternalData } from '@/hooks/useEnhancedExternalData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { 
  Upload, 
  FileSpreadsheet, 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  Download,
  RefreshCw,
  Eye,
  Trash2,
  Link as LinkIcon 
} from 'lucide-react'
import * as XLSX from 'xlsx'

const fieldMappingOptions = [
  { key: 'full_name', label: 'Full Name', required: true },
  { key: 'first_name', label: 'First Name', required: false },
  { key: 'last_name', label: 'Last Name', required: false },
  { key: 'email', label: 'Email Address', required: true },
  { key: 'phone_number', label: 'Phone Number', required: false },
  { key: 'age_group', label: 'Age Group', required: false },
  { key: 'family_profile', label: 'Family Status', required: false },
  { key: 'city', label: 'City', required: false },
  { key: 'state_region', label: 'State/Region', required: false },
  { key: 'activities', label: 'Interests/Activities', required: false },
  { key: 'willing_to_welcome', label: 'Willing to Host', required: false },
]

export const AdminDataPage = () => {
  const { currentOrg, hasRole } = useOrganizations()
  const { 
    getDataSources, 
    getImportBatches, 
    uploadFile, 
    getExternalGroups 
  } = useEnhancedExternalData()
  const { toast } = useToast()
  
  const [dataSources, setDataSources] = useState<any[]>([])
  const [importBatches, setImportBatches] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({})
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setCurrentFile(file)
    
    // Preview file content
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        let workbook: XLSX.WorkBook
        
        if (file.type.includes('csv')) {
          workbook = XLSX.read(data, { type: 'binary' })
        } else {
          workbook = XLSX.read(data, { type: 'array' })
        }
        
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        setPreviewData(jsonData.slice(0, 6) as any[])
        setUploadDialogOpen(true)
      } catch (error) {
        console.error('Error parsing file:', error)
        toast({
          title: 'Error',
          description: 'Failed to parse file. Please check the format.',
          variant: 'destructive',
        })
      }
    }
    
    if (file.type.includes('csv')) {
      reader.readAsBinaryString(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  })

  const handleUpload = async () => {
    if (!currentFile || !currentOrg) return

    setLoading(true)
    try {
      const sourceType = currentFile.type.includes('csv') ? 'csv_upload' : 'excel_upload'
      await uploadFile(currentFile, sourceType, fieldMapping)
      
      toast({
        title: 'Success',
        description: 'File uploaded successfully and processing started',
      })
      
      setUploadDialogOpen(false)
      setCurrentFile(null)
      setPreviewData([])
      setFieldMapping({})
      
      await fetchData()
    } catch (error: any) {
      console.error('Error uploading file:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload file',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSheetsConnect = async () => {
    if (!googleSheetsUrl || !currentOrg) return

    setLoading(true)
    try {
      // In a real implementation, this would connect to Google Sheets API
      toast({
        title: 'Coming Soon',
        description: 'Google Sheets integration will be available soon',
      })
    } catch (error: any) {
      console.error('Error connecting to Google Sheets:', error)
      toast({
        title: 'Error',
        description: 'Failed to connect to Google Sheets',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    if (!currentOrg) return

    setLoading(true)
    try {
      const [sourcesData, batchesData, groupsData] = await Promise.all([
        getDataSources(),
        getImportBatches(),
        getExternalGroups(),
      ])
      
      setDataSources(sourcesData)
      setImportBatches(batchesData)
      setGroups(groupsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    if (currentOrg && hasRole(currentOrg.id, 'admin')) {
      fetchData()
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

  const headers = previewData[0] || []
  const rows = previewData.slice(1) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Database className="h-8 w-8 text-primary" />
            External Data Sources
          </h1>
          <p className="text-muted-foreground mt-2">
            Import and manage community member data from various sources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Import Methods */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" {...getRootProps()}>
          <input {...getInputProps()} />
          <CardHeader className="text-center">
            <FileSpreadsheet className="h-12 w-12 mx-auto text-primary mb-2" />
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              {isDragActive ? 'Drop files here...' : 'CSV, Excel files supported'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              {isDragActive ? 'Drop Here' : 'Choose File'}
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-75">
          <CardHeader className="text-center">
            <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <CardTitle>Google Sheets</CardTitle>
            <CardDescription>Connect to live spreadsheets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                placeholder="Sheets URL..."
                value={googleSheetsUrl}
                onChange={(e) => setGoogleSheetsUrl(e.target.value)}
              />
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleSheetsConnect}
                disabled
              >
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-75">
          <CardHeader className="text-center">
            <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <CardTitle>JotForm</CardTitle>
            <CardDescription>Sync form submissions</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Tabs defaultValue="batches" className="space-y-6">
        <TabsList>
          <TabsTrigger value="batches">Import Batches</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="groups">Generated Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="batches" className="space-y-4">
          {importBatches.length > 0 ? (
            <div className="space-y-4">
              {importBatches.map((batch) => (
                <Card key={batch.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{batch.filename || 'Unnamed Import'}</CardTitle>
                        <CardDescription>
                          Imported on {new Date(batch.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(batch.status)}>
                        {batch.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{batch.valid_records}</div>
                        <p className="text-xs text-muted-foreground">Valid Records</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{batch.invalid_records}</div>
                        <p className="text-xs text-muted-foreground">Invalid Records</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{batch.total_records}</div>
                        <p className="text-xs text-muted-foreground">Total Records</p>
                      </div>
                    </div>
                    
                    {batch.status === 'processing' && (
                      <Progress value={60} className="mb-4" />
                    )}
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {batch.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Upload className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No imports yet</h3>
              <p className="text-muted-foreground">
                Import your first data file to get started
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          {dataSources.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {dataSources.map((source) => (
                <Card key={source.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {source.name}
                      <Badge variant={source.is_active ? 'default' : 'secondary'}>
                        {source.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {source.source_type} • Created {new Date(source.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Database className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No data sources</h3>
              <p className="text-muted-foreground">
                Configure your first data source to begin importing
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          {groups.length > 0 ? (
            <div className="space-y-4">
              {groups.map((group) => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{group.name}</CardTitle>
                      <Badge className={getStatusColor(group.status)}>
                        {group.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        {group.group_size} members • Score: {group.compatibility_score?.toFixed(1) || 'N/A'}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Group
                        </Button>
                        {group.status === 'pending_approval' && (
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No groups generated</h3>
              <p className="text-muted-foreground">
                Import data and run matching to generate groups
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Data Import</DialogTitle>
            <DialogDescription>
              Map your file columns to our system fields
            </DialogDescription>
          </DialogHeader>
          
          {previewData.length > 0 && (
            <div className="space-y-6">
              {/* Field Mapping */}
              <div className="space-y-4">
                <h3 className="font-medium">Field Mapping</h3>
                <div className="grid gap-4">
                  {fieldMappingOptions.map((field) => (
                    <div key={field.key} className="flex items-center gap-4">
                      <Label className="w-32 text-sm">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <Select
                        value={fieldMapping[field.key] || ''}
                        onValueChange={(value) => 
                          setFieldMapping(prev => ({ ...prev, [field.key]: value }))
                        }
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select column..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">-- Skip --</SelectItem>
                          {headers.map((header: string, index: number) => (
                            <SelectItem key={index} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Preview */}
              <div className="space-y-2">
                <h3 className="font-medium">Data Preview</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          {headers.map((header: string, index: number) => (
                            <th key={index} className="px-3 py-2 text-left font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row: any[], rowIndex: number) => (
                          <tr key={rowIndex} className="border-t">
                            {row.map((cell: any, cellIndex: number) => (
                              <td key={cellIndex} className="px-3 py-2">
                                {String(cell || '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={loading}>
                  {loading ? 'Uploading...' : 'Start Import'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}