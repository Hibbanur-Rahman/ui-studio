import express from "express";
import {
  ChangePassword,
  CreatePasscode,
  FindUserByEmailOrPhone,
  GetUserDetails,
  Login,
  Register,
  UpdateProfile,
  Logout
} from "../../controller/auth/auth.controller";
import { handleValidationErrors } from "../../middleware/validation.middleware";
import {
  changePasswordValidation,
  loginValidation,
  registerValidation,
  updateProfileValidation,
  verifyPasscodeValidation
} from "../../validators/auth.validators";
import httpStatusConstant from "../../constant/httpStatus.constant";
import { verifyToken } from "../../middleware/auth.middleware";
import { loginRateLimiter, generalRateLimiter } from "../../middleware/rateLimiter.middleware";

const Router = express.Router();

Router.get("/health", (req, res) => {
  return res.status(httpStatusConstant.OK).json({
    success: true,
    message: "auth is running well "
  })
})

Router.post("/login", loginRateLimiter, loginValidation, handleValidationErrors, Login);
Router.post("/register", registerValidation, generalRateLimiter, handleValidationErrors, Register);

Router.post("/create-passcode", verifyPasscodeValidation, generalRateLimiter, handleValidationErrors, CreatePasscode);
Router.post("/find-user", generalRateLimiter, handleValidationErrors, FindUserByEmailOrPhone);
Router.get("/me", verifyToken, generalRateLimiter, GetUserDetails);

Router.patch("/change-password", verifyToken, changePasswordValidation, handleValidationErrors, ChangePassword);
Router.patch("/update-profile", verifyToken, updateProfileValidation, handleValidationErrors, UpdateProfile);
//  Logout and Clear Device Info From MongoDB 
Router.post("/logout", verifyToken, Logout);

export default Router;
