import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import logo from "/assets/img/belapari-icon-text.png";
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
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-white via-neutral-50 to-gray-100 flex items-center justify-center px-4 py-12">
      {/* Background gradient blur */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#ff1493/08,transparent_60%)]" />

      <div className="relative w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Logo */}
        <div className="hidden md:flex flex-col items-center justify-center">
          <img src={logo} alt="logo" className="w-50" />
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Forgot password?
            </h1>
            <p className="text-gray-600">
              Remember your password?{" "}
              <Link
                to="/sign-in"
                className="text-pink-600 hover:text-fuchsia-700 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>

          {submitted ? (
            <div className="bg-gradient-to-r from-pink-50 to-fuchsia-50 border border-pink-200 rounded-lg p-4 text-center">
              <h2 className="font-semibold text-pink-700 mb-2">Email sent!</h2>
              <p className="text-sm text-gray-700 mb-4">
                We&apos;ve sent password reset instructions to{" "}
                <span className="font-semibold text-pink-700">{email}</span>
              </p>
              <p className="text-xs text-gray-600 mb-6">
                Check your spam folder if you don&apos;t see the email.
              </p>
              <button
                onClick={() => {
                  setEmail("");
                  setSubmitted(false);
                }}
                className="text-sm text-pink-600 hover:text-fuchsia-700 font-semibold"
              >
                Try another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-lg bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700 font-semibold text-base transition-all"
                disabled={loading}
              >
                {loading ? "Sending link…" : "Send reset link"}
              </Button>
            </form>
          )}

          <div className="pt-4 border-t border-gray-300 text-center">
            <p className="text-xs text-gray-600">
              Having trouble?{" "}
              <a
                href="mailto:support@belapari.com"
                className="text-pink-600 hover:text-fuchsia-700 font-semibold"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>

        {/* Info text */}
        <p className="text-center text-xs text-neutral-500 mt-6 md:col-span-2">
          You&apos;ll receive an email with a link to reset your password
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
