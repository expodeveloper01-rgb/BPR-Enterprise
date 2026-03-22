import { useEffect, useState } from "react";
import SellerLayout from "../SellerLayout";
import apiClient from "@/lib/api-client";
import toast from "react-hot-toast";
import useAuth from "@/hooks/use-auth";
import { Shield, ShieldOff, Trash2, Users } from "lucide-react";

const SellerUsers = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/admin/users")
      .then((r) => setUsers(r.data))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleToggle = async (target) => {
    const newRole = target.role === "admin" ? "user" : "admin";
    const label = newRole === "admin" ? "promote to admin" : "remove admin role from";
    if (!window.confirm(`Are you sure you want to ${label} ${target.name}?`)) return;
    try {
      const { data } = await apiClient.patch(`/admin/users/${target.id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
      toast.success(newRole === "admin" ? `${data.name} is now an admin` : `${data.name} is now a regular user`);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to update role");
    }
  };

  const handleDelete = async (target) => {
    if (!window.confirm(`Permanently delete account for ${target.name} (${target.email})?`)) return;
    try {
      await apiClient.delete(`/admin/users/${target.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== target.id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to delete user");
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{users.length} total accounts</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading...</div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-muted-foreground text-sm">No users yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-neutral-600">User</th>
                  <th className="px-4 py-3 font-medium text-neutral-600 hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 font-medium text-neutral-600">Role</th>
                  <th className="px-4 py-3 font-medium text-neutral-600 hidden lg:table-cell">Joined</th>
                  <th className="px-4 py-3 font-medium text-neutral-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isMe = u.id === me?.id;
                  const isAdmin = u.role === "admin";
                  return (
                    <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                            {u.name?.[0] ?? "?"}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-800 leading-snug">
                              {u.name}
                              {isMe && (
                                <span className="ml-2 text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground md:hidden">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-neutral-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isAdmin ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                          {isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRoleToggle(u)}
                            disabled={isMe}
                            title={isAdmin ? "Remove admin" : "Make admin"}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {isAdmin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            disabled={isMe}
                            title="Delete user"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerUsers;
