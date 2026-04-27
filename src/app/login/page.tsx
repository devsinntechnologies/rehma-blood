"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push('/dashboard'), 1000);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Animated background glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#ff0000] opacity-[0.04] blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#ff0000] opacity-[0.04] blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#ff0000] opacity-[0.02] blur-[160px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main Card */}
      <div className="relative w-full max-w-[420px] z-10">
        
        {/* Glassmorphism card */}
        <div className="bg-[#0e0e0e]/90 backdrop-blur-xl border border-white/[0.06] rounded-[28px] p-8 md:p-10 shadow-[0_32px_64px_rgba(0,0,0,0.8)]">
          
          {/* Logo Area */}
          <div className="flex flex-col items-center mb-8">
            {/* Logo ring glow */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-[20px] bg-[#ff0000] blur-[24px] opacity-25" />
              <div className="relative h-16 w-16 bg-white rounded-[18px] flex items-center justify-center shadow-xl overflow-hidden">
                {/* Using a styled SVG as reliable logo fallback */}
                <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
                  <path d="M24 42s-16-10-16-22a16 16 0 0 1 32 0c0 12-16 22-16 22z" fill="#ff0000"/>
                  <path d="M24 26a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" fill="white"/>
                </svg>
              </div>
            </div>

            <h1 className="text-[26px] font-bold text-white tracking-tight mb-1.5">
              Blood Bridge Admin
            </h1>
            <p className="text-[13px] text-[#666666] font-medium">
              Sign in to the admin portal
            </p>
          </div>

          {/* Secure badge */}
          <div className="flex items-center justify-center gap-1.5 mb-7 bg-[#ffffff06] border border-white/[0.05] rounded-full py-2 px-4">
            <ShieldCheck size={13} className="text-[#22c55e]" />
            <span className="text-[11px] text-[#888888] font-medium">Secured & Encrypted Connection</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase ml-0.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444444] pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rehma.org"
                  required
                  className="w-full h-12 bg-[#141414] border border-white/[0.08] focus:border-white/[0.15] rounded-[14px] pl-10 pr-4 text-[14px] text-white placeholder:text-[#333333] focus:outline-none transition-all duration-200 focus:bg-[#161616]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase ml-0.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444444] pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 bg-[#141414] border border-white/[0.08] focus:border-white/[0.15] rounded-[14px] pl-10 pr-11 text-[14px] text-white placeholder:text-[#333333] focus:outline-none transition-all duration-200 focus:bg-[#161616]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#444444] hover:text-[#888888] transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="relative w-full h-12 rounded-[14px] font-bold text-[15px] text-white overflow-hidden transition-all duration-200 active:scale-[0.98] disabled:opacity-70 group"
                style={{
                  background: 'linear-gradient(135deg, #ff2222 0%, #cc0000 100%)',
                  boxShadow: '0 4px 24px rgba(255, 0, 0, 0.25), 0 1px 0 rgba(255,255,255,0.1) inset',
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          {/* Divider + Demo Info */}
          <div className="mt-8 pt-6 border-t border-white/[0.05] text-center space-y-1.5">
            <p className="text-[11px] text-[#444444]">
              Demo: <span className="text-[#666666] font-medium">admin@rehma.org</span> = Super Admin
            </p>
            <p className="text-[11px] text-[#444444]">
              Any other email = Sub-Admin
            </p>
          </div>
        </div>

        {/* Bottom label */}
        <p className="text-center text-[11px] text-[#333333] mt-5">
          Blood Bridge © {new Date().getFullYear()} · All rights reserved
        </p>
      </div>
    </div>
  );
}
