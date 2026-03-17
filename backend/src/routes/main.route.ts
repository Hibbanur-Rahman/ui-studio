import express from "express";
import httpStatusConstant from "../constant/httpStatus.constant";
import authRoutes from './auth/auth.route';
import userRoutes from './users/users.route';


const Router = express.Router();
Router.get("/health", (req, res) => {
    return res.status(httpStatusConstant.OK).json({
        success: true,
        message: "All api running well...."
    })
})

Router.use("/auth", authRoutes);
Router.use("/users", userRoutes)

export default Router;