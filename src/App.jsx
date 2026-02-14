import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/homepage/HomePage";
import ResortDetailPage from "./components/resortpages/ResortDetailPage";
import ResortJsBuilder from "./components/tools/ResortJsBuilder";
import TopBar from "./components/ui/TopBar";


export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <TopBar />  
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resort/:name" element={<ResortDetailPage />} />
          <Route path="/resort-builder" element = {<ResortJsBuilder/> } />
        </Routes>

      </div>
    </BrowserRouter>
  );
}
