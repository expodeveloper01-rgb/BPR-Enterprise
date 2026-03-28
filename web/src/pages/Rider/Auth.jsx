import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/api-client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

// Rider SVG Logo
const RiderLogo = () => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className="w-32 h-32"
  >
    <defs>
      <linearGradient id="bikeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#1E40AF", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {/* Wheels */}
    <circle
      cx="25"
      cy="70"
      r="12"
      fill="none"
      stroke="#1F2937"
      strokeWidth="2"
    />
    <circle
      cx="75"
      cy="70"
      r="12"
      fill="none"
      stroke="#1F2937"
      strokeWidth="2"
    />
    <circle
      cx="25"
      cy="70"
      r="8"
      fill="none"
      stroke="#3B82F6"
      strokeWidth="1"
    />
    <circle
      cx="75"
      cy="70"
      r="8"
      fill="none"
      stroke="#3B82F6"
      strokeWidth="1"
    />
    {/* Frame */}
    <line x1="25" y1="70" x2="50" y2="50" stroke="#1F2937" strokeWidth="2" />
    <line x1="75" y1="70" x2="50" y2="50" stroke="#1F2937" strokeWidth="2" />
    <line x1="50" y1="50" x2="45" y2="30" stroke="#1F2937" strokeWidth="2" />
    {/* Rider Head */}
    <circle cx="45" cy="22" r="6" fill="url(#bikeGradient)" />
    {/* Rider Body */}
    <ellipse cx="45" cy="38" rx="5" ry="8" fill="url(#bikeGradient)" />
    {/* Rider Arms */}
    <line
      x1="40"
      y1="35"
      x2="30"
      y2="32"
      stroke="url(#bikeGradient)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="50"
      y1="35"
      x2="60"
      y2="32"
      stroke="url(#bikeGradient)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Rider Legs */}
    <line
      x1="42"
      y1="46"
      x2="35"
      y2="65"
      stroke="url(#bikeGradient)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="48"
      y1="46"
      x2="55"
      y2="65"
      stroke="url(#bikeGradient)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Handlebar */}
    <line
      x1="40"
      y1="28"
      x2="55"
      y2="28"
      stroke="#1F2937"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const RiderAuth = ({ isSignUp = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState(isSignUp ? "signup" : "signin");
  const [step, setStep] = useState("auth"); // auth, verify
  const [pendingEmail, setPendingEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.phone) {
        toast.error("Please fill in all fields");
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        setLoading(false);
        return;
      }

      const res = await apiClient.post("/rider/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      setPendingEmail(formData.email);
      setStep("verify");
      toast.success("Account created! Check your email for verification code");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!verifyCode) {
        toast.error("Please enter verification code");
        setLoading(false);
        return;
      }

      const res = await apiClient.post("/rider/verify", {
        email: pendingEmail,
        code: verifyCode,
      });

      toast.success("Email verified successfully!");
      setStep("auth");
      setMode("signin");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
      });
      setVerifyCode("");
      setPendingEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiClient.post("/rider/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, rider } = res.data;

      // Store token and rider data
      localStorage.setItem("rider-token", token);
      localStorage.setItem("rider-user", JSON.stringify(rider));

      toast.success("Logged in successfully!");
      navigate("/rider");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      toast.error(message);

      // If email not verified, show verification screen
      if (err.response?.status === 403 && err.response?.data?.email) {
        setPendingEmail(err.response.data.email);
        setStep("verify");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-white via-neutral-50 to-gray-100 flex items-center justify-center px-4 py-12">
      {/* Background gradient blur */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#3B82F6/08,transparent_60%)]" />

      <div className="relative w-full max-w-md">
        {/* Card - Responsive background */}
        <div className="md:bg-white md:border md:border-gray-200 md:rounded-2xl p-4 md:p-6 space-y-3 md:space-y-4 md:shadow-lg">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <RiderLogo />
          </div>

          {step === "verify" ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Verify Email
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Enter the code sent to {pendingEmail}
                </p>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verifyCode}
                    onChange={(e) =>
                      setVerifyCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    placeholder="000000"
                    maxLength="6"
                    className="w-full border-b md:border bg-transparent md:bg-white md:rounded-lg border-b-gray-300 md:border-gray-300 px-0 md:px-4 py-3 text-center text-2xl letter-spacing tracking-widest text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-b-blue-500 md:focus:ring-2 md:focus:ring-blue-500 md:focus:border-transparent transition"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Code will expire in 15 minutes
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || verifyCode.length !== 6}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-lg py-3 font-semibold disabled:opacity-50 md:rounded-lg"
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </Button>
              </form>

              <button
                onClick={() => {
                  setStep("auth");
                  setVerifyCode("");
                  setPendingEmail("");
                }}
                className="mt-4 w-full text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Back to Login
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Rider Portal
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {mode === "signup"
                    ? "Create your delivery account"
                    : "Sign in to your account"}
                </p>
              </div>

              <form
                onSubmit={
                  mode === "signup" ? handleSignupSubmit : handleLoginSubmit
                }
                className="space-y-4"
              >
                {mode === "signup" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full border-b md:border bg-transparent md:bg-white md:rounded-lg border-b-gray-300 md:border-gray-300 px-0 md:px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-b-blue-500 md:focus:ring-2 md:focus:ring-blue-500 md:focus:border-transparent transition"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full border-b md:border bg-transparent md:bg-white md:rounded-lg border-b-gray-300 md:border-gray-300 px-0 md:px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-b-blue-500 md:focus:ring-2 md:focus:ring-blue-500 md:focus:border-transparent transition"
                    required
                  />
                </div>

                {mode === "signup" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+63 9XX XXXX XXX"
                      className="w-full border-b md:border bg-transparent md:bg-white md:rounded-lg border-b-gray-300 md:border-gray-300 px-0 md:px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-b-blue-500 md:focus:ring-2 md:focus:ring-blue-500 md:focus:border-transparent transition"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full border-b md:border bg-transparent md:bg-white md:rounded-lg border-b-gray-300 md:border-gray-300 px-0 md:px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-b-blue-500 md:focus:ring-2 md:focus:ring-blue-500 md:focus:border-transparent transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 md:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {mode === "signup" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full border-b md:border bg-transparent md:bg-white md:rounded-lg border-b-gray-300 md:border-gray-300 px-0 md:px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-b-blue-500 md:focus:ring-2 md:focus:ring-blue-500 md:focus:border-transparent transition"
                      required
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-lg py-3 font-semibold md:rounded-lg disabled:opacity-50"
                >
                  {loading
                    ? "Loading..."
                    : mode === "signup"
                      ? "Create Account"
                      : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  {mode === "signup"
                    ? "Already have an account?"
                    : "Don't have an account?"}
                  <button
                    onClick={() =>
                      setMode(mode === "signup" ? "signin" : "signup")
                    }
                    className="ml-2 text-blue-600 font-semibold hover:text-blue-700"
                  >
                    {mode === "signup" ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderAuth;
