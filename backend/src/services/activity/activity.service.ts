import ActivityModel from "../../models/activity/activity.model";
import BaseUserModel from "../../models/user/base.user.model";
import httpStatusConstant from "../../constant/httpStatus.constant";
import { CreateActivityPayload } from "../../types/activity.types";

const CreateActivity = async (payload: CreateActivityPayload) => {
  try {
    const { userId, activityType, description } = payload;
    const activity = await ActivityModel.create({
      userId,
      activityType,
      description
    });
    
    if (!activity) {
      return {
        success: false,
        status: httpStatusConstant.BAD_REQUEST,
        response: {
          message: "Activity creation failed",
        },
      };
    }
    
    return {
      success: true,
      status: httpStatusConstant.CREATED,
      response: {
        message: "Activity created successfully",
        activity,
      },
    };
  } catch (err) {
    console.error("Error in CreateActivity service:", err);
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

interface GetActivitiesOptions {
  userId?: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const GetAllActivities = async (options: GetActivitiesOptions) => {
  try {
    const { 
      userId, 
      page = 1, 
      limit = 10, 
      search = '', 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = options;
    
    // Build filter
    const filter: any = userId ? { userId } : {};
    
    // Add search filter
    if (search) {
      filter.$or = [
        { activityType: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sortObject: any = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute queries
    const [activities, totalCount] = await Promise.all([
      ActivityModel.find(filter)
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityModel.countDocuments(filter)
    ]);
    
    // Fetch user details for each activity
    const userIds = [...new Set(activities.map(a => a.userId))];
    const users = await BaseUserModel.find({ userId: { $in: userIds } })
      .select('userId username email phone')
      .lean();
    
    // Create a map for quick lookup
    const userMap = new Map(users.map(u => [u.userId, u]));
    
    // Attach user data to activities
    const activitiesWithUsers = activities.map(activity => ({
      ...activity,
      user: userMap.get(activity.userId) || null
    }));
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "Activities fetched successfully",
        data: activitiesWithUsers,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      },
    };
  } catch (err) {
    console.error("Error in GetAllActivities service:", err);
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

const GetActivityById = async (activityId: string) => {
  try {
    const activity = await ActivityModel.findById(activityId).lean();
    
    if (!activity) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "Activity not found",
        },
      };
    }
    
    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "Activity fetched successfully",
        activity,
      },
    };
  } catch (err) {
    console.error("Error in GetActivityById service:", err);
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

const GetUserActivities = async (userId: string, options: Omit<GetActivitiesOptions, 'userId'> = {}) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = options;
    
    // Build filter
    const filter: any = { userId };
    
    // Add search filter
    if (search) {
      filter.$or = [
        { activityType: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sortObject: any = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute queries
    const [activities, totalCount] = await Promise.all([
      ActivityModel.find(filter)
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityModel.countDocuments(filter)
    ]);
    
    // Fetch user details for each activity
    const userIds = [...new Set(activities.map(a => a.userId))];
    const users = await BaseUserModel.find({ userId: { $in: userIds } })
      .select('userId username email phone')
      .lean();
    
    // Create a map for quick lookup
    const userMap = new Map(users.map(u => [u.userId, u]));
    
    // Attach user data to activities
    const activitiesWithUsers = activities.map(activity => ({
      ...activity,
      user: userMap.get(activity.userId) || null
    }));
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "User activities fetched successfully",
        activities: activitiesWithUsers,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      },
    };
  } catch (err) {
    console.error("Error in GetUserActivities service:", err);
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

const UpdateActivity = async (activityId: string, payload: Partial<CreateActivityPayload>) => {
  try {
    const activity = await ActivityModel.findByIdAndUpdate(
      activityId,
      payload,
      { new: true, runValidators: true }
    );
    
    if (!activity) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "Activity not found",
        },
      };
    }
    
    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "Activity updated successfully",
        activity,
      },
    };
  } catch (err) {
    console.error("Error in UpdateActivity service:", err);
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

const DeleteActivity = async (activityId: string) => {
  try {
    const activity = await ActivityModel.findByIdAndDelete(activityId);
    
    if (!activity) {
      return {
        success: false,
        status: httpStatusConstant.NOT_FOUND,
        response: {
          message: "Activity not found",
        },
      };
    }
    
    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "Activity deleted successfully",
      },
    };
  } catch (err) {
    console.error("Error in DeleteActivity service:", err);
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

const GetActivityStats = async () => {
  try {
    const totalActivities = await ActivityModel.countDocuments();
    const activitiesByType = await ActivityModel.aggregate([
      { $group: { _id: "$activityType", count: { $sum: 1 } } }
    ]);

    return {
      success: true,
      status: httpStatusConstant.OK,
      response: {
        message: "Activity stats fetched successfully",
        stats: {
          totalActivities,
          activitiesByType
        }
      },
    };
  } catch (err) {
    console.error("Error in GetActivityStats service:", err);
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
const ActivityService = {
  CreateActivity,
  GetAllActivities,
  GetActivityById,
  GetUserActivities,
  UpdateActivity,
  DeleteActivity,
  GetActivityStats
};  

export default ActivityService;