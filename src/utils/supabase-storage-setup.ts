
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function setupStorageBuckets() {
  try {
    console.log("Setting up storage buckets...");
    // Check if the melhorias bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    console.log("Available buckets:", buckets?.map(b => b.name).join(", ") || "none");
    
    const melhoriaBucketExists = buckets?.some(bucket => bucket.name === 'melhorias');
    
    if (!melhoriaBucketExists) {
      console.log("Bucket 'melhorias' does not exist in the Supabase project");
      
      // Try to create the bucket if it doesn't exist
      try {
        const { data: createData, error: createError } = await supabase.storage.createBucket('melhorias', {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          return false;
        }
        
        console.log('Successfully created melhorias bucket');
        return true;
      } catch (createErr) {
        console.error('Exception creating bucket:', createErr);
        return false;
      }
    } else {
      console.log('Bucket melhorias already exists');
      return true;
    }
  } catch (error) {
    console.error('Error setting up storage buckets:', error);
    return false;
  }
}
