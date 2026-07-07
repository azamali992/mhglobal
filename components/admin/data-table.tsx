"use client";

import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  type DraggableProvidedDragHandleProps,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * DataTableColumn interface per spec Section 3.2.
 *
 * DEVIATION: `render` accepts an optional second argument `dragHandleProps`
 * (DraggableProvidedDragHandleProps | null | undefined). This is required so
 * the caller-defined drag-handle column can spread dragHandleProps directly
 * onto its <button> element without requiring an internal special-case in
 * DataTable. The spec interface only declares `(row: T) => React.ReactNode`
 * but that makes it impossible to attach @hello-pangea/dnd dragHandleProps
 * to the grip button inside the render closure. We extend the signature with
 * the optional second param; existing render functions that ignore it are
 * unaffected. The `isDragHandle?: boolean` flag marks which column receives them.
 */
export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (
    row: T,
    dragHandleProps?: DraggableProvidedDragHandleProps | null
  ) => React.ReactNode;
  className?: string;
  hiddenBelow?: "sm" | "md" | "lg";
  /** When true, dragHandleProps are passed as second arg to render() */
  isDragHandle?: boolean;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  rows: T[];
  onReorder?: (orderedIds: string[]) => void;
  keyField: keyof T;
  emptyState: React.ReactNode;
}

// ─── Responsive hiding class map ──────────────────────────────────────────────

const HIDDEN_CLASSES: Record<string, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * DataTable — reusable table with optional drag-to-reorder.
 * Uses @hello-pangea/dnd for drag-and-drop.
 * Spec Section 3.2.
 */
export default function DataTable<T extends Record<string, unknown>>({
  columns,
  rows: initialRows,
  onReorder,
  keyField,
  emptyState,
}: DataTableProps<T>) {
  const [rows, setRows] = useState<T[]>(initialRows);

  // Sync external data changes into local state
  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  function handleDragEnd(result: DropResult) {
    if (!result.destination || !onReorder) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    const reordered = Array.from(rows);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    // Optimistic update
    setRows(reordered);

    const orderedIds = reordered.map((r) => String(r[keyField]));
    onReorder(orderedIds);
  }

  if (rows.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="bg-white rounded-card shadow-card overflow-hidden">
      <DragDropContext onDragEnd={handleDragEnd}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-line bg-cream-100/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  aria-label={col.header === "" ? (col.isDragHandle ? "Drag to reorder" : undefined) : undefined}
                  className={cn(
                    "text-left px-4 py-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted whitespace-nowrap",
                    col.isDragHandle && "w-8 px-2",
                    col.header === "" && !col.isDragHandle && "text-right",
                    col.hiddenBelow && HIDDEN_CLASSES[col.hiddenBelow],
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <Droppable droppableId="data-table" isDropDisabled={!onReorder}>
            {(droppableProvided) => (
              <tbody
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
                className="divide-y divide-line/50"
              >
                {rows.map((row, index) => {
                  const rowId = String(row[keyField]);
                  return (
                    <Draggable
                      key={rowId}
                      draggableId={rowId}
                      index={index}
                      isDragDisabled={!onReorder}
                    >
                      {(draggableProvided, snapshot) => (
                        <tr
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          className={cn(
                            "font-sans text-sm text-navy transition-colors duration-150",
                            snapshot.isDragging
                              ? "opacity-60 bg-cream-100 shadow-card-dark"
                              : "hover:bg-cream-100/50"
                          )}
                        >
                          {columns.map((col) => (
                            <td
                              key={col.key}
                              className={cn(
                                "px-4 py-3 font-sans text-sm text-navy",
                                col.isDragHandle && "w-8 px-2",
                                col.header === "" && !col.isDragHandle && "text-right",
                                col.hiddenBelow && HIDDEN_CLASSES[col.hiddenBelow],
                                col.className
                              )}
                            >
                              {col.render(
                                row,
                                col.isDragHandle
                                  ? draggableProvided.dragHandleProps
                                  : undefined
                              )}
                            </td>
                          ))}
                        </tr>
                      )}
                    </Draggable>
                  );
                })}
                {droppableProvided.placeholder}
              </tbody>
            )}
          </Droppable>
        </table>
      </DragDropContext>
    </div>
  );
}
