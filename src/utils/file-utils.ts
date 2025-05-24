
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a file has been processed before
 * @param fileName File name to check
 * @returns Boolean indicating if the file has been processed
 */
export const checkFileProcessed = async (fileName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('processed_files')
      .select('id')
      .eq('file_name', fileName)
      .limit(1);
      
    if (error) {
      console.error("Error checking processed file:", error);
      throw error;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error("Exception in checkFileProcessed:", error);
    // Default to false if there's an error, to allow processing
    return false;
  }
};

/**
 * Saves processed file information to database
 * @param fileName File name that was processed
 * @param receiptId ID of the generated receipt
 */
export const saveProcessedFile = async (fileName: string, receiptId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('processed_files')
      .insert({
        file_name: fileName,
        receipt_id: receiptId
      });
      
    if (error) {
      console.error("Error saving processed file:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in saveProcessedFile:", error);
    return false;
  }
};
