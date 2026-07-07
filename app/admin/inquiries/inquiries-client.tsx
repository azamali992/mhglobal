"use client";

import React, { useRef, useState } from "react";
import { InboxIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { type DataTableColumn } from "@/components/admin/data-table";
import InquiryDrawer from "@/components/admin/inquiry-drawer";
import Badge, { statusBadgeProps } from "@/components/ui/badge";
import { useToast } from "@/components/admin/toast-notification";
import { updateInquiryStatusAction } from "@/app/admin/inquiries/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type InquiryStatus = "NEW" | "REVIEWED" | "QUOTED" | "CLOSED";

interface Inquiry {
  id: string;
  name: string;
  company: string | null;
  country: string | null;
  email: string;
  phone: string | null;
  productInterest: string | null;
  quantity: string | null;
  fabric: string | null;
  gsm: string | null;
  customization: string | null;
  message: string | null;
  fileUrls: string[];
  status: InquiryStatus;
  createdAt: Date;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

// ─── Component ────────────────────────────────────────────────────────────────

interface InquiriesClientProps {
  initialInquiries: Inquiry[];
}

export default function InquiriesClient({ initialInquiries }: InquiriesClientProps) {
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Filtering ────────────────────────────────────────────────────────────────
  const filteredInquiries = inquiries.filter((inq) => {
    if (statusFilter && inq.status !== statusFilter) return false;
    if (fromDate) {
      const from = new Date(fromDate);
      if (new Date(inq.createdAt) < from) return false;
    }
    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      if (new Date(inq.createdAt) > to) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesCompany = inq.company?.toLowerCase().includes(q) ?? false;
      const matchesName = inq.name.toLowerCase().includes(q);
      if (!matchesCompany && !matchesName) return false;
    }
    return true;
  });

  const hasFilters = !!statusFilter || !!fromDate || !!toDate || !!searchQuery;

  function clearFilters() {
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setSearchQuery("");
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => setSearchQuery(val), 250);
  }

  // ── Status change ─────────────────────────────────────────────────────────────
  async function handleStatusChange(id: string, newStatus: InquiryStatus) {
    const prev = inquiries.find((i) => i.id === id)?.status;
    // Optimistic
    setInquiries((curr) => curr.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((s) => s ? { ...s, status: newStatus } : s);
    }
    const result = await updateInquiryStatusAction(id, newStatus);
    if (!result.success) {
      setInquiries((curr) => curr.map((i) => (i.id === id ? { ...i, status: prev! } : i)));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry((s) => s ? { ...s, status: prev! } : s);
      }
      showToast("Could not update status — please try again.", "error");
    }
  }

  // ── Columns ───────────────────────────────────────────────────────────────────
  const columns: DataTableColumn<Record<string, unknown>>[] = [
    {
      key: "company",
      header: "Company",
      render: (_row) => {
        const row = _row as unknown as Inquiry;
        return <span className="font-sans text-sm font-medium text-navy">{row.company ?? row.name}</span>;
      },
    },
    {
      key: "name",
      header: "Name",
      hiddenBelow: "sm",
      render: (_row) => {
        const row = _row as unknown as Inquiry;
        return <span className="font-sans text-sm text-ink-muted">{row.name}</span>;
      },
    },
    {
      key: "country",
      header: "Country",
      hiddenBelow: "md",
      render: (_row) => {
        const row = _row as unknown as Inquiry;
        return <span className="font-sans text-sm text-ink-muted">{row.country ?? "—"}</span>;
      },
    },
    {
      key: "createdAt",
      header: "Date Received",
      hiddenBelow: "md",
      render: (_row) => {
        const row = _row as unknown as Inquiry;
        return <span className="font-sans text-sm text-ink-muted">{formatDate(row.createdAt)}</span>;
      },
    },
    {
      key: "status",
      header: "Status",
      render: (_row) => {
        const row = _row as unknown as Inquiry;
        const { label, variant } = statusBadgeProps(row.status);
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
  ];

  // ── Empty states ──────────────────────────────────────────────────────────────
  const emptyState =
    inquiries.length === 0 ? (
      <div className="bg-white rounded-card shadow-card p-16 text-center flex flex-col items-center gap-4">
        <InboxIcon className="h-12 w-12 text-ink-muted/30" aria-hidden="true" />
        <p className="font-sans text-sm text-navy font-medium">No inquiries yet</p>
        <p className="font-sans text-caption text-ink-muted max-w-xs">
          When buyers submit the contact form, their messages will appear here.
        </p>
      </div>
    ) : (
      <div className="bg-white rounded-card shadow-card p-16 text-center">
        <p className="font-sans text-sm text-navy font-medium">No inquiries match your filters.</p>
        <button onClick={clearFilters} className="font-sans text-sm text-crimson hover:text-crimson-600 mt-2 transition-colors">
          Clear filters
        </button>
      </div>
    );

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h1 className="font-sans text-lg font-semibold text-navy">Inquiries</h1>
          <span className="ml-3 bg-cream-100 text-ink-muted font-sans text-caption font-medium px-2.5 py-0.5 rounded-badge">
            {inquiries.length} total
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Select label="" id="inquiry-status-filter" aria-label="Filter by status" srOnlyLabel value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="NEW">New</option>
          <option value="REVIEWED">In Review</option>
          <option value="QUOTED">Quoted</option>
          <option value="CLOSED">Closed</option>
        </Select>

        {/* Date range */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="font-sans text-caption text-ink-muted">From</label>
            <input
              type="date"
              aria-label="Filter from date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-white font-sans text-sm text-navy rounded-input border border-line px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-150"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-sans text-caption text-ink-muted">To</label>
            <input
              type="date"
              aria-label="Filter to date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-white font-sans text-sm text-navy rounded-input border border-line px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-150"
            />
          </div>
        </div>

        <Input label="" id="inquiry-search" aria-label="Search inquiries" placeholder="Search by company or name..." type="search" onChange={handleSearchChange} />

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>Clear filters</Button>
        )}
      </div>

      {/* DataTable — no drag handle (Inquiry has no order field) */}
      <div
        onClick={(e) => {
          // Row click: find the tr ancestor
          const tr = (e.target as HTMLElement).closest("tr[data-inquiry-id]");
          if (tr) {
            const id = tr.getAttribute("data-inquiry-id");
            const found = filteredInquiries.find((i) => i.id === id);
            if (found) {
              setSelectedInquiry(found);
              setDrawerOpen(true);
            }
          }
        }}
      >
        {filteredInquiries.length === 0 ? (
          emptyState
        ) : (
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-line bg-cream-100/50">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className={`text-left px-4 py-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted whitespace-nowrap ${
                        col.hiddenBelow === "sm" ? "hidden sm:table-cell" :
                        col.hiddenBelow === "md" ? "hidden md:table-cell" :
                        col.hiddenBelow === "lg" ? "hidden lg:table-cell" : ""
                      }`}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line/50">
                {filteredInquiries.map((row) => (
                  <tr
                    key={row.id}
                    data-inquiry-id={row.id}
                    className="cursor-pointer hover:bg-cream-100/50 transition-colors duration-150"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 font-sans text-sm text-navy ${
                          col.hiddenBelow === "sm" ? "hidden sm:table-cell" :
                          col.hiddenBelow === "md" ? "hidden md:table-cell" :
                          col.hiddenBelow === "lg" ? "hidden lg:table-cell" : ""
                        }`}
                      >
                        {col.render(row as unknown as Record<string, unknown>)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Drawer */}
      <InquiryDrawer
        inquiry={selectedInquiry}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
