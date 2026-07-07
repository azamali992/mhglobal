"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PlusIcon, TagIcon, PencilSquareIcon, TrashIcon, PhotoIcon } from "@heroicons/react/24/outline";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import DataTable, { type DataTableColumn } from "@/components/admin/data-table";
import AdminDrawer from "@/components/admin/admin-drawer";
import AdminConfirmDialog from "@/components/admin/admin-confirm-dialog";
import SlugField from "@/components/admin/slug-field";
import ImageUploadZone from "@/components/admin/image-upload-zone";
import { useToast } from "@/components/admin/toast-notification";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  toggleCategoryPublishAction,
  reorderCategoriesAction,
} from "@/app/admin/categories/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  gsmRange: string | null;
  heroImage: string | null;
  order: number;
  published: boolean;
}

// ─── Inline toggle switch ──────────────────────────────────────────────────────

interface PublishToggleProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
}

function PublishToggle({ id, name, checked, onChange }: PublishToggleProps) {
  return (
    <button
      role="switch"
      type="button"
      aria-checked={checked}
      aria-label={`Publish ${name}`}
      onClick={() => onChange(id, !checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full
        transition-colors duration-150 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30 focus-visible:ring-offset-1
        ${checked ? "bg-navy" : "bg-line"}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow
          transition-transform duration-150 ease-in-out
          ${checked ? "translate-x-4" : "translate-x-1"}`}
      />
    </button>
  );
}

// ─── Grip handle SVG (GripVerticalIcon doesn't exist in Heroicons v2) ─────────

function GripVertical({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="9" cy="5" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="15" cy="5" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="15" cy="19" r="1.5" />
    </svg>
  );
}

// ─── Blank form state ──────────────────────────────────────────────────────────

function blankForm(): Omit<Category, "id" | "order"> {
  return {
    name: "",
    slug: "",
    description: null,
    gsmRange: null,
    heroImage: null,
    published: true,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CategoriesClientProps {
  initialCategories: Category[];
  cloudinaryConfigured: boolean;
}

export default function CategoriesClient({ initialCategories, cloudinaryConfigured }: CategoriesClientProps) {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState(blankForm());
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  // Check for ?action=new on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "new") {
        openCreateDrawer();
        // Clean URL
        window.history.replaceState({}, "", "/admin/categories");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreateDrawer() {
    setEditingCategory(null);
    setForm(blankForm());
    setDrawerOpen(true);
  }

  function openEditDrawer(cat: Category) {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      gsmRange: cat.gsmRange,
      heroImage: cat.heroImage,
      published: cat.published,
    });
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingCategory(null);
    setForm(blankForm());
  }

  // ── Publish toggle ───────────────────────────────────────────────────────────
  async function handlePublishToggle(id: string, published: boolean) {
    const prev = categories.find((c) => c.id === id)?.published;
    // Optimistic
    setCategories((curr) =>
      curr.map((c) => (c.id === id ? { ...c, published } : c))
    );
    const result = await toggleCategoryPublishAction(id, published);
    if (!result.success) {
      setCategories((curr) =>
        curr.map((c) => (c.id === id ? { ...c, published: prev! } : c))
      );
      showToast("Could not update — please try again.", "error");
    }
  }

  // ── Reorder ──────────────────────────────────────────────────────────────────
  const handleReorder = useCallback(
    async (orderedIds: string[]) => {
      const prevOrder = [...categories];
      // Optimistic already handled by DataTable
      const result = await reorderCategoriesAction(orderedIds);
      if (!result.success) {
        setCategories(prevOrder);
        showToast("Could not save the new order — please try again.", "error");
      }
    },
    [categories, showToast]
  );

  // ── Save (create / update) ───────────────────────────────────────────────────
  async function handleSave() {
    setIsSaving(true);
    if (editingCategory) {
      // Update
      const result = await updateCategoryAction({
        id: editingCategory.id,
        name: form.name,
        slug: form.slug,
        description: form.description,
        gsmRange: form.gsmRange,
        heroImage: form.heroImage,
        published: form.published,
      });
      setIsSaving(false);
      if (result.success) {
        setCategories((curr) =>
          curr.map((c) =>
            c.id === editingCategory.id
              ? { ...c, name: form.name, slug: form.slug, description: form.description, gsmRange: form.gsmRange, heroImage: form.heroImage, published: form.published }
              : c
          )
        );
        closeDrawer();
        showToast("Category saved.", "success");
      } else {
        showToast("Could not save — please try again.", "error");
      }
    } else {
      // Create
      const result = await createCategoryAction({
        name: form.name,
        slug: form.slug,
        description: form.description,
        gsmRange: form.gsmRange,
        heroImage: form.heroImage,
        published: form.published,
        order: categories.length,
      });
      setIsSaving(false);
      if (result.success) {
        // Optimistic: append new row
        setCategories((curr) => [
          ...curr,
          {
            id: result.data.id,
            name: form.name,
            slug: form.slug,
            description: form.description,
            gsmRange: form.gsmRange,
            heroImage: form.heroImage,
            published: form.published,
            order: curr.length,
          },
        ]);
        closeDrawer();
        showToast("Category saved.", "success");
      } else {
        showToast("Could not save — please try again.", "error");
      }
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────────
  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    // Optimistic remove
    setCategories((curr) => curr.filter((c) => c.id !== target.id));
    const result = await deleteCategoryAction(target.id);
    if (!result.success) {
      setCategories((curr) => [...curr, target].sort((a, b) => a.order - b.order));
      showToast("Could not delete — please try again.", "error");
    } else {
      showToast("Category deleted.", "success");
    }
    closeDrawer();
  }

  // ── Column definitions ────────────────────────────────────────────────────────
  const columns: DataTableColumn<Record<string, unknown>>[] = [
    {
      key: "drag",
      header: "",
      isDragHandle: true,
      className: "w-8 px-2",
      render: (_row, dragHandleProps?: DraggableProvidedDragHandleProps | null) => {
        const row = _row as unknown as Category;
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
      key: "heroImage",
      header: "",
      className: "w-12",
      hiddenBelow: "sm",
      render: (_row) => {
        const row = _row as unknown as Category;
        if (row.heroImage) {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.heroImage}
              alt={row.name}
              className="h-10 w-10 rounded object-cover bg-cream-100 border border-line"
            />
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
        const row = _row as unknown as Category;
        return (
          <div>
            <p className="font-sans text-sm font-medium text-navy">{row.name}</p>
            <p className="font-sans text-caption text-ink-muted mt-0.5">{row.slug}</p>
          </div>
        );
      },
    },
    {
      key: "gsmRange",
      header: "GSM Range",
      hiddenBelow: "md",
      render: (_row) => {
        const row = _row as unknown as Category;
        return <span className="font-sans text-sm text-ink-muted">{row.gsmRange ?? "—"}</span>;
      },
    },
    {
      key: "published",
      header: "Status",
      render: (_row) => {
        const row = _row as unknown as Category;
        return (
          <PublishToggle
            id={row.id}
            name={row.name}
            checked={row.published}
            onChange={handlePublishToggle}
          />
        );
      },
    },
    {
      key: "actions",
      header: "",
      render: (_row) => {
        const row = _row as unknown as Category;
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              aria-label={`Edit ${row.name}`}
              onClick={() => openEditDrawer(row)}
              className="p-1.5 rounded text-ink-muted hover:text-navy hover:bg-cream-100 transition-colors duration-150"
            >
              <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={`Delete ${row.name}`}
              onClick={() => setDeleteTarget(row)}
              className="p-1.5 rounded text-ink-muted hover:text-crimson hover:bg-crimson/10 transition-colors duration-150"
            >
              <TrashIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      },
    },
  ];

  const emptyState = (
    <div className="bg-white rounded-card shadow-card p-16 text-center flex flex-col items-center gap-4">
      <TagIcon className="h-12 w-12 text-ink-muted/30" aria-hidden="true" />
      <p className="font-sans text-sm text-navy font-medium">No categories yet</p>
      <p className="font-sans text-caption text-ink-muted max-w-xs">
        Add your first category to start organising your products.
      </p>
      <Button variant="primary" size="sm" onClick={openCreateDrawer}>
        Add Category
      </Button>
    </div>
  );

  const drawerFooter = (
    <div className="flex items-center justify-between gap-3">
      <div>
        {editingCategory && (
          <button
            type="button"
            onClick={() => setDeleteTarget(editingCategory)}
            className="font-sans text-sm text-crimson hover:text-crimson-600 transition-colors"
          >
            Delete Category
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={closeDrawer}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          isLoading={isSaving}
          onClick={handleSave}
          disabled={!form.name || !form.slug}
        >
          Save Category
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h1 className="font-sans text-lg font-semibold text-navy">Categories</h1>
          <span
            aria-label={`${categories.length} categories total`}
            className="ml-3 bg-cream-100 text-ink-muted font-sans text-caption font-medium px-2.5 py-0.5 rounded-badge"
          >
            {categories.length} total
          </span>
        </div>
        <Button variant="primary" size="sm" onClick={openCreateDrawer}>
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Add Category
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns as DataTableColumn<Record<string, unknown>>[]}
        rows={categories as unknown as Record<string, unknown>[]}
        onReorder={handleReorder}
        keyField="id"
        emptyState={emptyState}
      />

      {/* Create / Edit Drawer */}
      <AdminDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={editingCategory ? "Edit Category" : "Add Category"}
        footer={drawerFooter}
      >
        <div className="flex flex-col gap-6">
          <Input
            label="Category Name"
            id="category-name"
            type="text"
            required
            placeholder="e.g. T-Shirts"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <SlugField
            value={form.slug}
            onChange={(slug) => setForm((f) => ({ ...f, slug }))}
            autoSourceValue={form.name}
            fieldId="category-slug"
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category-description" className="font-sans text-sm font-medium text-navy">
              Description
            </label>
            <textarea
              id="category-description"
              rows={4}
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value || null }))}
              placeholder="Brief description of this product category..."
              className="w-full bg-white font-sans text-sm text-navy rounded-input border border-line
                         px-4 py-3 placeholder:text-ink-muted/50 resize-none
                         focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-150"
            />
          </div>
          <Input
            label="GSM Range"
            id="category-gsm"
            type="text"
            placeholder="e.g. 140–240 GSM"
            value={form.gsmRange ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, gsmRange: e.target.value || null }))}
          />
          <ImageUploadZone
            value={form.heroImage}
            onChange={(url) =>
              setForm((f) => ({ ...f, heroImage: typeof url === "string" ? url || null : null }))
            }
            label="Category Image"
            cloudinaryConfigured={cloudinaryConfigured}
            multiple={false}
            folder="mh-global-attire/categories"
          />
          <div className="flex items-center gap-3">
            <button
              role="switch"
              type="button"
              aria-checked={form.published}
              aria-label="Visible on website"
              onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
              className={`relative inline-flex h-5 w-9 items-center rounded-full
                transition-colors duration-150 ease-in-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30 focus-visible:ring-offset-1
                ${form.published ? "bg-navy" : "bg-line"}`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow
                  transition-transform duration-150 ease-in-out
                  ${form.published ? "translate-x-4" : "translate-x-1"}`}
              />
            </button>
            <span className="font-sans text-sm text-navy">Visible on website</span>
          </div>
        </div>
      </AdminDrawer>

      {/* Delete confirmation dialog */}
      <AdminConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${deleteTarget?.name ?? ""}?`}
        message="This cannot be undone. Products in this category will not be deleted."
        confirmLabel="Delete Category"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
