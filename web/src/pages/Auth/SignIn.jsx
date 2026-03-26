import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import useAuth from "@/hooks/use-auth";
import useCart from "@/hooks/use-carts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import logo from "/assets/img/belapari-icon-text.png";

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
      navigate("/stores");
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
      navigate("/stores");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google sign-in failed");
    }
  };

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
            <h1 className="text-4xl font-bold text-gray-900">Sign in</h1>
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/sign-up"
                className="text-pink-600 font-semibold hover:text-fuchsia-700"
              >
                Sign up
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-pink-600 font-medium hover:text-fuchsia-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-lg bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700 font-semibold text-base transition-all flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="!flex" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
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
              onError={() => toast.error("Google sign-in failed")}
              width="100%"
            />
          </div>
        </div>

        {/* Info text */}
        <p className="text-center text-xs text-gray-600 mt-6 md:col-span-2">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
