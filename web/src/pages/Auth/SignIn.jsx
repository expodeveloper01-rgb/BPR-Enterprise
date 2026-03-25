import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import useAuth from "@/hooks/use-auth";
import useCart from "@/hooks/use-carts";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import logo from "/assets/img/uncle-brew.png";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      await fetchCart();
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      // Unverified account — send them to sign-up verify step
      if (err.response?.status === 403 && data?.pendingEmail) {
        toast.error("Please verify your email first.");
        navigate("/sign-up", { state: { pendingEmail: data.pendingEmail } });
        return;
      }
      toast.error(data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      await fetchCart();
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google sign-in failed");
    }
  };

  return (
    <div className="flex flex-1 min-h-[calc(100vh-64px)]">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-neutral-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#ffffff15,transparent_60%)]" />
        <img src={logo} alt="logo" className="w-40 mb-8" />
        <h2 className="text-4xl font-bold text-white text-center leading-tight">
          Welcome back to
          <br />
          Uncle Brew
        </h2>
        <p className="text-neutral-400 text-center mt-4 max-w-xs">
          Your favorite brews and bites are just a sign-in away.
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
            Sign in
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Don&apos;t have an account?{" "}
            <Link
              to="/sign-up"
              className="text-black font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">
                Email
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

            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-neutral-600 hover:text-black font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-black text-white hover:bg-black/80 font-semibold text-sm"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => toast.error("Google sign-in failed")}
              width="100%"
              size="large"
              text="signin_with"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
