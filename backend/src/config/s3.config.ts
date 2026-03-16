import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config();

const s3Client: S3Client = new S3Client({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || "",
        secretAccessKey: process.env.AWS_SECRET_KEY || "",
    }
});

interface S3UploadResult {
    url: string;
    key: string;
    [key: string]: any;
}

const UploadToS3 = async (file: Express.Multer.File, folder?: string): Promise<string> => {
    try {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.originalname.replace(/\s+/g, '-')}`;
        const key = folder ? `${folder}/${fileName}` : `vertev/${fileName}`;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME || "",
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        // Construct the file URL
        const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        
        console.log("S3 Upload Result:", url);
        return url;
    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw new Error("Error uploading file to S3");
    }
};

export { s3Client, UploadToS3 };