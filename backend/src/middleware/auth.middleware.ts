import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import httpStatusConstant from "../constant/httpStatus.constant";
import UserModel from "../models/user/base.user.model";
dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    username?: string;
    role?: string;
  };
}

interface JWTPayload {
  user: any;
  iat?: number;
  exp?: number;
}

async function getToken(user: any): Promise<string> {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "10d") as any,
  });
  return token;
}

async function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(httpStatusConstant.UNAUTHORIZED)
      .json({ success: false, message: "Unauthorized: Token not provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(httpStatusConstant.UNAUTHORIZED)
      .json({ success: false, message: "Unauthorized: Token not provided" });
    return;
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    req.user = decoded.user;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(httpStatusConstant.UNAUTHORIZED)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
}

async function authenticateAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(httpStatusConstant.UNAUTHORIZED)
      .json({ success: false, message: "Unauthorized: Token not provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    req.user = decoded.user;

    // Check if user is admin
    if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPERADMIN") {
      res.status(httpStatusConstant.FORBIDDEN)
        .json({ success: false, message: "Access denied: Admin privileges required" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error verifying admin token:", error);
    res.status(httpStatusConstant.UNAUTHORIZED)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
}

//verify token for socket connections
const verifyTokenThroughSocket = async (authToken: string): Promise<any> => {
  try {
    const token = authToken.split(" ")[1];
    if (!token) {
      return {
        success: false,
        message: "Unauthorized: Token not provided",
      };
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;



    // Find user and check if still exists and is active
    const user = await UserModel.findOne({
      userId: decoded?.user?.userId,
      isDeleted: false,
    });

    if (!user) {
      return {
        success: false,
        message: "Unauthorized: User not found or inactive",
      };
    }

    return {
      success: true,
      data: {
        userId: user?.userId,
        email: user?.email,
        username: user?.username,
        role: user?.role
      },
    };
  } catch (error) {
    console.error("Error verifying token:", error);
    return {
      success: false,
      message: "Unauthorized: Invalid token",
    };
  }
}
export {
  getToken,
  verifyToken,
  authenticateAdmin,
  verifyTokenThroughSocket
};
