import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./components/ui/layouts/PublicLayouts";
import AdminLayout from "./components/ui/layouts/AdminLayout";

import HomePage from "./components/homepage/HomePage";
import ResortDetailPage from "./components/resortpages/ResortDetailPage";
import ResortBuilder from "./components/adminpage/ResortBuilder/ResortBuilder";

import Dashboard from "./components/adminpage/Dashboard/Dashboard";
import AccountManagement from "./components/adminpage/Accountmanager/AccountManagement";
import Login from "./components/adminpage/Login/Login";
import BookingsPage from "./components/adminpage/BookingsPage";

import { ResortProvider } from "./components/context/ContextEditor";
import { FilterProvider } from "./components/context/ContextFilter";

export default function App() {
  return (
    <ResortProvider>
    <BrowserRouter>
    <FilterProvider>    
      <Routes>

        {/* PUBLIC PAGES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/resort/:name" element={<ResortDetailPage />} />
        </Route>
        
        <Route path ="/login" element = {<Login />} />

        {/* ADMIN PAGES */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/resort-builder" element={<ResortBuilder />} />
          <Route path ="/accounts" element = {<AccountManagement />} />
          <Route path ="/bookings" element = {<BookingsPage /> } />
        </Route>

      </Routes>
    </FilterProvider>   
    </BrowserRouter>
    </ResortProvider>
  );
}
