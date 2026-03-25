import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import useAuth from "@/hooks/use-auth";
import useCart from "@/hooks/use-carts";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail } from "lucide-react";
import logo from "/assets/img/belapari-icon-text.png";

// ── OTP input: 6 boxes ───────────────────────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
  const refs = useRef([]);
  const digits = value.padEnd(6, " ").split("");

  const handleKey = (e, idx) => {
    if (e.key === "Backspace") {
      const next = value.slice(0, idx) + value.slice(idx + 1);
      onChange(next);
      refs.current[Math.max(0, idx - 1)]?.focus();
      return;
    }
    if (!/^[0-9]$/.test(e.key)) return;
    const next = value.slice(0, idx) + e.key + value.slice(idx + 1);
    onChange(next.slice(0, 6));
    if (idx < 5) refs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pasted);
    refs.current[Math.min(5, pasted.length)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          onChange={() => {}}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-pink-500 transition"
        />
      ))}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const SignUpPage = () => {
  const [step, setStep] = useState("form"); // "form" | "verify"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { register, verifyEmail, resendCode, loginWithGoogle } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected from sign-in with a pendingEmail, jump straight to verify step
  useState(() => {
    const incoming = location.state?.pendingEmail;
    if (incoming) {
      setPendingEmail(incoming);
      setStep("verify");
    }
  });

  // Step 1 — register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register(name, email, password);
      setPendingEmail(data.pendingEmail);
      setStep("verify");
      toast.success("Check your email for the verification code!");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length < 6) {
      toast.error("Enter the full 6-digit code");
      return;
    }
    setLoading(true);
    try {
      await verifyEmail(pendingEmail, code);
      await fetchCart();
      toast.success("Email verified! Welcome to BeLaPaRi Ventures 🎉");
      navigate("/stores");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendCode(pendingEmail);
      toast.success("New code sent!");
      setCode("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not resend code");
    } finally {
      setResending(false);
    }
  };

  const handleGoogle = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      await fetchCart();
      navigate("/stores");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google sign-up failed");
    }
  };

  const leftPanel = (
    <div className="hidden lg:flex w-1/2 bg-neutral-900 flex-col items-center justify-center p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#ffffff08,transparent_60%)]" />
    </div>
  );

  // ── Verify step ──────────────────────────────────────────────────────────────
  if (step === "verify") {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-white via-neutral-50 to-gray-100 flex items-center justify-center px-4 py-12">
        {/* Background gradient blur */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#ff1493/08,transparent_60%)]" />

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="w-40" />
          </div>

          {/* Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-lg text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-white" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Check your inbox
              </h1>
              <p className="text-gray-600">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-pink-600">
                  {pendingEmail}
                </span>
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <OtpInput value={code} onChange={setCode} />
              <Button
                type="submit"
                className="w-full h-12 rounded-lg bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700 font-semibold text-base transition-all"
                disabled={loading || code.length < 6}
              >
                {loading ? "Verifying…" : "Verify Email"}
              </Button>
            </form>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="w-full text-sm text-pink-600 font-medium hover:text-fuchsia-700 disabled:opacity-50"
              >
                {resending ? "Sending…" : "Didn't receive it? Resend code"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setCode("");
                }}
                className="w-full text-xs text-neutral-500 hover:text-neutral-400"
              >
                ← Back to sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration form ────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-white via-neutral-50 to-gray-100 flex items-center justify-center px-4 py-12">
      {/* Background gradient blur */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#ff1493/08,transparent_60%)]" />

      <div className="relative w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
        {/* Logo */}
        <div className="hidden md:flex flex-col items-center justify-center">
          <img src={logo} alt="logo" className="w-50" />
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-10 space-y-6 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Create account</h1>
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="text-pink-600 font-semibold hover:text-fuchsia-700"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-lg bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700 font-semibold text-base transition-all"
              disabled={loading}
            >
              {loading ? "Sending code…" : "Continue"}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => toast.error("Google sign-up failed")}
              width="100%"
            />
          </div>
        </div>

        {/* Info text */}
        <p className="text-center text-xs text-gray-600 mt-6 md:col-span-2">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
