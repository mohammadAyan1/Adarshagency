import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./ComponentsCreated/SideBar/SideBar";
import Dashboard from "./ComponentsCreated/Dashboard/Dashboard";
import Login from "./ComponentsCreated/Login/Login";
import MobileBillForm from "./ComponentsCreated/AddBill/AddBill";
// import { Label } from "@radix-ui/react-label";
import { Label } from "./components/ui/label";
import ProtectedRoute from "./ComponentsCreated/ProtectedRoute/ProtectedRoutes";
import { SheetDemo } from "./ComponentsCreated/SliderSidebar/SliderSideBar";

function App() {
  const [userName, setUserName] = useState({});
  const [ userDetail,setUserDetail] = useState()
  // const [userName, setUserName] = useState({});

  return (
    <BrowserRouter>
      {/* Sidebar overlay (fixed, doesn’t push content) */}
      <SideBar userName={userName} />

      {/* Main content always full screen */}
      <div className="flex justify-center items-start min-h-screen w-full p-6">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard setUserName={setUserName} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login setUserDetail={setUserDetail}/>} />
          <Route
            path="/addbill"
            element={
              <ProtectedRoute>
                <MobileBillForm userDetail={userDetail} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
