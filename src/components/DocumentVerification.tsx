import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, Shield, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface DocumentVerificationProps {
  onVerificationComplete?: () => void;
}

export const DocumentVerification = ({ onVerificationComplete }: DocumentVerificationProps) => {
  const { user } = useAuth();
  const [documentType, setDocumentType] = useState<"drivers_license" | "passport">("drivers_license");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a JPEG or PNG image");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploadedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!uploadedFile || !user) return;

    setIsUploading(true);
    try {
      // Generate unique filename
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('verification-docs')
        .upload(fileName, uploadedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('verification-docs')
        .getPublicUrl(fileName);

      // Update profile with document info
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          verification_document_url: urlData.publicUrl,
          verification_document_type: documentType,
          verification_document_status: 'pending',
          verification_status: 'pending_review'
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast.success("Document uploaded successfully! Verification pending review.");
      onVerificationComplete?.();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Document Verification
        </CardTitle>
        <CardDescription>
          Upload your driver's license or passport for identity verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your document will be securely stored and only used for verification purposes. 
            It will be reviewed by our team and then permanently deleted from our servers.
          </AlertDescription>
        </Alert>

        <div>
          <Label className="text-sm font-medium">Document Type</Label>
          <RadioGroup
            value={documentType}
            onValueChange={(value) => setDocumentType(value as "drivers_license" | "passport")}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="drivers_license" id="drivers_license" />
              <Label htmlFor="drivers_license">Driver's License</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="passport" id="passport" />
              <Label htmlFor="passport">Passport</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Upload Document</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            {previewUrl ? (
              <div className="space-y-4">
                <img 
                  src={previewUrl} 
                  alt="Document preview" 
                  className="mx-auto max-w-xs max-h-48 object-contain rounded"
                />
                <p className="text-sm text-muted-foreground">
                  {uploadedFile?.name}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadedFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  Choose Different File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <div>
                  <Label htmlFor="document-upload" className="cursor-pointer">
                    <div className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      JPEG or PNG (max 5MB)
                    </div>
                  </Label>
                  <input
                    id="document-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleUpload}
            disabled={!uploadedFile || isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>Processing...</>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Submit for Verification
              </>
            )}
          </Button>
        </div>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Verification Process:</strong>
            <br />
            1. Upload a clear photo of your document
            <br />
            2. Our team reviews within 24-48 hours
            <br />
            3. You'll be notified of verification status
            <br />
            4. Document is permanently deleted after review
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};