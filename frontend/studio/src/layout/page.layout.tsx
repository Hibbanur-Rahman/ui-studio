import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Login from "@/views/pages/auth/login";
import Register from "@/views/pages/auth/register";
import Home from "@/views/pages/home/home";
import NotFoundPage from "@/views/pages/notFoundPage/notFoundPage";
import { useEffect, useState } from "react";

import { Route, Routes, useNavigate } from "react-router-dom";

const PageLayout = () => {
  const navigate = useNavigate();
  const [hideNavbar, setHideNavbar] = useState(false);
  useEffect(() => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    ) {
      setHideNavbar(true);
    } else {
      setHideNavbar(false);
    }
  }, [navigate]);
  return (
    <div className="flex min-h-screen flex-col">
      {!hideNavbar && <Navbar />}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      {!hideNavbar && <Footer />}
    </div>
  );
};

export default PageLayout;
