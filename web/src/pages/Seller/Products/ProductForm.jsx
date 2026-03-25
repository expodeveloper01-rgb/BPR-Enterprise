import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SellerLayout from "../SellerLayout";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import getCategories from "@/actions/get-categories";
import getSizes from "@/actions/get-sizes";
import getKitchens from "@/actions/get-kitchens";
import getCuisines from "@/actions/get-cuisines";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { uploadProductImage } from "@/lib/supabase";

const DEFAULT_FORM = {
  name: "",
  description: "",
  price: "",
  categoryIds: [],
  sizeIds: [],
  kitchenIds: [],
  cuisineIds: [],
  isFeatured: false,
  isArchived: false,
  images: [""],
};

const ProductForm = () => {
  const { productId } = useParams();
  const isEdit = !!productId;
  const navigate = useNavigate();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [lookups, setLookups] = useState({
    categories: [],
    sizes: [],
    kitchens: [],
    cuisines: [],
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const fileInputRefs = useRef([]);

  // Load lookups and product data
  useEffect(() => {
    Promise.all([
      getCategories(),
      getSizes(),
      getKitchens(),
      getCuisines(),
    ]).then(([categories, sizes, kitchens, cuisines]) =>
      setLookups({ categories, sizes, kitchens, cuisines }),
    );

    if (isEdit) {
      apiClient
        .get(`/products/${productId}`)
        .then((r) => {
          const p = r.data;
          setForm({
            name: p.name,
            description: p.description ?? "",
            price: p.price,
            categoryIds: p.categoryIds ?? (p.categoryId ? [p.categoryId] : []),
            sizeIds: p.sizeIds ?? (p.sizeId ? [p.sizeId] : []),
            kitchenIds: p.kitchenIds ?? (p.kitchenId ? [p.kitchenId] : []),
            cuisineIds: p.cuisineIds ?? (p.cuisineId ? [p.cuisineId] : []),
            isFeatured: p.isFeatured,
            isArchived: p.isArchived,
            images: p.images?.length ? p.images.map((i) => i.url) : [""],
          });
        })
        .catch(() => toast.error("Failed to load product"))
        .finally(() => setLoading(false));
    }
  }, [productId, isEdit]);

  const handleField = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleMultiSelect = (fieldName, id) => {
    setForm((f) => {
      const current = f[fieldName] || [];
      if (current.includes(id)) {
        return { ...f, [fieldName]: current.filter((v) => v !== id) };
      } else {
        return { ...f, [fieldName]: [...current, id] };
      }
    });
  };

  const handleImageChange = (idx, value) => {
    setForm((f) => {
      const images = [...f.images];
      images[idx] = value;
      return { ...f, images };
    });
  };

  const addImageField = () =>
    setForm((f) => ({ ...f, images: [...f.images, ""] }));
  const removeImageField = (idx) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const handleFileUpload = async (e, idx) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx);
    try {
      const url = await uploadProductImage(file);
      handleImageChange(idx, url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingIdx(null);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      images: form.images.filter((u) => u.trim()),
      categoryIds: form.categoryIds.length > 0 ? form.categoryIds : null,
      sizeIds: form.sizeIds.length > 0 ? form.sizeIds : null,
      kitchenIds: form.kitchenIds.length > 0 ? form.kitchenIds : null,
      cuisineIds: form.cuisineIds.length > 0 ? form.cuisineIds : null,
      isFeatured: form.isFeatured,
      isArchived: form.isArchived,
      // For backward compatibility, set first item as single ID
      categoryId: form.categoryIds[0] || null,
      sizeId: form.sizeIds[0] || null,
      kitchenId: form.kitchenIds[0] || null,
      cuisineId: form.cuisineIds[0] || null,
    };
    try {
      if (isEdit) {
        await apiClient.patch(`/products/${productId}`, payload);
        toast.success("Product updated");
      } else {
        await apiClient.post("/products", payload);
        toast.success("Product created");
      }
      navigate("/seller/products");
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 transition";
  const labelCls = "block text-sm font-medium text-neutral-700 mb-1.5";

  if (loading)
    return (
      <SellerLayout>
        <div className="text-center py-16 text-muted-foreground">
          Loading product...
        </div>
      </SellerLayout>
    );

  return (
    <SellerLayout>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Link
            to="/seller/products"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">
              {isEdit ? "Edit Product" : "Add Product"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isEdit
                ? "Update the product details"
                : "Add a new item to your menu"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-neutral-800">Basic Info</h2>

          <div>
            <label className={labelCls} htmlFor="name">
              Product Name *
            </label>
            <input
              id="name"
              name="name"
              className={inputCls}
              placeholder="e.g. Signature Cold Brew"
              value={form.name}
              onChange={handleField}
              required
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className={cn(inputCls, "resize-none")}
              placeholder="Describe this product..."
              value={form.description}
              onChange={handleField}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="price">
              Price (₱) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              className={inputCls}
              placeholder="0.00"
              value={form.price}
              onChange={handleField}
              required
            />
          </div>

          <div className="space-y-5">
            <div>
              <label className={labelCls}>Categories</label>
              <div className="grid grid-cols-2 gap-3">
                {lookups.categories.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={form.categoryIds.includes(c.id)}
                      onChange={() => toggleMultiSelect("categoryIds", c.id)}
                      className="w-4 h-4 accent-black rounded"
                    />
                    <span className="text-sm text-neutral-700">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Sizes</label>
              <div className="grid grid-cols-3 gap-3">
                {lookups.sizes.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={form.sizeIds.includes(s.id)}
                      onChange={() => toggleMultiSelect("sizeIds", s.id)}
                      className="w-4 h-4 accent-black rounded"
                    />
                    <span className="text-sm text-neutral-700">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Kitchens</label>
              <div className="grid grid-cols-2 gap-3">
                {lookups.kitchens.map((k) => (
                  <label
                    key={k.id}
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={form.kitchenIds.includes(k.id)}
                      onChange={() => toggleMultiSelect("kitchenIds", k.id)}
                      className="w-4 h-4 accent-black rounded"
                    />
                    <span className="text-sm text-neutral-700">{k.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Cuisines</label>
              <div className="grid grid-cols-2 gap-3">
                {lookups.cuisines.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={form.cuisineIds.includes(c.id)}
                      onChange={() => toggleMultiSelect("cuisineIds", c.id)}
                      className="w-4 h-4 accent-black rounded"
                    />
                    <span className="text-sm text-neutral-700">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleField}
                className="w-4 h-4 accent-black rounded"
              />
              <span className="text-sm font-medium text-neutral-700">
                Featured
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isArchived"
                checked={form.isArchived}
                onChange={handleField}
                className="w-4 h-4 accent-black rounded"
              />
              <span className="text-sm font-medium text-neutral-700">
                Archived
              </span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-neutral-800">Images</h2>
          <p className="text-xs text-muted-foreground">
            Upload a file <span className="text-gray-300 mx-1">|</span> or paste
            a URL directly.
          </p>

          {form.images.map((url, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {/* hidden file input */}
              <input
                ref={(el) => (fileInputRefs.current[idx] = el)}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, idx)}
              />
              {/* upload button */}
              <button
                type="button"
                onClick={() => fileInputRefs.current[idx]?.click()}
                disabled={uploadingIdx === idx}
                title="Upload image file"
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-neutral-600 hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {uploadingIdx === idx ? "Uploading…" : "Upload"}
              </button>
              {/* url input */}
              <input
                className={inputCls}
                placeholder={`or paste URL ${idx + 1}`}
                value={url}
                onChange={(e) => handleImageChange(idx, e.target.value)}
              />
              {/* preview */}
              {url && (
                <img
                  src={url}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
              {/* remove */}
              {form.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(idx)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="flex items-center gap-2 text-sm text-neutral-600 hover:text-black transition-colors font-medium"
          >
            <Plus className="w-4 h-4" /> Add image
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={saving}
            className="rounded-full bg-black text-white hover:bg-black/80 px-8"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
          </Button>
          <Link to="/seller/products">
            <Button
              type="button"
              variant="outline"
              className="rounded-full px-6"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </SellerLayout>
  );
};

export default ProductForm;
