import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/homepage/HomePage";
import ResortDetailPage from "./components/resortpages/ResortDetailPage";
import TopBar from "./components/ui/TopBar";
import Footer from "./components/ui/Footer";
import AdminResortPage from "./components/adminpage/AdminResortPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <TopBar />  
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resort/:name" element={<ResortDetailPage />} />
          <Route path="/resort-builder" element = {<AdminResortPage/> } />
        </Routes>

      <Footer />

      </div>
    </BrowserRouter>
  );
}
