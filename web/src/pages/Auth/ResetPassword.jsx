import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import logo from "/assets/img/uncle-brew.png";
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
    <div className="flex flex-1 min-h-[calc(100vh-64px)]">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-neutral-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#ffffff15,transparent_60%)]" />
        <img src={logo} alt="logo" className="w-40 mb-8" />
        <h2 className="text-4xl font-bold text-white text-center leading-tight">
          Create new password
        </h2>
        <p className="text-neutral-400 text-center mt-4 max-w-xs">
          Enter a strong password to secure your Uncle Brew account.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo visible on mobile only */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img src={logo} alt="logo" className="w-32" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-1">
            Reset password
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Enter your new password below
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <h2 className="font-semibold text-green-900 mb-2">Success!</h2>
              <p className="text-sm text-green-700">
                Your password has been reset. Redirecting you now...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700">
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
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700">
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
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-black text-white hover:bg-black/80 font-semibold text-sm"
                disabled={loading}
              >
                {loading ? "Resetting password…" : "Reset password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
