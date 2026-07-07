"use client";

import React, { useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface TagListInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label: string;
  placeholder: string;
  id: string;
}

/**
 * TagListInput — pill-style multi-tag input with keyboard navigation.
 * Enter adds a tag, Backspace on empty input removes the last tag.
 * Spec Section 4.5.
 */
export default function TagListInput({
  value,
  onChange,
  label,
  placeholder,
  id,
}: TagListInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function appendTag() {
    const trimmed = inputValue.trim();
    if (!trimmed || value.includes(trimmed)) {
      setInputValue("");
      return;
    }
    onChange([...value, trimmed]);
    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      appendTag();
    } else if (e.key === "Backspace" && inputValue === "") {
      // Remove last tag when input is empty
      if (value.length > 0) {
        onChange(value.slice(0, -1));
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`${id}-new-tag`} className="font-sans text-sm font-medium text-navy">
        {label}
      </label>

      {/* Tags display area */}
      <div
        className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 bg-white border border-line rounded-input cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 bg-cream-100 text-navy
                       font-sans text-caption rounded-badge px-3 py-1"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={(e) => {
                e.stopPropagation();
                onChange(value.filter((t) => t !== tag));
              }}
              className="text-ink-muted hover:text-crimson transition-colors duration-150"
            >
              <XMarkIcon className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>

      {/* Add-tag input row */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          id={`${id}-new-tag`}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 font-sans text-sm text-navy bg-white border border-line rounded-input
                     px-3 py-2 placeholder:text-ink-muted/50
                     focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy
                     transition-colors duration-150"
        />
        <button
          type="button"
          onClick={appendTag}
          className="font-sans text-sm font-medium text-white bg-navy
                     px-3 py-2 rounded-btn hover:bg-navy-800 transition-colors duration-150
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20"
        >
          Add
        </button>
      </div>
    </div>
  );
}
