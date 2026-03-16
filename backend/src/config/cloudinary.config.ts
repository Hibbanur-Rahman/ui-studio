import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";

dotenv.config();

//config cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

const UploadToCloudinary = async (file: Express.Multer.File, folder?: string): Promise<string> => {
  try {
    const result = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folder || "turant_logistics",
          resource_type: "auto",
        },
        (error: any, result?: CloudinaryUploadResult) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return reject(new Error("Error uploading file"));
          }
          if (result?.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error("No secure URL returned from Cloudinary"));
          }
        }
      );
      stream?.end(file.buffer);
    });
    console.log("Cloudinary Upload Result:", result);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete an image from Cloudinary using its URL
 * @param imageUrl - The full Cloudinary URL of the image
 * @returns Promise<boolean> - true if deleted successfully
 */
const DeleteFromCloudinary = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{extension}
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');

    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL");
    }

    // Get everything after 'upload/v{version}/' or 'upload/'
    const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');

    // Remove version number if present (e.g., v1234567890/)
    const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, '');

    // Remove file extension to get public_id
    const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, '');

    console.log("Deleting image with public_id:", publicId);

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok' || result.result === 'not found') {
      console.log("Cloudinary Delete Result:", result);
      return true;
    } else {
      console.error("Failed to delete from Cloudinary:", result);
      return false;
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

export { cloudinary, UploadToCloudinary, DeleteFromCloudinary };
