'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { User, LogOut, Home, Upload, Camera, Save, CheckCircle, Edit2, X } from 'lucide-react';

export default function ProfilePage() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [tempName, setTempName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserId(user.id);
      setUserName(user.user_metadata?.full_name ?? '');
      setTempName(user.user_metadata?.full_name ?? '');
      setUserEmail(user.email ?? '');
      setUserAvatar(user.user_metadata?.avatar_url ?? null);
      setLoading(false);
    };
    load();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleSaveName = async () => {
    if (!tempName.trim() || tempName.trim() === userName) {
        setIsEditingName(false);
        return;
    }
    setSavingName(true);
    setNameSaved(false);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: tempName.trim() }
    });
    setSavingName(false);
    if (!error) {
      setUserName(tempName.trim());
      setNameSaved(true);
      setIsEditingName(false);
      setTimeout(() => setNameSaved(false), 3000);
    } else {
        alert("Failed to update name");
    }
  };

  const handleCancelEdit = () => {
      setTempName(userName);
      setIsEditingName(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setUploading(true);
    setSuccess(false);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update auth metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setUserAvatar(publicUrl);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error: any) {
      alert(error.message || 'Error uploading avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-ocean-950 text-white">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 shrink-0">
              <Image src="/logo.png" alt="GODS LANKA" fill className="object-contain" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">GODS LANKA</p>
              <p className="text-white/50 text-[10px] uppercase tracking-widest">Tours & Travels</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors">
              <Home size={15} /> Website
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors">
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/account/my-bookings" className="text-sm text-gray-500 hover:text-ocean-700 transition-colors">
            ← Back to My Bookings
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-ocean-900">
            Profile Settings
          </h1>
          <p className="text-gray-500 mt-1">Manage your account details and profile picture.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row gap-10 items-start">
              
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-ocean-50 bg-gray-100 flex items-center justify-center group shadow-inner">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src={`https://www.gravatar.com/avatar/${userEmail.trim().toLowerCase()}?d=mp&s=200`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'U')}&background=0D8ABC&color=fff&size=200`;
                      }}
                    />
                  )}
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera size={24} className="mb-1" />
                    <span className="text-xs font-medium">Change</span>
                  </div>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-ocean-50 text-ocean-700 text-sm font-semibold rounded-full hover:bg-ocean-100 transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-ocean-700 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>

                {success && (
                  <p className="text-green-600 text-sm flex items-center gap-1">
                    <CheckCircle size={14} /> Saved!
                  </p>
                )}
              </div>

              <div className="flex-1 w-full space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      {nameSaved && (
                          <span className="text-green-600 text-xs flex items-center gap-1">
                              <CheckCircle size={12} /> Saved
                          </span>
                      )}
                  </div>
                  
                  {isEditingName ? (
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={tempName} 
                          onChange={e => setTempName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                          placeholder="Enter your full name"
                          autoFocus
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean-400 transition-shadow text-gray-700"
                        />
                        <button
                          onClick={handleCancelEdit}
                          disabled={savingName}
                          className="px-4 py-3 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-60 shrink-0 flex items-center justify-center"
                        >
                            <X size={16} />
                        </button>
                        <button
                          onClick={handleSaveName}
                          disabled={savingName}
                          className="flex items-center gap-1.5 px-4 py-3 bg-ocean-700 text-white text-sm font-semibold rounded-xl hover:bg-ocean-800 transition-colors disabled:opacity-60 shrink-0"
                        >
                          {savingName ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Save size={16} />
                          )}
                          {savingName ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                  ) : (
                      <div className="flex gap-2">
                        <div className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 font-medium">
                            {userName || 'No name set'}
                        </div>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="flex items-center gap-1.5 px-4 py-3 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors shrink-0"
                        >
                           <Edit2 size={16} /> Edit
                        </button>
                      </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={userEmail} 
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 focus:outline-none"
                  />
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}
