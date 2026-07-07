"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  PlusIcon,
  ShoppingBagIcon,
  PencilSquareIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DataTable, { type DataTableColumn } from "@/components/admin/data-table";
import AdminDrawer from "@/components/admin/admin-drawer";
import AdminConfirmDialog from "@/components/admin/admin-confirm-dialog";
import SlugField from "@/components/admin/slug-field";
import ImageUploadZone from "@/components/admin/image-upload-zone";
import TagListInput from "@/components/admin/tag-list-input";
import { useToast } from "@/components/admin/toast-notification";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  toggleProductPublishAction,
  reorderProductsAction,
} from "@/app/admin/products/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string | null;
  fabricOptions: string[];
  gsmRange: string | null;
  sizes: string | null;
  customization: string[];
  images: string[];
  order: number;
  published: boolean;
}

// ─── Grip handle SVG ──────────────────────────────────────────────────────────

function GripVertical({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="9" cy="5" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="15" cy="5" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="15" cy="19" r="1.5" />
    </svg>
  );
}

// ─── Publish toggle ───────────────────────────────────────────────────────────

function PublishToggle({ id, name, checked, onChange }: { id: string; name: string; checked: boolean; onChange: (id: string, v: boolean) => void }) {
  return (
    <button
      role="switch"
      type="button"
      aria-checked={checked}
      aria-label={`Publish ${name}`}
      onClick={() => onChange(id, !checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30 focus-visible:ring-offset-1 ${checked ? "bg-navy" : "bg-line"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-150 ease-in-out ${checked ? "translate-x-4" : "translate-x-1"}`} />
    </button>
  );
}

// ─── Blank form ───────────────────────────────────────────────────────────────

function blankForm(): Omit<Product, "id" | "order" | "categoryName"> {
  return {
    name: "",
    slug: "",
    categoryId: "",
    description: null,
    fabricOptions: [],
    gsmRange: null,
    sizes: null,
    customization: [],
    images: [],
    published: true,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  cloudinaryConfigured: boolean;
}

export default function ProductsClient({ initialProducts, categories, cloudinaryConfigured }: ProductsClientProps) {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(blankForm());
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check for ?action=new on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "new") {
        openCreateDrawer();
        window.history.replaceState({}, "", "/admin/products");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filtering ────────────────────────────────────────────────────────────────
  const filteredProducts = products.filter((p) => {
    const matchesCategory = !categoryFilter || p.categoryId === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => setSearchQuery(val), 250);
  }

  function clearFilters() {
    setCategoryFilter("");
    setSearchQuery("");
  }

  const hasFilters = !!categoryFilter || !!searchQuery;

  // ── Drawer helpers ────────────────────────────────────────────────────────────
  function openCreateDrawer() {
    setEditingProduct(null);
    setForm(blankForm());
    setDrawerOpen(true);
  }

  function openEditDrawer(p: Product) {
    setEditingProduct(p);
    setForm({
      name: p.name,
      slug: p.slug,
      categoryId: p.categoryId,
      description: p.description,
      fabricOptions: p.fabricOptions,
      gsmRange: p.gsmRange,
      sizes: p.sizes,
      customization: p.customization,
      images: p.images,
      published: p.published,
    });
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingProduct(null);
    setForm(blankForm());
  }

  // ── Publish toggle ────────────────────────────────────────────────────────────
  async function handlePublishToggle(id: string, published: boolean) {
    const prev = products.find((p) => p.id === id)?.published;
    setProducts((curr) => curr.map((p) => (p.id === id ? { ...p, published } : p)));
    const result = await toggleProductPublishAction(id, published);
    if (!result.success) {
      setProducts((curr) => curr.map((p) => (p.id === id ? { ...p, published: prev! } : p)));
      showToast("Could not update — please try again.", "error");
    }
  }

  // ── Reorder ───────────────────────────────────────────────────────────────────
  const handleReorder = useCallback(
    async (orderedIds: string[]) => {
      const prevOrder = [...products];
      const result = await reorderProductsAction(orderedIds);
      if (!result.success) {
        setProducts(prevOrder);
        showToast("Could not save the new order — please try again.", "error");
      }
    },
    [products, showToast]
  );

  // ── Save ──────────────────────────────────────────────────────────────────────
  async function handleSave() {
    setIsSaving(true);
    const catName = categories.find((c) => c.id === form.categoryId)?.name ?? "";

    if (editingProduct) {
      const result = await updateProductAction({
        id: editingProduct.id,
        name: form.name,
        slug: form.slug,
        categoryId: form.categoryId,
        description: form.description,
        fabricOptions: form.fabricOptions,
        gsmRange: form.gsmRange,
        sizes: form.sizes,
        customization: form.customization,
        images: form.images,
        published: form.published,
      });
      setIsSaving(false);
      if (result.success) {
        setProducts((curr) =>
          curr.map((p) =>
            p.id === editingProduct.id
              ? { ...p, ...form, categoryName: catName }
              : p
          )
        );
        closeDrawer();
        showToast("Product saved.", "success");
      } else {
        showToast("Could not save — please try again.", "error");
      }
    } else {
      const result = await createProductAction({
        name: form.name,
        slug: form.slug,
        categoryId: form.categoryId,
        description: form.description,
        fabricOptions: form.fabricOptions,
        gsmRange: form.gsmRange,
        sizes: form.sizes,
        customization: form.customization,
        images: form.images,
        published: form.published,
        order: products.length,
      });
      setIsSaving(false);
      if (result.success) {
        setProducts((curr) => [
          ...curr,
          {
            id: result.data.id,
            ...form,
            categoryName: catName,
            order: curr.length,
          },
        ]);
        closeDrawer();
        showToast("Product saved.", "success");
      } else {
        showToast("Could not save — please try again.", "error");
      }
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────────
  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    setProducts((curr) => curr.filter((p) => p.id !== target.id));
    const result = await deleteProductAction(target.id);
    if (!result.success) {
      setProducts((curr) => [...curr, target].sort((a, b) => a.order - b.order));
      showToast("Could not delete — please try again.", "error");
    } else {
      showToast("Product deleted.", "success");
    }
    closeDrawer();
  }

  // ── Columns ───────────────────────────────────────────────────────────────────
  const columns: DataTableColumn<Record<string, unknown>>[] = [
    {
      key: "drag",
      header: "",
      isDragHandle: true,
      className: "w-8 px-2",
      render: (_row, dragHandleProps?: DraggableProvidedDragHandleProps | null) => {
        const row = _row as unknown as Product;
        return (
          <button
            {...(dragHandleProps ?? {})}
            type="button"
            aria-label={`Drag to reorder ${row.name}`}
            className="cursor-grab active:cursor-grabbing text-ink-muted/40 hover:text-ink-muted p-1 touch-none hidden md:inline-flex"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        );
      },
    },
    {
      key: "images",
      header: "",
      className: "w-12",
      hiddenBelow: "sm",
      render: (_row) => {
        const row = _row as unknown as Product;
        if (row.images[0]) {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={row.images[0]} alt={row.name} className="h-10 w-10 rounded object-cover bg-cream-100 border border-line" />
          );
        }
        return (
          <div className="h-10 w-10 rounded bg-cream-100 border border-line flex items-center justify-center">
            <PhotoIcon className="h-5 w-5 text-ink-muted/40" aria-hidden="true" />
          </div>
        );
      },
    },
    {
      key: "name",
      header: "Name",
      render: (_row) => {
        const row = _row as unknown as Product;
        return (
          <div>
            <p className="font-sans text-sm font-medium text-navy">{row.name}</p>
            <p className="font-sans text-caption text-ink-muted mt-0.5">{row.slug}</p>
          </div>
        );
      },
    },
    {
      key: "categoryName",
      header: "Category",
      hiddenBelow: "md",
      render: (_row) => {
        const row = _row as unknown as Product;
        return <span className="font-sans text-sm text-ink-muted">{row.categoryName}</span>;
      },
    },
    {
      key: "gsmRange",
      header: "GSM Range",
      hiddenBelow: "lg",
      render: (_row) => {
        const row = _row as unknown as Product;
        return <span className="font-sans text-sm text-ink-muted">{row.gsmRange ?? "—"}</span>;
      },
    },
    {
      key: "published",
      header: "Status",
      render: (_row) => {
        const row = _row as unknown as Product;
        return <PublishToggle id={row.id} name={row.name} checked={row.published} onChange={handlePublishToggle} />;
      },
    },
    {
      key: "actions",
      header: "",
      render: (_row) => {
        const row = _row as unknown as Product;
        return (
          <div className="flex items-center justify-end gap-2">
            <button type="button" aria-label={`Edit ${row.name}`} onClick={() => openEditDrawer(row)} className="p-1.5 rounded text-ink-muted hover:text-navy hover:bg-cream-100 transition-colors duration-150">
              <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" aria-label={`Delete ${row.name}`} onClick={() => setDeleteTarget(row)} className="p-1.5 rounded text-ink-muted hover:text-crimson hover:bg-crimson/10 transition-colors duration-150">
              <TrashIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      },
    },
  ];

  // ── Empty states ──────────────────────────────────────────────────────────────
  const filteredEmptyState = (
    <div className="bg-white rounded-card shadow-card p-16 text-center">
      <p className="font-sans text-sm text-navy font-medium">No products match your filters.</p>
      <button onClick={clearFilters} className="font-sans text-sm text-crimson hover:text-crimson-600 mt-2 transition-colors">
        Clear filters
      </button>
    </div>
  );

  const noProductsEmptyState = (
    <div className="bg-white rounded-card shadow-card p-16 text-center flex flex-col items-center gap-4">
      <ShoppingBagIcon className="h-12 w-12 text-ink-muted/30" aria-hidden="true" />
      <p className="font-sans text-sm text-navy font-medium">No products yet</p>
      <p className="font-sans text-caption text-ink-muted max-w-xs">
        Add your first product to start building your catalogue.
      </p>
      <Button variant="primary" size="sm" onClick={openCreateDrawer}>
        Add Product
      </Button>
    </div>
  );

  const drawerFooter = (
    <div className="flex items-center justify-between gap-3">
      <div>
        {editingProduct && (
          <button type="button" onClick={() => setDeleteTarget(editingProduct)} className="font-sans text-sm text-crimson hover:text-crimson-600 transition-colors">
            Delete Product
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={closeDrawer}>Cancel</Button>
        <Button variant="primary" size="sm" isLoading={isSaving} onClick={handleSave} disabled={!form.name || !form.slug || !form.categoryId}>
          Save Product
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h1 className="font-sans text-lg font-semibold text-navy">Products</h1>
          <span aria-label={`${products.length} products total`} className="ml-3 bg-cream-100 text-ink-muted font-sans text-caption font-medium px-2.5 py-0.5 rounded-badge">
            {products.length} total
          </span>
        </div>
        <Button variant="primary" size="sm" onClick={openCreateDrawer}>
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Add Product
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Select
          label=""
          id="product-category-filter"
          aria-label="Filter by category"
          srOnlyLabel
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </Select>
        <Input
          label=""
          id="product-search"
          aria-label="Search products"
          placeholder="Search products..."
          type="search"
          onChange={handleSearchChange}
        />
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        rows={filteredProducts as unknown as Record<string, unknown>[]}
        onReorder={!hasFilters ? handleReorder : (orderedIds) => reorderProductsAction(orderedIds).then((r) => { if (!r.success) showToast("Could not save the new order — please try again.", "error"); })}
        keyField="id"
        emptyState={products.length === 0 ? noProductsEmptyState : filteredEmptyState}
      />

      {/* Add / Edit Drawer */}
      <AdminDrawer open={drawerOpen} onClose={closeDrawer} title={editingProduct ? "Edit Product" : "Add Product"} footer={drawerFooter}>
        <div className="flex flex-col gap-6">
          <Input label="Product Name" id="product-name" type="text" required placeholder="" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <SlugField value={form.slug} onChange={(slug) => setForm((f) => ({ ...f, slug }))} autoSourceValue={form.name} fieldId="product-slug" />
          <Select label="Category" id="product-category" required value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
            <option value="" disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-description" className="font-sans text-sm font-medium text-navy">Description</label>
            <textarea id="product-description" rows={6} value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value || null }))} className="w-full bg-white font-sans text-sm text-navy rounded-input border border-line px-4 py-3 placeholder:text-ink-muted/50 resize-none focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-150" />
          </div>
          <TagListInput label="Fabric Options" id="product-fabric-options" placeholder="e.g. 100% cotton" value={form.fabricOptions} onChange={(tags) => setForm((f) => ({ ...f, fabricOptions: tags }))} />
          <Input label="GSM Range" id="product-gsm" type="text" placeholder="e.g. 260–400 GSM" value={form.gsmRange ?? ""} onChange={(e) => setForm((f) => ({ ...f, gsmRange: e.target.value || null }))} />
          <Input label="Sizes Available" id="product-sizes" type="text" placeholder="e.g. XS–5XL" value={form.sizes ?? ""} onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value || null }))} />
          <TagListInput label="Customization Options" id="product-customization" placeholder="e.g. Pantone matching" value={form.customization} onChange={(tags) => setForm((f) => ({ ...f, customization: tags }))} />
          <ImageUploadZone
            value={form.images}
            onChange={(urlOrArr) => {
              if (Array.isArray(urlOrArr)) {
                setForm((f) => ({ ...f, images: urlOrArr }));
              } else {
                setForm((f) => ({ ...f, images: urlOrArr ? [urlOrArr] : [] }));
              }
            }}
            label="Product Images"
            cloudinaryConfigured={cloudinaryConfigured}
            multiple={true}
            folder="mh-global-attire/products"
          />
          <div className="flex items-center gap-3">
            <button role="switch" type="button" aria-checked={form.published} aria-label="Visible on website" onClick={() => setForm((f) => ({ ...f, published: !f.published }))} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30 focus-visible:ring-offset-1 ${form.published ? "bg-navy" : "bg-line"}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-150 ease-in-out ${form.published ? "translate-x-4" : "translate-x-1"}`} />
            </button>
            <span className="font-sans text-sm text-navy">Visible on website</span>
          </div>
        </div>
      </AdminDrawer>

      {/* Delete dialog */}
      <AdminConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${deleteTarget?.name ?? ""}?`}
        message="This cannot be undone."
        confirmLabel="Delete Product"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
