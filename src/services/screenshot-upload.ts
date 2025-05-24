
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads a screenshot to Supabase storage
 * @param {string} imageBase64 - Base64 string of the screenshot
 * @returns {Promise<string>} - URL of the uploaded screenshot or the original base64 if upload fails
 */
export async function uploadScreenshot(imageBase64: string): Promise<string> {
  try {
    if (!imageBase64) {
      throw new Error("No image provided");
    }

    // Convert base64 to blob
    const blob = await (await fetch(imageBase64)).blob();
    
    // Generate a unique filename for the screenshot
    const fileName = `screenshot_${uuidv4()}.jpg`;
    const filePath = fileName;
    
    console.log("Attempting to upload screenshot to melhorias bucket");
    
    // Upload the image to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('melhorias')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });
    
    if (uploadError) {
      console.error('Error uploading screenshot:', uploadError);
      return imageBase64; // Return the original base64 as fallback
    }
    
    // Get the public URL of the uploaded image
    const { data } = supabase.storage
      .from('melhorias')
      .getPublicUrl(filePath);
    
    console.log("Screenshot uploaded successfully, URL:", data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadScreenshot:', error);
    // Return the original base64 string if there's an error
    return imageBase64;
  }
}
