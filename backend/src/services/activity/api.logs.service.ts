import httpStatusConstant from "../../constant/httpStatus.constant";
import ApiLogsModel from "../../models/activity/api.logs.model";
import { CreateAPILogPayload } from "../../types/activity.types";

const CreateAPILogs = async (payload: CreateAPILogPayload) => {
  try {
    const { userId, endpoint, method, statusCode, responseTime, ipAddress } = payload;
    const apiLog = await ApiLogsModel.create({
      userId,
      endpoint,
      method,
      statusCode,
      responseTime,
      ipAddress
    });

    if (!apiLog) {
      return {
        success: false,
        status: httpStatusConstant.BAD_REQUEST,
        response: {
          message: "API Log creation failed",
        },
      };
    }

    return {
      success: true,
      status: httpStatusConstant.CREATED,
      response: {
        message: "API Log created successfully",
        apiLog,
      },
    };
  } catch (err) {
    console.error("Error in CreateAPILogs service:", err);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Internal server error",
        error: err instanceof Error ? err.message : String(err)
      },
    };
  }
};

const GetAllAPILogs = async (filters?: {
  userId?: string;
  method?: string;
  statusCode?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  page?: number;
}) => {
  try {
    const query: any = {};
    
    if (filters?.userId) query.userId = filters.userId;
    if (filters?.method) query.method = filters.method;
    if (filters?.statusCode) query.statusCode = filters.statusCode;
    
    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = filters.startDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }

    const limit = filters?.limit || 100;
    
    const apiLogs = await ApiLogsModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(((filters?.page || 1) - 1) * limit)
      .lean();

    const totalCount = await ApiLogsModel.countDocuments(query);

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "API Logs fetched successfully",
        data:apiLogs,
        count: apiLogs.length,
        totalCount
      },
    };
  } catch (err) {
    console.error("Error in GetAllAPILogs service:", err);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Internal server error",
        error: err instanceof Error ? err.message : String(err)
      },
    };
  }
};

const GetAPILogById = async (logId: string) => {
  try {
    const apiLog = await ApiLogsModel.findById(logId).lean();

    if (!apiLog) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "API Log not found",
        },
      };
    }

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "API Log fetched successfully",
        apiLog,
      },
    };
  } catch (err) {
    console.error("Error in GetAPILogById service:", err);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Internal server error",
        error: err instanceof Error ? err.message : String(err)
      },
    };
  }
};

const GetUserAPILogs = async (userId: string, limit: number = 50,page=1) => {
  try {
    const apiLogs = await ApiLogsModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "User API Logs fetched successfully",
        apiLogs,
        count: apiLogs.length
      },
    };
  } catch (err) {
    console.error("Error in GetUserAPILogs service:", err);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Internal server error",
        error: err instanceof Error ? err.message : String(err)
      },
    };
  }
};

const GetAPILogStats = async (userId?: string) => {
  try {
    const matchStage = userId ? { userId } : {};
    
    const stats = await ApiLogsModel.aggregate([
      { $match: matchStage },
      {
        $facet: {
          totalCalls: [{ $count: "count" }],
          byMethod: [
            {
              $group: {
                _id: "$method",
                count: { $sum: 1 }
              }
            }
          ],
          byStatusCode: [
            {
              $group: {
                _id: "$statusCode",
                count: { $sum: 1 }
              }
            }
          ],
          avgResponseTime: [
            {
              $group: {
                _id: null,
                avgTime: { $avg: "$responseTime" }
              }
            }
          ],
          slowestEndpoints: [
            {
              $group: {
                _id: "$endpoint",
                avgResponseTime: { $avg: "$responseTime" },
                count: { $sum: 1 }
              }
            },
            { $sort: { avgResponseTime: -1 } },
            { $limit: 10 }
          ],
          recentErrors: [
            { $match: { statusCode: { $gte: 400 } } },
            { $sort: { createdAt: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ]);

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "API Log statistics fetched successfully",
        stats: stats[0]
      },
    };
  } catch (err) {
    console.error("Error in GetAPILogStats service:", err);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Internal server error",
        error: err instanceof Error ? err.message : String(err)
      },
    };
  }
};

const DeleteOldAPILogs = async (daysToKeep: number = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await ApiLogsModel.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: `Deleted API Logs older than ${daysToKeep} days`,
        deletedCount: result.deletedCount
      },
    };
  } catch (err) {
    console.error("Error in DeleteOldAPILogs service:", err);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Internal server error",
        error: err instanceof Error ? err.message : String(err)
      },
    };
  }
};

const DeleteAPILogById = async (logId: string) => {
  try {
    const apiLog = await ApiLogsModel.findByIdAndDelete(logId);

    if (!apiLog) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "API Log not found",
        },
      };
    }

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "API Log deleted successfully",
      },
    };
  } catch (err) {
    console.error("Error in DeleteAPILogById service:", err);
    return {
      success: false,
      status: httpStatusConstant.INTERNAL_SERVER_ERROR,
      response: {
        message: "Internal server error",
        error: err instanceof Error ? err.message : String(err)
      },
    };
  }
};

const APILogsService = {
  CreateAPILogs,
  GetAllAPILogs,
  GetAPILogById,
  GetUserAPILogs,
  GetAPILogStats,
  DeleteOldAPILogs,
  DeleteAPILogById
};

export default APILogsService;