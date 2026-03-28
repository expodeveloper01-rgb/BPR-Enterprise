import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import logo from "/assets/img/belapari-icon-text.png";
import apiClient from "@/lib/api-client";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const code = searchParams.get("code");

  useEffect(() => {
    if (!email || !code) {
      toast.error("Invalid reset link");
      navigate("/sign-in");
    }
  }, [email, code, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/auth/reset-password", {
        email,
        code,
        newPassword,
      });

      // Store token if returned
      if (response.data?.token) {
        localStorage.setItem(
          "auth-storage",
          JSON.stringify({
            state: {
              user: response.data.user,
              token: response.data.token,
            },
          }),
        );
      }

      setSubmitted(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-white via-neutral-50 to-gray-100 flex items-center justify-center px-4 py-12">
      {/* Background gradient blur */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#ff1493/08,transparent_60%)]" />

      <div className="relative w-full max-w-4xl grid md:grid-cols-2 gap-16 items-center">
        {/* Logo - Left side */}
        <div className="hidden md:flex flex-col items-center justify-center">
          <img src={logo} alt="logo" className="w-82" />
        </div>

        {/* Card */}
        <div className="md:bg-white md:border md:border-gray-200 md:rounded-2xl p-4 md:p-6 space-y-3 md:space-y-4 md:shadow-lg">
          {/* Logo - Mobile */}
          <div className="flex justify-center mb-1 md:hidden">
            <img src={logo} alt="logo" className="w-32" />
          </div>

          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          {submitted ? (
            <div className="bg-gradient-to-r from-pink-50 to-fuchsia-50 border border-pink-200 rounded-lg p-4 text-center">
              <h2 className="font-semibold text-pink-700 mb-2">Success!</h2>
              <p className="text-sm text-gray-700">
                Your password has been reset. Redirecting you now...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full border-b md:border bg-transparent md:bg-white md:rounded-lg border-b-gray-300 md:border-gray-300 px-0 md:px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-b-pink-500 md:focus:ring-2 md:focus:ring-pink-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full border-b md:border bg-transparent md:bg-white md:rounded-lg border-b-gray-300 md:border-gray-300 px-0 md:px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-b-pink-500 md:focus:ring-2 md:focus:ring-pink-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-700"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 rounded-lg bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700 font-semibold text-sm transition-all"
                disabled={loading}
              >
                {loading ? "Resetting password…" : "Reset password"}
              </Button>
            </form>
          )}
        </div>

        {/* Info text */}
        <p className="text-center text-xs text-gray-600 mt-6 md:col-span-2">
          Make sure your new password is unique and secure
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
