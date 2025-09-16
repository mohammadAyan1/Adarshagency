import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./ComponentsCreated/SideBar/SideBar";
import Dashboard from "./ComponentsCreated/Dashboard/Dashboard";
import Login from "./ComponentsCreated/Login/Login";

function App() {
  return (
    <BrowserRouter>
      {/* Sidebar overlay (fixed, doesn’t push content) */}
      <SideBar />

      {/* Main content always full screen */}
      <div className="flex justify-center items-start min-h-screen w-full p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
