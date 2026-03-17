import { Request, Response, NextFunction } from "express";
import ApiLogsModel from "../models/activity/api.logs.model";

/**
 * Middleware to automatically log all API requests
 * Captures: endpoint, method, status code, response time, user ID, and IP address
 */
export const apiLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    // Get IP address (handles proxies and load balancers)
    const ipAddress = 
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.headers['x-real-ip'] as string ||
        req.socket.remoteAddress ||
        req.ip ||
        'unknown';

    // Capture response
    const originalSend = res.send;
    const originalJson = res.json;

    // Override res.send
    res.send = function (data: any) {
        res.send = originalSend;
        logApiCall();
        return originalSend.call(this, data);
    };

    // Override res.json
    res.json = function (data: any) {
        res.json = originalJson;
        logApiCall();
        return originalJson.call(this, data);
    };

    // Function to log the API call
    const logApiCall = () => {
        const responseTime = Date.now() - startTime;
        const userId = (req as any).user?.userId || undefined;
        
        // Don't log health check, swagger docs, or static files
        const excludedPaths = ['/health', '/api-docs', '/swagger', '/favicon.ico'];
        const shouldLog = !excludedPaths.some(path => req.path.includes(path));

        if (shouldLog) {
            // Log asynchronously to not block response
            ApiLogsModel.create({
                endpoint: req.originalUrl || req.url,
                method: req.method,
                statusCode: res.statusCode,
                responseTime,
                userId,
                ipAddress
            }).catch(error => {
                console.error('Error logging API call:', error);
            });
        }
    };

    next();
};

/**
 * Get client IP address from request
 */
export const getClientIp = (req: Request): string => {
    return (
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.headers['x-real-ip'] as string ||
        req.socket.remoteAddress ||
        req.ip ||
        'unknown'
    );
};
