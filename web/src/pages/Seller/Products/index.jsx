import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SellerLayout from "../SellerLayout";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Archive, Star } from "lucide-react";
import toast from "react-hot-toast";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    apiClient
      .get("/products?includeArchived=true")
      .then((r) => setProducts(r.data))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchProducts, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await apiClient.delete(`/products/${id}`);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleToggleArchive = async (product) => {
    try {
      const updated = await apiClient.patch(`/products/${product.id}`, {
        isArchived: !product.isArchived,
      });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated.data : p)));
      toast.success(updated.data.isArchived ? "Product archived" : "Product restored");
    } catch {
      toast.error("Failed to update product");
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Products</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{products.length} total</p>
          </div>
          <Link to="/seller/products/new">
            <Button className="rounded-full bg-black text-white hover:bg-black/80 gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">No products yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-neutral-600">Product</th>
                  <th className="px-4 py-3 font-medium text-neutral-600 hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 font-medium text-neutral-600 hidden md:table-cell">Price</th>
                  <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
                  <th className="px-4 py-3 font-medium text-neutral-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-neutral-800 leading-snug">{product.name}</p>
                          {product.isFeatured && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 font-semibold">
                              <Star className="w-2.5 h-2.5" />Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-neutral-600 capitalize">{product.category ?? "—"}</td>
                    <td className="px-4 py-3 hidden md:table-cell font-semibold text-neutral-800">
                      ₱{Number(product.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.isArchived ? "bg-gray-100 text-gray-500" : "bg-green-50 text-green-700"}`}>
                        {product.isArchived ? "Archived" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleArchive(product)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-neutral-700 hover:bg-gray-100 transition-colors"
                          title={product.isArchived ? "Restore" : "Archive"}
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/seller/products/${product.id}/edit`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-neutral-700 hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
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

export default SellerProducts;
