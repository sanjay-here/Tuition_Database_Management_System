import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signIn(username, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Admin Login
          </h3>
          <p className="text-gray-600">
            Access the VHP Student Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-orange-600 text-white hover:bg-orange-700 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p className="font-medium">Sample Login Credentials</p>
          <p>Username: <span className="font-semibold">admin</span></p>
          <p>Password: <span className="font-semibold">Admin@123</span></p>
          <br />
          <p>Username: <span className="font-semibold">vhp.manager</span></p>
          <p>Password: <span className="font-semibold">vhp@4321</span></p>
        </div>
      </div>
    </AuthLayout>
  );
}
