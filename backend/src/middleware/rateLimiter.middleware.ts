import rateLimit from 'express-rate-limit';

/**
 * Common Rate Limiter Factory
 * @param maxRequests Maximum requests allowed in the window
 * @param windowMinutes Time window in minutes
 * @param customMessage Custom error message
 */
export const createRateLimiter = (
    maxRequests: number = 100,
    windowMinutes: number = 1,
    customMessage: string = 'Too many requests from this IP. Please try again later.'
) => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max: maxRequests,
        message: {
            success: false,
            message: customMessage
        },
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
                || req.socket.remoteAddress
                || 'unknown';
        },
    });
};

// Rate limiter for delete account requests
export const deleteAccountRateLimiter = createRateLimiter(
    10,
    1,
    'Too many account deletion requests from this IP. Please try again after 1 minute.'
);

// General rate limiter for API routes
export const generalRateLimiter = createRateLimiter(
    100,
    1,
    'Too many requests from this IP. Please try again after 1 minute.'
);

// Specific rate limiter for vehicle routes
export const vehicleRateLimiter = createRateLimiter(
    100,
    1,
    'Too many vehicle API requests from this IP. Please try again after 1 minute.'
);

/**
 * User-based Rate Limiter (UserId + IP)
 * Tracks requests based on the authenticated UserId and their IP address.
 */
export const userAndIpRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests
    message: {
        success: false,
        message: 'Too many requests. Please try again after 1 minute.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: any) => {
        const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
            || req.socket.remoteAddress
            || 'unknown';

        // Use userId if authenticated, otherwise just IP
        const userId = req.user?.userId || 'anonymous';
        return `${userId}_${ip}`;
    },
});

/**
 * Login Rate Limiter (Mobile/Email + IP)
 * Tracks login attempts based on the mobile number or email and IP address.
 * Limits to 10 login attempts per minute per identifier+IP combination.
 */
export const loginRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 8, // 8 requests per minute
    message: {
        success: false,
        message: 'Too many attempts. Please try again after 1 minute.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: any) => {
        const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
            || req.socket.remoteAddress
            || 'unknown';

        // Get login identifier (mobile number or email from request body)
        const identifier = req.body?.phone || req.body?.email || req.body?.mobileNumber || 'unknown';

        // Normalize phone number (remove +91 prefix if present for consistent tracking)
        const normalizedIdentifier = typeof identifier === 'string'
            ? identifier.replace(/^\+91/, '').trim().toLowerCase()
            : identifier;

        return `login_${normalizedIdentifier}_${ip}`;
    },
    skipSuccessfulRequests: false, // Count all requests, even successful ones
});

