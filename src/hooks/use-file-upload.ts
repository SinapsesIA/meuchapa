
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  
  /**
   * Upload file to Supabase Storage
   * @param file File to upload
   * @param bucketName Storage bucket name
   * @returns Public URL of uploaded file or null if failed
   */
  const uploadFile = async (file: File, bucketName: string = 'receipt_images'): Promise<string | null> => {
    try {
      setUploading(true);
      
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        toast.error('Erro ao verificar buckets de armazenamento');
        return null;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.log(`Bucket "${bucketName}" does not exist. Need to be created manually in Supabase`);
        toast.error(
          `Bucket "${bucketName}" não encontrado`, 
          { description: `Um administrador precisa criar o bucket "${bucketName}" no Supabase Dashboard` }
        );
        return null;
      }
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${uuidv4()}.${fileExt}`;
      
      console.log(`Uploading to bucket: ${bucketName}`);
      
      // Try direct upload
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error('Erro ao fazer upload da imagem: ' + uploadError.message);
        return null;
      }

      // Get public URL for the uploaded file
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      console.log('Upload successful, public URL:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Error in file upload process:', error);
      toast.error('Erro ao fazer upload da imagem');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { 
    uploadFile,
    uploading
  };
}
