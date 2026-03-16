import toast from "react-hot-toast";
import axios from "axios";
import { removeAuthToken, getAuthToken } from "@/utils/auth.utils";
const Request = async (httpOptions: any) => {

  const token = getAuthToken();
  if (!httpOptions.exact) {
    httpOptions.url = process.env.NEXT_PUBLIC_API_URL + "/" + httpOptions.url;
    console.log("http header:", httpOptions);
  }
  httpOptions.headers = {
    "Content-Type": httpOptions.files
      ? "multipart/form-data"
      : "application/json",
    Accept: "application/json",
    ...httpOptions.headers,
  };
  if (httpOptions.secure) {
    if (token) {
      httpOptions.headers.Authorization = `Bearer ${token}`;
    } else {
      // If secure is required but no token exists, reject the request
      return Promise.reject({
        response: {
          status: 401,
          data: {
            success: false,
            message: "Unauthorized: Token not provided"
          }
        }
      });
    }
  }

  const handleRequestErrors = (error: any) => {
    if (error.response) {
      const { status, data } = error?.response;
      console.log("error response", data);
      if (status === 401) {
        // Only redirect to login if this is not a public endpoint
        // Check if skipAuthRedirect flag is set
        if (!httpOptions.skipAuthRedirect) {
          // Clear invalid token and redirect to login
          if (typeof window !== 'undefined') {
            removeAuthToken();
            window.location.replace("/login");
          }
        }
      } else if (status == 413) {
        toast.error("File size exceeds the limit");
      }
    } else if (error.request) {
      console.log("error request", error.request);
    } else {
      console.log("error message", error.message);
    }
  };

  return axios(httpOptions)
    .then((response: any) => response)
    .catch((error: any) => {
      handleRequestErrors(error);
      throw error?.response;
    });
};

export default Request;