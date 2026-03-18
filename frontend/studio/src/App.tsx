import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch} from "react-redux";
import DashboardLayout from "./layout/dashboard.layout";
import PageLayout from "./layout/page.layout";
import NotFoundPage from "./views/pages/notFoundPage/notFoundPage";
import { login } from "./redux/slices/auth.slice";

const App = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      console.log("User found in localStorage", user);
      dispatch(login(user));
    }
  }, [user]);

  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="/*" element={<PageLayout />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{ zIndex: 99999 }}
      />
    </div>
  );
};

export default App;
