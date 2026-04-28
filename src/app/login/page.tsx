"use client";

import React, { useState } from 'react';
import Image from 'next/image';
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
    setTimeout(() => router.push('/admin'), 1000);
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">

      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-red-600/[0.03] blur-[150px]" />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-[400px] z-10">
        
        {/* Back Glow Effect */}
        <div className="absolute inset-0 bg-red-600/20 blur-[60px] rounded-[40px] opacity-50" />

        {/* Premium Card */}
        <div className="relative bg-[#0d0d0d]/80 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] overflow-hidden">
          
          {/* Card Top Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          {/* Logo Area */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group mb-5">
              {/* Logo Shadow/Glow */}
              <div className="absolute inset-0 bg-red-600/30 blur-2xl rounded-full scale-125 transition-all duration-700 group-hover:scale-150" />
              
              <div className="relative h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="object-contain p-1.5"
                  priority
                />
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">
              Blood Bridge <span className="text-red-500">Admin</span>
            </h1>
            <p className="text-[12px] text-zinc-500 font-medium tracking-wide uppercase">
              Premium Portal Access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 tracking-[0.1em] uppercase ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-red-600/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rehma.org"
                  required
                  className="w-full h-12 bg-zinc-900/50 border border-white/5 focus:border-red-500/50 rounded-xl pl-11 pr-4 text-[14px] text-white placeholder:text-zinc-700 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 tracking-[0.1em] uppercase ml-1">Secure Password</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-red-600/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 bg-zinc-900/50 border border-white/5 focus:border-red-500/50 rounded-xl pl-11 pr-11 text-[14px] text-white placeholder:text-zinc-700 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="relative w-full h-12 rounded-xl font-bold text-sm text-white overflow-hidden transition-all duration-300 active:scale-95 disabled:opacity-50 group shadow-lg shadow-red-600/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    'Enter Portal'
                  )}
                </span>
              </button>
            </div>
          </form>

          {/* Secure badge */}
          <div className="mt-6 flex items-center justify-center gap-2 py-2 px-4 bg-white/[0.02] border border-white/[0.05] rounded-lg">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Secured Access Only</span>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-zinc-600 font-medium tracking-tight">
            Blood Bridge © {new Date().getFullYear()} · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
