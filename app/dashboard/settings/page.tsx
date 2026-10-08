'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Palette, Moon, Sun, Save, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { userProfile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    name: userProfile?.name || '',
    college: (userProfile as { college?: string })?.college || '',
    targetRole: (userProfile as { targetRole?: string })?.targetRole || '',
    targetCompany: (userProfile as { targetCompany?: string })?.targetCompany || '',
    bio: (userProfile as { bio?: string })?.bio || '',
    theme: 'dark',
    notifications: true,
    soundEnabled: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      await refreshProfile();
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your profile and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="glass-card p-5">
        <h2 className="text-white font-bold mb-4 flex items-center gap-2"><User className="w-4 h-4 text-brand-400" />Profile Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: 'name', label: 'Full Name', placeholder: 'Your name' },
            { key: 'college', label: 'College / University', placeholder: 'IIT Bombay' },
            { key: 'targetRole', label: 'Target Role', placeholder: 'Software Engineer' },
            { key: 'targetCompany', label: 'Dream Company', placeholder: 'Google, Microsoft...' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-slate-400 text-xs font-medium mb-1.5 block">{label}</label>
              <input
                type="text"
                value={(form as Record<string, string | boolean>)[key] as string}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-brand-500/50 transition-all"
              />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <label className="text-slate-400 text-xs font-medium mb-1.5 block">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-brand-500/50 transition-all resize-none"
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-card p-5">
        <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Palette className="w-4 h-4 text-violet-400" />Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-sm font-medium flex items-center gap-2"><Moon className="w-4 h-4" />Dark Mode</div>
              <div className="text-slate-500 text-xs">Use dark theme (default)</div>
            </div>
            <button
              onClick={() => setForm({ ...form, theme: form.theme === 'dark' ? 'light' : 'dark' })}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.theme === 'dark' ? 'bg-brand-500' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${form.theme === 'dark' ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-sm font-medium flex items-center gap-2"><Bell className="w-4 h-4" />Notifications</div>
              <div className="text-slate-500 text-xs">Daily reminders and achievements</div>
            </div>
            <button
              onClick={() => setForm({ ...form, notifications: !form.notifications })}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.notifications ? 'bg-brand-500' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${form.notifications ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="glass-card p-5">
        <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" />Account</h2>
        <div className="space-y-2">
          {[
            { label: 'Change Password', icon: Shield },
            { label: 'Export Data', icon: ChevronRight },
            { label: 'Delete Account', icon: ChevronRight, danger: true },
          ].map(({ label, danger }) => (
            <button key={label}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm transition-colors ${danger ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:bg-white/5'}`}>
              {label}
              <ChevronRight className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleSave}
        disabled={isSaving}
        className="btn-primary w-full py-3.5 rounded-2xl disabled:opacity-50"
      >
        {isSaving ? (
          <span className="flex items-center gap-2 justify-center">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </span>
        ) : (
          <span className="flex items-center gap-2 justify-center">
            <Save className="w-4 h-4" /> Save Changes
          </span>
        )}
      </motion.button>
    </div>
  );
}
