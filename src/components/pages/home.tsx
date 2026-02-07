import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight,
  Settings,
  User,
  Users,
  BookOpen,
  Search,
  Filter,
  UserPlus,
  BarChart3,
  Shield,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* VHP-themed navigation */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-[1200px] mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <img
              src="https://res.cloudinary.com/dmdienrqm/image/upload/v1770472839/VHP_F_Logo_cmglzn.jpg"
              alt="VHP Logo"
              className="h-14 w-37"
            />
            <Link to="/" className="font-bold text-xl text-orange-600">
              Vishwa Hindu Parishad (VHP) Tuition Management
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-orange-600 hover:bg-orange-50"
                  >
                    Admin Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 hover:cursor-pointer border-2 border-orange-200">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback className="bg-orange-100 text-orange-700">
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-orange-100 shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer hover:bg-orange-50">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-orange-50">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-red-50 text-red-600"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-orange-600 hover:bg-orange-50"
                  >
                    Admin Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero section */}
        <section className="py-24 text-center bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <img
                src="https://res.cloudinary.com/dmdienrqm/image/upload/v1770472839/VHP_F_Logo_cmglzn.jpg"
                alt="VHP Logo"
                className="h-40 w-60 mx-auto mb-6"
              />
            </div>
            <h1 className="text-6xl font-bold tracking-tight mb-4 text-gray-900">
              VHP Student Database
              <span className="block text-orange-600">Management System</span>
            </h1>
            <h2 className="text-2xl font-medium text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive student database management system for Vishva
              Hindu Parishad's educational center. Manage active students, track
              those who have left, add new students, and maintain complete
              student records.
            </h2>
            <div className="flex justify-center space-x-6 text-lg">
              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center text-orange-600 hover:text-orange-700 font-medium hover:underline"
                >
                  Go to Dashboard <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center text-orange-600 hover:text-orange-700 font-medium hover:underline"
                  >
                    Admin Login <ChevronRight className="h-5 w-5 ml-1" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Key Features section */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-5xl font-bold tracking-tight mb-4 text-gray-900">
              Core Features
            </h2>
            <h3 className="text-2xl font-medium text-gray-600 mb-12">
              Essential tools for student database management
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              <div className="backdrop-blur-xl bg-white/80 border border-white/20 p-8 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">
                  Student Search
                </h4>
                <p className="text-gray-600">
                  Powerful search and filtering capabilities to find students by
                  name, ID, class, or school.
                </p>
              </div>

              <div className="backdrop-blur-xl bg-white/80 border border-white/20 p-8 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">
                  Add & Update Students
                </h4>
                <p className="text-gray-600">
                  Easy-to-use forms for adding new students and updating
                  existing student information and records.
                </p>
              </div>

              <div className="backdrop-blur-xl bg-white/80 border border-white/20 p-8 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">
                  Active & Left Students
                </h4>
                <p className="text-gray-600">
                  Separate views for active students and those who have left,
                  with complete tracking and history.
                </p>
              </div>

              <div className="backdrop-blur-xl bg-white/80 border border-white/20 p-8 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <BookOpen className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">
                  Delete Records
                </h4>
                <p className="text-gray-600">
                  Safely remove student records when necessary with confirmation
                  prompts for data protection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Features section */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Student Search & Management */}
              <div className="backdrop-blur-xl bg-white/90 border border-white/20 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <Search className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    Smart Search & Filters
                  </h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Powerful search functionality with advanced filters for class,
                  subject, and school name. Find any student record instantly.
                </p>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="space-y-3">
                    <div className="h-10 bg-white border border-gray-200 rounded-lg flex items-center px-3">
                      <Search className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-500 text-sm">
                        Search students...
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-8 bg-orange-100 text-orange-700 rounded-full px-3 flex items-center text-xs font-medium">
                        Class 10
                      </div>
                      <div className="h-8 bg-orange-100 text-orange-700 rounded-full px-3 flex items-center text-xs font-medium">
                        Mathematics
                      </div>
                      <div className="h-8 bg-orange-100 text-orange-700 rounded-full px-3 flex items-center text-xs font-medium">
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Management */}
              <div className="backdrop-blur-xl bg-white/90 border border-white/20 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <UserPlus className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    Complete Student Profiles
                  </h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Comprehensive student management with personal details, parent
                  information, academic records, and status tracking.
                </p>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Personal Details
                      </span>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Parent Information
                      </span>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Academic Records
                      </span>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Status Tracking
                      </span>
                      <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join VHP's modern educational management system and streamline
              your student administration today.
            </p>
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-orange-50 py-10 text-sm text-gray-700">
        <div className="max-w-6xl mx-auto px-4 space-y-8">

          {/* VHP Info and Logo */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex items-center space-x-3">
              <img
                src="https://res.cloudinary.com/dmdienrqm/image/upload/v1770472845/VHP_S_Logo_oo0tcv.png"
                alt="VHP Logo"
                className="h-20 w-20"
              />
              <div>
                <h2 className="text-orange-600 font-bold text-lg">
                  VHP Tuition Management
                </h2>
                <p className="text-gray-600 mt-1 max-w-md">
                  A student information management system built for Vishva Hindu Parishad to organize tuition center records efficiently and securely.
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="text-gray-700 text-sm space-y-2">
              <div>
                <span className="font-medium">VHP Contact:</span><br />
                📞 +9111-26103495<br />
                ✉️ contactus@vhp.org
              </div>
              <div>
                <span className="font-medium">Developer:</span><br />
                👨‍💻 <a
                  href="https://www.linkedin.com/in/sanjay-a-749a90223/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline"
                >
                  Sanjay A (LinkedIn)
                </a><br />
                🎓 RA2311008020159 <br />
                📱 +91-99430-34411
              </div>
            </div>
          </div>

          {/* Thank you and SRM Logo */}
          <div className="border-t border-orange-200 pt-6 text-center space-y-2">
            <div className="flex justify-center items-center gap-3">
              <img
                src="https://res.cloudinary.com/dmdienrqm/image/upload/v1770472840/SRM_Logo_zpzwma.jpg"
                alt="SRM Logo"
                className="h-20 object-contain"
              />
              <p className="text-gray-600">
                With sincere thanks to <strong>SRM Institute of Science and Technology</strong> for support and guidance.
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              © {new Date().getFullYear()} Vishva Hindu Parishad Educational System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>


    </div>
  );
}
