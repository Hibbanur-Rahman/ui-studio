import multer from "multer";
import * as pathUtil from "path";
import { Request, Response, NextFunction } from "express";

// Storage configuration for memory (for cloud uploads)
// Using memory storage for all uploads since we're using Cloudinary
const memoryStorage = multer.memoryStorage();

// File filter for images
const imageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"));
    }
};

// File filter for CSV files
const csvFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === "text/csv" || pathUtil.extname(file.originalname).toLowerCase() === '.csv') {
        cb(null, true);
    } else {
        cb(new Error("Only CSV files are allowed!"));
    }
};

// File filter for both images and CSV
const generalFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'text/csv',
        'application/vnd.ms-excel'
    ];

    const isCSV = file.mimetype === "text/csv" || pathUtil.extname(file.originalname).toLowerCase() === '.csv';
    const isImage = file.mimetype.startsWith("image/");

    if (isImage || isCSV || allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("File type not allowed! Only images and CSV files are supported."));
    }
};

// File filter for notices (supports documents, images, and common file types)
const noticeFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'text/plain'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("File type not allowed! Only images, PDF, Word, Excel, CSV and text files are supported."));
    }
};

// File filter for document manager (only images jpg/png + pdf/doc/docx)
const documentFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("File type not allowed! Only JPG, PNG, PDF, DOC and DOCX files are supported for documents."));
    }
};

// Upload configurations
const upload = multer({
    storage: memoryStorage, // Changed to memory storage for cloud uploads
    fileFilter: noticeFilter, // Changed to support more file types
    limits: {
        fileSize: 1024 * 1024 * 20, // Increased to 20MB limit
    }
});

const facultyUpload = multer({
    storage: memoryStorage, // Changed to memory storage for cloud uploads
    fileFilter: imageFilter,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB limit for images
    }
});

const csvUpload = multer({
    storage: memoryStorage, // Changed to memory storage for cloud uploads
    fileFilter: csvFilter,
    limits: {
        fileSize: 1024 * 1024 * 10, // 10MB limit for CSV
    }
});

// Upload configuration for notices (using memory storage for cloud upload)
const noticeUpload = multer({
    storage: memoryStorage,
    fileFilter: noticeFilter,
    limits: {
        fileSize: 1024 * 1024 * 20, // 20MB limit for notice files
    }
});

// Upload configuration for document manager (restricted file types)
const documentUpload = multer({
    storage: memoryStorage,
    fileFilter: documentFilter,
    limits: {
        fileSize: 1024 * 1024 * 20, // 20MB limit for document files
    }
});

// File filter for UPI receipts (PNG, JPG, JPEG, PDF only)
const receiptFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PNG, JPG, JPEG, and PDF files are allowed for receipts.'));
    }
};

// Upload configuration for UPI receipts (5 MB max)
const receiptUpload = multer({
    storage: memoryStorage,
    fileFilter: receiptFilter,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
    },
});

// Error handler middleware
const handleMulterError = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size allowed is 10MB.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected field. Please check the field name.'
            });
        }
    }

    if (error.message && error.message.includes('Only')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    next(error);
};

export {
    upload,
    facultyUpload,
    csvUpload,
    noticeUpload,
    documentUpload,
    receiptUpload,
    handleMulterError
};