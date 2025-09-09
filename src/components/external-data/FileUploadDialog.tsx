import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, FileSpreadsheet, FileText, X } from 'lucide-react';
import { useExternalData } from '@/hooks/useExternalData';

interface FileUploadDialogProps {
  children: React.ReactNode;
  onUploadComplete?: () => void;
}

interface ColumnMapping {
  [key: string]: string;
}

const PROFILE_FIELDS = [
  { key: 'full_name', label: 'Full Name', required: true },
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'email', label: 'Email Address', required: true },
  { key: 'phone_number', label: 'Phone Number' },
  { key: 'age_group', label: 'Age Group' },
  { key: 'family_profile', label: 'Family Profile' },
  { key: 'work_from_home', label: 'Work From Home' },
  { key: 'new_to_city', label: 'New to City' },
  { key: 'city', label: 'City' },
  { key: 'state_region', label: 'State/Region' },
  { key: 'neighborhood_name', label: 'Neighborhood' },
  { key: 'season_interest', label: 'Season Interest' },
  { key: 'group_interest', label: 'Group Interest' },
  { key: 'activities', label: 'Activities' },
  { key: 'willing_to_welcome', label: 'Willing to Welcome' },
];

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({ children, onUploadComplete }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
  const [previewData, setPreviewData] = useState<any[]>([]);
  
  const { uploadFile, loading } = useExternalData();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      parseFileColumns(uploadedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  const parseFileColumns = async (file: File) => {
    // Use dynamic import to load xlsx for both CSV and Excel files
    const XLSX = await import('xlsx');
    
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      // Parse CSV using SheetJS to match server-side logic exactly
      const text = await file.text();
      const workbook = XLSX.read(text, { type: 'string' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON rows (header + data) - same as server
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
        defval: ''
      });

      if (jsonData.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row');
      }

      // Clean and normalize headers exactly like server
      const headers = (jsonData[0] as any[]).map((header, index) => {
        const cleanHeader = String(header || `Column_${index}`)
          .replace(/\uFEFF/g, '') // remove BOM
          .replace(/\s+/g, ' ')   // collapse whitespace
          .trim();
        return cleanHeader;
      });

      setColumns(headers);
      
      // Parse preview rows using same logic as server
      const preview = jsonData.slice(1, 6).map((values: any[]) => {
        const normalizedValues = Array(headers.length)
          .fill('')
          .map((_, index) => {
            const value = values[index];
            return value !== undefined && value !== null ? String(value).trim() : '';
          });

        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = normalizedValues[index];
        });
        return row;
      }).filter(row => Object.values(row).some(val => val));
      
      setPreviewData(preview);
      setStep('mapping');
    } else if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      // For Excel files, use same logic as server
      const arrayBuffer = await file.arrayBuffer();
      
      try {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON rows exactly like server
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
          defval: ''
        });
        
        if (jsonData.length < 2) {
          throw new Error('Excel file must have at least a header row and one data row');
        }

        // Clean and normalize headers exactly like server
        const headers = (jsonData[0] as any[]).map((header, index) => {
          const cleanHeader = String(header || `Column_${index}`)
            .replace(/\uFEFF/g, '') // remove BOM
            .replace(/\s+/g, ' ')   // collapse whitespace
            .trim();
          return cleanHeader;
        });

        setColumns(headers);
        
        // Parse preview rows using same logic as server
        const preview = jsonData.slice(1, 6).map((values: any[]) => {
          const normalizedValues = Array(headers.length)
            .fill('')
            .map((_, index) => {
              const value = values[index];
              return value !== undefined && value !== null ? String(value).trim() : '';
            });

          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = normalizedValues[index];
          });
          return row;
        }).filter(row => Object.values(row).some(val => val));
        
        setPreviewData(preview);
        setStep('mapping');
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        throw error;
      }
    }
  };

  const handleMappingChange = (fileColumn: string, profileField: string) => {
    setColumnMapping(prev => {
      const newMapping = { ...prev };
      if (profileField === 'skip' || profileField === '') {
        delete newMapping[fileColumn];
      } else {
        newMapping[fileColumn] = profileField;
      }
      return newMapping;
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    // Validate required fields are mapped
    const requiredFields = PROFILE_FIELDS.filter(f => f.required).map(f => f.key);
    const mappedFields = Object.values(columnMapping);
    const missingRequired = requiredFields.filter(field => !mappedFields.includes(field));
    
    if (missingRequired.length > 0) {
      alert(`Please map required fields: ${missingRequired.map(field => 
        PROFILE_FIELDS.find(f => f.key === field)?.label
      ).join(', ')}`);
      return;
    }

    try {
      const sourceType = file.type === 'text/csv' ? 'csv_upload' : 'excel_upload';
      await uploadFile(file, sourceType, columnMapping);
      
      setOpen(false);
      setFile(null);
      setColumns([]);
      setColumnMapping({});
      setStep('upload');
      setPreviewData([]);
      
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setColumns([]);
    setColumnMapping({});
    setStep('upload');
    setPreviewData([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload External Data</DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload CSV or Excel File</CardTitle>
                <CardDescription>
                  Upload a file containing participant data to generate dinner groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to select a file
                  </p>
                  <div className="flex justify-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      CSV
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <FileSpreadsheet className="h-3 w-3" />
                      Excel
                    </Badge>
                  </div>
                </div>

                {file && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {file.type === 'text/csv' ? (
                          <FileText className="h-5 w-5" />
                        ) : (
                          <FileSpreadsheet className="h-5 w-5" />
                        )}
                        <span className="font-medium">{file.name}</span>
                        <Badge variant="secondary">
                          {(file.size / 1024).toFixed(1)} KB
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" onClick={resetUpload}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'mapping' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Map Columns</CardTitle>
                <CardDescription>
                  Map your file columns to profile fields. Required fields are marked with an asterisk.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Required fields status */}
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Required Fields Status:</h4>
                  <div className="flex flex-wrap gap-2">
                    {PROFILE_FIELDS.filter(f => f.required).map((field) => {
                      const isMapped = Object.values(columnMapping).includes(field.key);
                      return (
                        <Badge 
                          key={field.key} 
                          variant={isMapped ? "default" : "destructive"}
                        >
                          {field.label} {isMapped ? '✓' : '✗'}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                
                {columns.map((column) => (
                  <div key={column} className="flex items-center gap-4">
                    <Label className="w-1/3 font-medium">{column}</Label>
                    <Select
                      value={columnMapping[column] || ''}
                      onValueChange={(value) => handleMappingChange(column, value)}
                    >
                      <SelectTrigger className="w-2/3">
                        <SelectValue placeholder="Select profile field..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="skip">-- Skip this column --</SelectItem>
                        {PROFILE_FIELDS.map((field) => (
                          <SelectItem key={field.key} value={field.key}>
                            {field.label} {field.required && '*'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>

            {previewData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Data Preview</CardTitle>
                  <CardDescription>
                    Preview of the first few rows from your file
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          {columns.map((column) => (
                            <th key={column} className="border border-border p-2 text-left font-medium">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, index) => (
                          <tr key={index}>
                            {columns.map((column) => (
                              <td key={column} className="border border-border p-2 text-sm">
                                {row[column] || '—'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={loading || !Object.values(columnMapping).some(v => v)}
              >
                {loading ? 'Uploading...' : 'Upload & Process'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};