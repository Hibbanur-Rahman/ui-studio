import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Login from "@/views/pages/auth/login";
import Home from "@/views/pages/home/home";
import NotFoundPage from "@/views/pages/notFoundPage/notFoundPage";
import { Route, Routes } from "react-router-dom";

const PageLayout = () => {
  return (
    <>
      <Navbar/>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer/>
    </>
  );
};

export default PageLayout;
