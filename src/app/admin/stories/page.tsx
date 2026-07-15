'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { Image as ImageIcon, Upload, Trash2, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface Story {
  id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
}

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('traveler_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (err: any) {
      console.error('Error fetching stories:', err.message);
      setError('Failed to load stories.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleUploadStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      const supabase = createClient();
      
      // Upload image to 'stories' bucket
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('stories')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(fileName);

      // Insert record in DB
      const { error: dbError } = await supabase
        .from('traveler_stories')
        .insert({
          image_url: publicUrl,
          caption: caption || null
        });

      if (dbError) throw dbError;

      setSuccess(true);
      setCaption('');
      setSelectedFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Refresh stories list
      fetchStories();
    } catch (err: any) {
      console.error('Error adding story:', err.message);
      setError(err.message || 'Failed to upload story.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteStory = async (id: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this story image?')) return;

    try {
      const supabase = createClient();
      
      // Try to extract the storage filename from public URL
      // (Supabase URL format: .../storage/v1/object/public/stories/filename.jpg)
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      if (fileName) {
        await supabase.storage.from('stories').remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase
        .from('traveler_stories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update state
      setStories(stories.filter(s => s.id !== id));
    } catch (err: any) {
      console.error('Error deleting story:', err.message);
      alert('Failed to delete story image.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-ocean-900">
            Traveler Stories Gallery
          </h1>
          <p className="text-gray-500 mt-1">Manage traveler memory photos displayed on the homepage.</p>
        </div>
      </div>

      {/* Main Grid: Upload Form + Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Form */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-ocean-900 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-tropical-600" /> Add New Story
          </h2>
          
          <form onSubmit={handleUploadStory} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2">
                <CheckCircle size={16} /> Story image added successfully!
              </div>
            )}

            {/* Drag & Drop / File Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Image File</label>
              {imagePreview ? (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-200 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-tropical-400 hover:bg-tropical-50/5 transition-colors"
                >
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm font-semibold text-ocean-900">Click to upload</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Caption (Optional)</label>
              <input
                type="text"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="e.g. Hiking in Ella Rock"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tropical-400 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="w-full py-3.5 bg-gradient-to-r from-ocean-700 to-tropical-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-ocean-900 flex items-center gap-2">
            <ImageIcon size={20} className="text-tropical-600" /> Current Gallery ({stories.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-gray-150 shadow-sm">
              <div className="w-8 h-8 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-150 shadow-sm">
              <ImageIcon size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No stories in the gallery yet.</p>
              <p className="text-gray-400 text-sm mt-1">Upload the first traveler story image using the form on the left.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {stories.map(story => (
                <div key={story.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group relative">
                  <div className="relative aspect-square w-full">
                    <img 
                      src={story.image_url} 
                      alt={story.caption || 'Traveler Story'} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleDeleteStory(story.id, story.image_url)}
                        className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg hover:scale-105"
                        title="Delete image"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {story.caption && (
                    <div className="p-3 text-center border-t border-gray-50 bg-gray-50/50">
                      <p className="text-sm font-semibold text-ocean-900 truncate">{story.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
