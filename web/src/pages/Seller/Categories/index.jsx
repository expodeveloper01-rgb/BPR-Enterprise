import { useEffect, useState } from "react";
import SellerLayout from "../SellerLayout";
import apiClient from "@/lib/api-client";
import toast from "react-hot-toast";
import { TableRowSkeletons } from "@/components/ui/skeleton";
import { Plus, Edit2, Trash2, X } from "lucide-react";

const SellerCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await apiClient.get("/admin/categories");
      setCategories(data);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editingId) {
        const { data } = await apiClient.put(
          `/admin/categories/${editingId}`,
          formData,
        );
        setCategories((prev) =>
          prev.map((c) => (c.id === editingId ? data : c)),
        );
        toast.success("Category updated");
      } else {
        const { data } = await apiClient.post("/admin/categories", formData);
        setCategories((prev) => [...prev, data]);
        toast.success("Category created");
      }
      resetForm();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Operation failed");
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this category?")) return;
    try {
      await apiClient.delete(`/admin/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to delete");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  return (
    <SellerLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Categories</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {categories.length} total
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-800">
                {editingId ? "Edit Category" : "New Category"}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Appetizers"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
                >
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-200 text-neutral-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden overflow-x-auto">
          {loading ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-neutral-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-700">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-neutral-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <TableRowSkeletons count={5} />
              </tbody>
            </table>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-muted-foreground text-sm">No categories yet</p>
            </div>
          ) : (
            <table className="w-full text-sm min-w-max">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-neutral-600">
                    Name
                  </th>
                  <th className="px-4 py-3 font-medium text-neutral-600 hidden md:table-cell">
                    Description
                  </th>
                  <th className="px-4 py-3 font-medium text-neutral-600 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-neutral-800">
                      {cat.name}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 hidden md:table-cell text-xs">
                      {cat.description || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerCategories;
