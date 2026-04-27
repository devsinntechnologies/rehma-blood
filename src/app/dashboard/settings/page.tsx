"use client";

import React, { useState } from 'react';

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${
        checked ? 'bg-[var(--adm-accent)]' : 'bg-[var(--adm-border)]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full shadow-sm transition-transform bg-white ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [notifs, setNotifs] = useState({ email: true, sms: true, weekly: false, suspicious: true });
  const [security, setSecurity] = useState({ twofa: true, timeout: '30 min' });
  const [org, setOrg] = useState({
    name: 'Rehma Foundation',
    email: 'support@rehma.org',
    city: 'Karachi',
    timezone: 'Asia/Karachi',
  });

  return (
    <div className="flex flex-col gap-6 max-w-[800px] transition-colors">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-bold text-[var(--adm-fg)] mb-1">Settings</h1>
        <p className="text-[14px] text-[var(--adm-fg-dim)]">Platform configuration and preferences</p>
      </div>

      {/* Organization Section */}
      <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-2xl p-6 shadow-sm">
        <h2 className="text-[18px] font-bold text-[var(--adm-fg)] mb-6">Organization</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Organization name', key: 'name' },
            { label: 'Support email', key: 'email' },
            { label: 'Default city', key: 'city' },
            { label: 'Timezone', key: 'timezone' },
          ].map(({ label, key }) => (
            <div key={key}>
              <p className="text-[12px] text-[var(--adm-fg-dim)] mb-2 font-medium">{label}</p>
              <input
                type="text"
                value={org[key as keyof typeof org]}
                onChange={(e) => setOrg(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-xl px-4 py-2.5 text-[14px] text-[var(--adm-fg)] focus:outline-none focus:border-[var(--adm-accent)] transition-all placeholder:text-[var(--adm-fg-faint)]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-2xl p-6 shadow-sm">
        <h2 className="text-[18px] font-bold text-[var(--adm-fg)] mb-6">Notifications</h2>
        <div className="space-y-0 divide-y divide-[color:var(--adm-border)]">
          {[
            { label: 'Email alerts for new critical requests', key: 'email' },
            { label: 'SMS to nearby donors on urgent requests', key: 'sms' },
            { label: 'Weekly platform digest', key: 'weekly' },
            { label: 'Suspicious sub-admin activity alerts', key: 'suspicious' },
          ].map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between py-4">
              <span className="text-[14px] text-[var(--adm-fg)] font-medium">{label}</span>
              <Toggle
                checked={notifs[key as keyof typeof notifs]}
                onChange={() => setNotifs(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifs] }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-[var(--adm-surface)] border border-[color:var(--adm-border)] rounded-2xl p-6 shadow-sm">
        <h2 className="text-[18px] font-bold text-[var(--adm-fg)] mb-6">Security</h2>
        <div className="space-y-0 divide-y divide-[color:var(--adm-border)]">
          <div className="flex items-start justify-between py-4">
            <div>
              <p className="text-[14px] text-[var(--adm-fg)] font-bold">Require 2FA for all admins</p>
              <p className="text-[12px] text-[var(--adm-fg-dim)] mt-0.5 font-medium">Enforce two-factor authentication on sign-in</p>
            </div>
            <Toggle
              checked={security.twofa}
              onChange={() => setSecurity(prev => ({ ...prev, twofa: !prev.twofa }))}
            />
          </div>
          <div className="flex items-start justify-between py-4">
            <div>
              <p className="text-[14px] text-[var(--adm-fg)] font-bold">Session timeout</p>
              <p className="text-[12px] text-[var(--adm-fg-dim)] mt-0.5 font-medium">Automatically sign out inactive admins</p>
            </div>
            <select
              value={security.timeout}
              onChange={(e) => setSecurity(prev => ({ ...prev, timeout: e.target.value }))}
              className="bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-lg px-3 py-1.5 text-[13px] text-[var(--adm-fg)] focus:outline-none focus:border-[var(--adm-accent)]"
            >
              {['15 min', '30 min', '1 hour', '2 hours'].map(t => (
                <option key={t} value={t} className="bg-[var(--adm-surface)] text-[var(--adm-fg)]">{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <button className="px-6 py-2.5 border border-[color:var(--adm-border)] text-[var(--adm-fg-dim)] hover:text-[var(--adm-fg)] hover:bg-[var(--adm-hover)] rounded-xl text-[14px] font-semibold transition-all">
          Cancel
        </button>
        <button className="px-6 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl text-[14px] font-semibold transition-all shadow-[0_4px_12px_rgba(220,38,38,0.15)]">
          Save changes
        </button>
      </div>
    </div>
  );
}
