import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import useAuth from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import logo from "/assets/img/uncle-brew.png";

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
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
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
          className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl bg-white focus:outline-none focus:border-black transition"
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
  const [pendingEmail, setPendingEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { register, verifyEmail, resendCode, loginWithGoogle } = useAuth();
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
    if (code.length < 6) { toast.error("Enter the full 6-digit code"); return; }
    setLoading(true);
    try {
      await verifyEmail(pendingEmail, code);
      toast.success("Email verified! Welcome to Uncle Brew 🎉");
      navigate("/");
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
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google sign-up failed");
    }
  };

  const leftPanel = (
    <div className="hidden lg:flex w-1/2 bg-neutral-900 flex-col items-center justify-center p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#ffffff15,transparent_60%)]" />
      <img src={logo} alt="logo" className="w-40 mb-8" />
      <h2 className="text-4xl font-bold text-white text-center leading-tight">
        Join Uncle Brew<br />today
      </h2>
      <p className="text-neutral-400 text-center mt-4 max-w-xs">
        Create your account and start ordering your favorite brews and bites.
      </p>
    </div>
  );

  // ── Verify step ──────────────────────────────────────────────────────────────
  if (step === "verify") {
    return (
      <div className="flex flex-1 min-h-[calc(100vh-64px)]">
        {leftPanel}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 bg-gray-50">
          <div className="w-full max-w-md text-center">
            <div className="flex justify-center mb-8 lg:hidden">
              <img src={logo} alt="logo" className="w-32" />
            </div>
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-neutral-800 mb-2">Check your inbox</h1>
            <p className="text-sm text-muted-foreground mb-8">
              We sent a 6-digit code to <span className="font-semibold text-neutral-700">{pendingEmail}</span>
            </p>

            <form onSubmit={handleVerify} className="space-y-6">
              <OtpInput value={code} onChange={setCode} />
              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-black text-white hover:bg-black/80 font-semibold text-sm"
                disabled={loading || code.length < 6}
              >
                {loading ? "Verifying…" : "Verify Email"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-6">
              Didn't receive it?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-black font-semibold hover:underline disabled:opacity-50"
              >
                {resending ? "Sending…" : "Resend code"}
              </button>
            </p>
            <button
              type="button"
              onClick={() => { setStep("form"); setCode(""); }}
              className="mt-3 text-xs text-muted-foreground hover:underline"
            >
              ← Back to sign up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration form ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-1 min-h-[calc(100vh-64px)]">
      {leftPanel}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 lg:hidden">
            <img src={logo} alt="logo" className="w-32" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-1">Create account</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-black font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/20 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/20 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/20 transition"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-black text-white hover:bg-black/80 font-semibold text-sm"
              disabled={loading}
            >
              {loading ? "Sending code…" : "Continue"}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => toast.error("Google sign-up failed")}
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
