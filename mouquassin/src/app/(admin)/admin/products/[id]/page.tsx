"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { CloudUpload, X, ChevronRight, ChevronLeft, Check, Package, Loader2 } from "lucide-react";

const steps = [
  { label: "Details", description: "Name & description" },
  { label: "Pricing", description: "Price & sizes" },
  { label: "Images", description: "Product photos" },
  { label: "Review", description: "Confirm & save" },
];

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  images: string[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data: Product) => {
        setName(data.name);
        setDescription(data.description);
        setPrice(String(data.price));
        setCategory(data.category);
        setSizes(data.sizes || []);
        setImages(data.images || []);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const addSize = () => {
    const s = sizeInput.trim();
    if (s && !sizes.includes(s)) {
      setSizes([...sizes, s]);
      setSizeInput("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        setImages((prev) => [...prev, data.url]);
      }
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const canNext = () => {
    if (step === 0) return name.trim() && description.trim() && category.trim();
    if (step === 1) return price && Number(price) > 0;
    if (step === 2) return images.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          category,
          sizes,
          images,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update product");
      }

      router.push("/admin/products");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-burgundy/10 flex items-center justify-center">
          <Package className="w-5 h-5 text-burgundy" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Edit Product</h1>
          <p className="text-sm text-muted-foreground">Update product information</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  i < step
                    ? "bg-burgundy text-white"
                    : i === step
                    ? "bg-charcoal text-white"
                    : "bg-border text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <div className="hidden sm:block">
                <p className={`text-sm font-medium ${i <= step ? "text-charcoal" : "text-muted-foreground"}`}>
                  {s.label}
                </p>
                <p className="text-xs text-muted-foreground">{s.description}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-3 ${i < step ? "bg-burgundy" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl border border-border p-6 min-h-[320px]">
        {/* Step 1: Details */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-colors"
                placeholder="e.g. Classic Tuxedo Loafer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-colors resize-none"
                placeholder="Describe the product materials, craftsmanship, and details..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-colors"
                placeholder="e.g. Loafers, Oxfords, Boots"
              />
            </div>
          </div>
        )}

        {/* Step 2: Pricing & Sizes */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-border rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-colors"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Available Sizes</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSize();
                    }
                  }}
                  className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-colors"
                  placeholder="e.g. 42"
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  Add
                </button>
              </div>
              {sizes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => setSizes(sizes.filter((x) => x !== s))}
                        className="text-muted-foreground hover:text-charcoal"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Images */}
        {step === 2 && (
          <div className="space-y-5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />

            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                uploading ? "border-burgundy/30 bg-burgundy/5" : "border-border hover:border-burgundy/50 hover:bg-muted/50"
              }`}
            >
              <CloudUpload className={`w-10 h-10 mx-auto mb-3 ${uploading ? "text-burgundy animate-pulse" : "text-muted-foreground"}`} />
              <p className="text-sm font-medium text-charcoal mb-1">
                {uploading ? "Uploading..." : "Click to upload images"}
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 10MB each</p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square group rounded-lg overflow-hidden border border-border">
                    <Image src={img} alt={`Product ${i + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-charcoal/80 text-white text-[10px] rounded-full">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Name</p>
                <p className="text-sm font-medium text-charcoal">{name || "—"}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <p className="text-sm font-medium text-charcoal">{category || "—"}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Price</p>
                <p className="text-sm font-medium text-charcoal">${price || "0"}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Sizes</p>
                <p className="text-sm font-medium text-charcoal">
                  {sizes.length > 0 ? sizes.join(", ") : "None"}
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Description</p>
              <p className="text-sm text-charcoal">{description || "—"}</p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Images ({images.length})</p>
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-md overflow-hidden border border-border">
                    <Image src={img} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={() => (step === 0 ? router.back() : setStep(step - 1))}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-charcoal transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 0 ? "Cancel" : "Back"}
        </button>

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!canNext()}
            className="flex items-center gap-2 px-6 py-2.5 bg-charcoal text-white text-sm font-medium rounded-lg hover:bg-charcoal/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-burgundy text-white text-sm font-medium rounded-lg hover:bg-burgundy/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}