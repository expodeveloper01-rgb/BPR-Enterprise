import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRiderAuth from "@/hooks/use-rider-auth";
import apiClient from "@/lib/api-client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { MapPin, Package, DollarSign, Star, Edit2, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const RiderProfile = () => {
  const navigate = useNavigate();
  const { user, token, loading: authLoading, logout } = useRiderAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/rider/login");
      return;
    }

    if (authLoading) {
      return;
    }

    if (user && token) {
      const fetchProfile = async () => {
        try {
          const res = await apiClient.get("/rider/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile(res.data);
          setFormData({
            name: res.data.name,
            phone: res.data.phone,
            email: res.data.email,
          });
        } catch (err) {
          console.error("Failed to fetch profile:", err);
          if (err.response?.status === 401) {
            navigate("/rider/login");
          } else {
            toast.error("Failed to load profile");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [user, token, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/rider/login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <Container className="py-12 text-center">
        <p>Loading profile...</p>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="py-12 text-center">
        <p>Profile not found</p>
      </Container>
    );
  }

  return (
    <Container className="px-4 md:px-12 py-10">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
            Your Profile
          </h1>
          <p className="text-neutral-600">Manage your account information</p>
        </div>
        <Button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Total Deliveries
              </p>
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-neutral-900">
              {profile.totalDeliveries}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Rating
              </p>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-neutral-900">
                {profile.rating.toFixed(1)}
              </p>
              <p className="text-neutral-600 ml-2">/5</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Total Earnings
              </p>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-neutral-900">
              ₱{profile.earnings.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">
                Account Information
              </h2>
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                <Edit2 className="w-4 h-4" />
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="space-y-6">
              {/* Verification Status */}
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900">Email Status</p>
                  <p className="text-sm text-neutral-600">
                    {profile.verified ? "Email verified" : "Email not verified"}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    profile.verified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {profile.verified ? "Verified" : "Pending"}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-2 text-neutral-900">{profile.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <p className="px-4 py-2 text-neutral-900">{profile.email}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Contact support to change email
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-2 text-neutral-900">{profile.phone}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Account Status
                </label>
                <div
                  className={`px-4 py-2 rounded-lg text-sm font-medium inline-block ${
                    profile.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {profile.status === "active" ? "Active" : "Inactive"}
                </div>
              </div>

              {editing && (
                <div className="flex gap-4 pt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setEditing(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default RiderProfile;
