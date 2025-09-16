import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { Home, Users, Settings } from "lucide-react";

const SideBar = () => {
  return (
    <>
      <div className="flex">
        <Sidebar className="fixed left-0 top-0 h-screen w-64 z-40 bg-white shadow-lg">
          <SidebarHeader>
            <div className="flex items-center justify-between px-3 py-2">
              <h2 className="text-xl font-bold">My App</h2>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent cursor-pointer">
                    <Home size={18} />
                    <span>Home</span>
                  </li>
                  <li className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent cursor-pointer">
                    <Users size={18} />
                    <span>Users</span>
                  </li>

                  <li className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent cursor-pointer">
                    <Users size={18} />
                    <span>Add Bill</span>
                  </li>
                </ul>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent cursor-pointer">
                    <Settings size={18} />
                    <span>Preferences</span>
                  </li>
                </ul>
              </SidebarGroupContent>
            </SidebarGroup> */}
          </SidebarContent>

          <SidebarFooter>
            <div className="px-3 py-2 text-sm">
              <p className="font-medium">John Doe</p>
              <button className="text-red-500 text-xs hover:underline">
                Logout
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Sidebar toggle button (overlay trigger) */}
        <SidebarTrigger className=" left-4 top-4 z-50" />
      </div>
    </>
  );
};

export default SideBar;
