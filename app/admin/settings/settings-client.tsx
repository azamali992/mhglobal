"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/admin/toast-notification";
import { updateSiteSettingsAction } from "@/app/admin/settings/actions";

// ─── All 11 setting keys ──────────────────────────────────────────────────────

const DEFAULT_SETTINGS: Record<string, string> = {
  phone: "",
  whatsapp: "",
  "email.info": "",
  "email.sales": "",
  "email.ahmad": "",
  address: "",
  "social.instagram": "",
  "social.linkedin": "",
  "social.facebook": "",
  founder: "",
  founded: "",
};

const TEXTAREA_CLASS =
  "w-full bg-white font-sans text-sm text-navy rounded-input border border-line " +
  "px-4 py-3 placeholder:text-ink-muted/50 resize-none " +
  "focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-150";

// ─── Component ────────────────────────────────────────────────────────────────

interface SettingsClientProps {
  initialSettings: Record<string, string>;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  });
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setIsSaving(true);
    const result = await updateSiteSettingsAction(settings);
    setIsSaving(false);
    if (result.success) {
      showToast("Settings saved.", "success");
    } else {
      showToast("Could not save settings — please try again.", "error");
    }
  }

  return (
    <div>
      <h1 className="font-sans text-lg font-semibold text-navy mb-6">Settings</h1>

      <div className="max-w-2xl flex flex-col gap-6">
        {/* ── Group 1: Contact Information ────────────────────────────────── */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="font-sans text-sm font-semibold text-navy uppercase tracking-[0.08em] mb-5">
            Contact Information
          </h2>
          <div className="flex flex-col gap-5">
            <Input
              label="Phone Number"
              id="setting-phone"
              type="tel"
              value={settings["phone"]}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <div>
              <Input
                label="WhatsApp Number"
                id="setting-whatsapp"
                type="tel"
                value={settings["whatsapp"]}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
              />
              <p className="font-sans text-caption text-ink-muted mt-1">
                Include country code, e.g. +92 300 1234567
              </p>
            </div>
            <Input
              label="General Email"
              id="setting-email-info"
              type="email"
              value={settings["email.info"]}
              onChange={(e) => handleChange("email.info", e.target.value)}
            />
            <Input
              label="Sales Email"
              id="setting-email-sales"
              type="email"
              value={settings["email.sales"]}
              onChange={(e) => handleChange("email.sales", e.target.value)}
            />
            <Input
              label="Ahmad's Email"
              id="setting-email-ahmad"
              type="email"
              value={settings["email.ahmad"]}
              onChange={(e) => handleChange("email.ahmad", e.target.value)}
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="setting-address" className="font-sans text-sm font-medium text-navy">
                Office Address
              </label>
              <textarea
                id="setting-address"
                rows={3}
                value={settings["address"]}
                onChange={(e) => handleChange("address", e.target.value)}
                className={TEXTAREA_CLASS}
              />
            </div>
          </div>
        </div>

        {/* ── Group 2: Social Media ────────────────────────────────────────── */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="font-sans text-sm font-semibold text-navy uppercase tracking-[0.08em] mb-5">
            Social Media
          </h2>
          <div className="flex flex-col gap-5">
            <Input
              label="Instagram URL"
              id="setting-social-instagram"
              type="url"
              placeholder="https://..."
              value={settings["social.instagram"]}
              onChange={(e) => handleChange("social.instagram", e.target.value)}
            />
            <Input
              label="LinkedIn URL"
              id="setting-social-linkedin"
              type="url"
              placeholder="https://..."
              value={settings["social.linkedin"]}
              onChange={(e) => handleChange("social.linkedin", e.target.value)}
            />
            <Input
              label="Facebook URL"
              id="setting-social-facebook"
              type="url"
              placeholder="https://..."
              value={settings["social.facebook"]}
              onChange={(e) => handleChange("social.facebook", e.target.value)}
            />
          </div>
        </div>

        {/* ── Group 3: Company Information ────────────────────────────────── */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="font-sans text-sm font-semibold text-navy uppercase tracking-[0.08em] mb-5">
            Company Information
          </h2>
          <div className="flex flex-col gap-5">
            <Input
              label="Founder Name"
              id="setting-founder"
              type="text"
              value={settings["founder"]}
              onChange={(e) => handleChange("founder", e.target.value)}
            />
            <Input
              label="Year Founded"
              id="setting-founded"
              type="text"
              placeholder="e.g. 2005"
              value={settings["founded"]}
              onChange={(e) => handleChange("founded", e.target.value)}
            />
          </div>
        </div>

        {/* ── Save button ──────────────────────────────────────────────────── */}
        <div className="flex justify-end mt-2">
          <Button
            variant="primary"
            size="md"
            isLoading={isSaving}
            onClick={handleSave}
            className="w-full sm:w-auto"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
