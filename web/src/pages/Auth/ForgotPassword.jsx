import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import logo from "/assets/img/uncle-brew.png";
import apiClient from "@/lib/api-client";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Check your email for reset instructions");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
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
          Reset your password
        </h2>
        <p className="text-neutral-400 text-center mt-4 max-w-xs">
          We&apos;ll send you a link to reset your password and get back to
          ordering.
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
            Forgot password?
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Remember your password?{" "}
            <Link
              to="/sign-in"
              className="text-black font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <h2 className="font-semibold text-green-900 mb-2">Email sent!</h2>
              <p className="text-sm text-green-700 mb-6">
                We&apos;ve sent password reset instructions to{" "}
                <span className="font-semibold">{email}</span>
              </p>
              <p className="text-xs text-green-600 mb-6">
                Check your spam folder if you don&apos;t see the email.
              </p>
              <button
                onClick={() => {
                  setEmail("");
                  setSubmitted(false);
                }}
                className="text-sm text-green-700 hover:text-green-900 font-semibold"
              >
                Try another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/20 transition"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-black text-white hover:bg-black/80 font-semibold text-sm"
                disabled={loading}
              >
                {loading ? "Sending link…" : "Send reset link"}
              </Button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-xs text-muted-foreground">
              Having trouble?{" "}
              <a
                href="mailto:support@unclebrew.com"
                className="text-black font-semibold hover:underline"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
