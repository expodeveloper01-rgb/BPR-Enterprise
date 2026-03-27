import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/api-client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {step === "verify" ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-neutral-900">
                  Verify Email
                </h1>
                <p className="text-neutral-600 text-sm mt-1">
                  Enter the code sent to {pendingEmail}
                </p>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl letter-spacing tracking-widest"
                    required
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    Code will expire in 15 minutes
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || verifyCode.length !== 6}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-lg py-2 font-semibold disabled:opacity-50"
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
                className="mt-4 w-full text-neutral-600 hover:text-neutral-900 text-sm"
              >
                Back to Login
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-neutral-900">
                  Rider Portal
                </h1>
                <p className="text-neutral-600 text-sm mt-1">
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
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Rider Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {mode === "signup" && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+63 9XX XXXX XXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
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
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-lg py-2 font-semibold"
                >
                  {loading
                    ? "Loading..."
                    : mode === "signup"
                      ? "Create Account"
                      : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-neutral-600">
                  {mode === "signup"
                    ? "Already have an account?"
                    : "Don't have an account?"}
                  <button
                    onClick={() =>
                      setMode(mode === "signup" ? "signin" : "signup")
                    }
                    className="ml-2 text-blue-600 font-semibold hover:underline"
                  >
                    {mode === "signup" ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default RiderAuth;
