import { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Apple-style navigation */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-[980px] mx-auto flex h-12 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="font-medium text-xl text-orange-600">
              Vishva Hindu Parishad Tuition Management
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-7 text-sm font-light">
            <Link to="/" className="hover:text-gray-500">
              Features
            </Link>
            <Link to="/" className="hover:text-gray-500">
              Documentation
            </Link>
            <Link to="/" className="hover:text-gray-500">
              Components
            </Link>
            <Link to="/" className="hover:text-gray-500">
              Examples
            </Link>
            <Link to="/" className="hover:text-gray-500">
              Support
            </Link>
          </nav>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center pt-12">
        <div className="backdrop-blur-xl bg-white/95 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md mx-auto transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-semibold tracking-tight">
              VHP Admin Portal
            </h2>
            <p className="text-xl font-medium text-gray-500 mt-2">
              Admin Login - VHP Tuition Management
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
