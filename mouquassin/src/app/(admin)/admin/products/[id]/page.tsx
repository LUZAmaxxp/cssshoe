"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { CloudUpload, X, ChevronRight, ChevronLeft, Check, Package, Palette, Loader2 } from "lucide-react";

interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
  sizes: string[];
  sizeInput: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  images: string[];
  colors: { name: string; hex: string; images: string[]; sizes: string[] }[];
}

const steps = [
  { label: "Details", description: "Name & description" },
  { label: "Pricing", description: "Price & category" },
  { label: "Colors", description: "Color variants" },
  { label: "Review", description: "Confirm & save" },
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [colors, setColors] = useState<ColorVariant[]>([]);
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
        if (data.colors && data.colors.length > 0) {
          setColors(data.colors.map((c) => ({ ...c, sizeInput: "" })));
        } else {
          // Legacy product: migrate flat images/sizes into a single color
          setColors([{
            name: "",
            hex: "#000000",
            images: data.images || [],
            sizes: data.sizes || [],
            sizeInput: "",
          }]);
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const addColor = () => {
    setColors([...colors, { name: "", hex: "#000000", images: [], sizes: [], sizeInput: "" }]);
    setActiveColorIdx(colors.length);
  };

  const updateColor = (idx: number, field: keyof ColorVariant, value: string | string[]) => {
    setColors(colors.map((c, i) => (i === idx ? { ...c, [field]: value } : c)));
  };

  const removeColor = (idx: number) => {
    const next = colors.filter((_, i) => i !== idx);
    setColors(next);
    if (activeColorIdx >= next.length) setActiveColorIdx(Math.max(0, next.length - 1));
  };

  const addSizeToColor = (idx: number) => {
    const s = colors[idx].sizeInput.trim();
    if (s && !colors[idx].sizes.includes(s)) {
      updateColor(idx, "sizes", [...colors[idx].sizes, s]);
      updateColor(idx, "sizeInput", "");
    }
  };

  const removeSizeFromColor = (idx: number, size: string) => {
    updateColor(idx, "sizes", colors[idx].sizes.filter((s) => s !== size));
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
        const current = colors[activeColorIdx];
        updateColor(activeColorIdx, "images", [...current.images, data.url]);
      }
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImageFromColor = (colorIdx: number, imgIdx: number) => {
    updateColor(colorIdx, "images", colors[colorIdx].images.filter((_, i) => i !== imgIdx));
  };

  const canNext = () => {
    if (step === 0) return name.trim() && description.trim() && category.trim();
    if (step === 1) return price && Number(price) > 0;
    if (step === 2) return colors.length > 0 && colors.every((c) => c.name.trim() && c.images.length > 0);
    return true;
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");

    try {
      const allImages = colors.flatMap((c) => c.images);
      const allSizes = [...new Set(colors.flatMap((c) => c.sizes))];

      const res = await fetch(`/api/products/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          category,
          images: allImages,
          sizes: allSizes,
          colors: colors.map((c) => ({
            name: c.name,
            hex: c.hex,
            images: c.images,
            sizes: c.sizes,
          })),
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

        {/* Step 2: Pricing */}
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
          </div>
        )}

        {/* Step 3: Colors & Images */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Color tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setActiveColorIdx(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    activeColorIdx === i
                      ? "border-charcoal bg-charcoal text-white"
                      : "border-border hover:border-charcoal"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-border/50"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name || `Color ${i + 1}`}
                  {colors.length > 1 && (
                    <X
                      className="w-3 h-3 ml-1 hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeColor(i);
                      }}
                    />
                  )}
                </button>
              ))}
              <button
                onClick={addColor}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:border-charcoal hover:text-charcoal transition-colors"
              >
                <span className="text-lg leading-none">+</span> Add Color
              </button>
            </div>

            {/* Active color form */}
            {colors.length > 0 && (
              <div className="border border-border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Color Name</label>
                    <input
                      type="text"
                      value={colors[activeColorIdx]?.name || ""}
                      onChange={(e) => updateColor(activeColorIdx, "name", e.target.value)}
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-colors"
                      placeholder="e.g. Black, Brown, Burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={colors[activeColorIdx]?.hex || "#000000"}
                        onChange={(e) => updateColor(activeColorIdx, "hex", e.target.value)}
                        className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground">
                        {colors[activeColorIdx]?.hex || "#000000"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Images for this color */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    Images ({colors[activeColorIdx]?.images.length || 0})
                  </label>
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
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                      uploading ? "border-burgundy/30 bg-burgundy/5" : "border-border hover:border-burgundy/50"
                    }`}
                  >
                    <CloudUpload className={`w-8 h-8 mx-auto mb-2 ${uploading ? "text-burgundy animate-pulse" : "text-muted-foreground"}`} />
                    <p className="text-sm text-muted-foreground">
                      {uploading ? "Uploading..." : "Click to upload images for this color"}
                    </p>
                  </div>
                  {colors[activeColorIdx]?.images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {colors[activeColorIdx].images.map((img, i) => (
                        <div key={i} className="relative aspect-square group rounded-lg overflow-hidden border border-border">
                          <Image src={img} alt="" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImageFromColor(activeColorIdx, i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                          {i === 0 && (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-charcoal/80 text-white text-[9px] rounded-full">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sizes for this color */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Available Sizes</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={colors[activeColorIdx]?.sizeInput || ""}
                      onChange={(e) => updateColor(activeColorIdx, "sizeInput", e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSizeToColor(activeColorIdx);
                        }
                      }}
                      className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-colors"
                      placeholder="e.g. 42"
                    />
                    <button
                      type="button"
                      onClick={() => addSizeToColor(activeColorIdx)}
                      className="px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {colors[activeColorIdx]?.sizes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {colors[activeColorIdx].sizes.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => removeSizeFromColor(activeColorIdx, s)}
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

            {colors.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Palette className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Add at least one color variant to continue</p>
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
                <p className="text-xs text-muted-foreground mb-1">Colors</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted rounded text-xs">
                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.hex }} />
                      {c.name} — {c.images.length} imgs, {c.sizes.length} sizes
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Description</p>
              <p className="text-sm text-charcoal">{description || "—"}</p>
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
