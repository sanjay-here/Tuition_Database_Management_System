import React from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Users } from "lucide-react";
import StudentManagement from "../students/StudentManagement";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20 backdrop-blur-3xl relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-orange-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-100/20 to-orange-200/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/90 border border-white/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src="/VHP_F_Logo.jpg"
                alt="VHP Logo"
                className="h-14 w-37"
              />
              <div>
                <h1 className="text-2xl font-bold text-orange-600">
                  VHP Student Management
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome, {user?.full_name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </div>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <StudentManagement />
      </main>
    </div>
  );
};

export default Dashboard;
