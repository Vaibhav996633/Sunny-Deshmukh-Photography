
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { GalleryFilter } from '../types';
import SectionHeading from '../components/SectionHeading';
import { 
  Plus, Trash2, Edit3, Save, X, Image as ImageIcon, 
  Video, Package as PackageIcon, Mail, Layers, ExternalLink, 
  AlertCircle, Film, Camera, CheckCircle2, Clock, PlayCircle, Loader2
} from 'lucide-react';

type AdminTab = 'stills' | 'cinema' | 'packages' | 'inquiries';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('stills');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    let query;
    
    if (activeTab === 'stills') {
      query = supabase.from('gallery').select('*').eq('type', 'image');
    } else if (activeTab === 'cinema') {
      query = supabase.from('gallery').select('*').eq('type', 'video');
    } else {
      query = supabase.from(activeTab).select('*');
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error) setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm('This will permanently remove the item. Proceed?')) return;
    const table = (activeTab === 'stills' || activeTab === 'cinema') ? 'gallery' : activeTab;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) fetchData();
  };

  const uploadFile = async (file: File, bucket: 'gallery-images' | 'gallery-videos') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const payload: any = Object.fromEntries(formData.entries());
      const table = (activeTab === 'stills' || activeTab === 'cinema') ? 'gallery' : activeTab;

      // Handle Cover Image Upload (for Cinema)
      const coverInput = (e.target as HTMLFormElement).querySelector('input[name="cover_file"]') as HTMLInputElement;
      if (coverInput && coverInput.files && coverInput.files.length > 0) {
         const file = coverInput.files[0];
         const publicUrl = await uploadFile(file, 'gallery-images'); // Store covers in images bucket
         payload.thumbnail_url = publicUrl;
      }

      // Handle Main File Upload (for Stills or Legacy Cinema)
      const fileInput = (e.target as HTMLFormElement).querySelector('input[name="file"]') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const bucket = activeTab === 'cinema' ? 'gallery-videos' : 'gallery-images';
        const publicUrl = await uploadFile(file, bucket);
        payload.url = publicUrl;
      }
      
      // Remove file objects from payload to avoid DB errors
      delete payload.file;
      delete payload.cover_file;

      if (activeTab === 'packages') {
        payload.deliverables = payload.deliverables.split('\n').filter((s: string) => s.trim());
        payload.highlights = payload.highlights.split('\n').filter((s: string) => s.trim());
        payload.is_popular = payload.is_popular === 'on';
      }

      if (activeTab === 'stills') payload.type = 'image';
      if (activeTab === 'cinema') {
          payload.type = 'video';
          // Clean URL if user pasted embed code
          if (payload.url && payload.url.includes('<blockquote')) {
              const match = payload.url.match(/data-instgrm-permalink="([^"]+)"/);
              if (match && match[1]) {
                  payload.url = match[1];
              }
          }
      }

      let error;
      if (editingItem) {
        // If editing and no new file/url, keep old values
        if (!payload.url) payload.url = editingItem.url;
        if (!payload.thumbnail_url && editingItem.thumbnail_url) payload.thumbnail_url = editingItem.thumbnail_url;
        
        ({ error } = await supabase.from(table).update(payload).eq('id', editingItem.id));
      } else {
        if (!payload.url && (activeTab === 'stills')) throw new Error("File is required");
        if (!payload.url && (activeTab === 'cinema')) throw new Error("Video URL is required");
        ({ error } = await supabase.from(table).insert([payload]));
      }

      if (error) throw error;
      
      setShowForm(false);
      setEditingItem(null);
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const [uploadProgress, setUploadProgress] = useState(0);

  // ... (keeping existing hooks)

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);
    
    try {
        const formData = new FormData(e.target as HTMLFormElement);
        const category = formData.get('category') as string;
        const fileInput = (e.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
        
        if (!fileInput.files || fileInput.files.length === 0) throw new Error("No files selected");

        const files = Array.from(fileInput.files);
        const totalFiles = files.length;
        const type = activeTab === 'stills' ? 'image' : 'video';
        const bucket = activeTab === 'cinema' ? 'gallery-videos' : 'gallery-images';
        
        // Process sequentially to update progress
        const entries = [];
        for (let i = 0; i < totalFiles; i++) {
            const file = files[i];
            const publicUrl = await uploadFile(file, bucket);
            entries.push({
                url: publicUrl,
                category,
                type,
                title: file.name.split('.')[0]
            });
            setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
        }

        const { error } = await supabase.from('gallery').insert(entries);
        
        if (error) throw error;
        
        setShowBulkForm(false);
        fetchData();
    } catch (err: any) {
        console.error("Bulk Upload Error Detail:", err);
        alert("Bulk Upload Error: " + (err.message || "Network Error"));
    } finally {
        setUploading(false);
        setUploadProgress(0);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-zinc-950 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <SectionHeading 
            label="Studio Management" 
            title={activeTab === 'stills' ? "Stills Archive" : activeTab === 'cinema' ? "Cinema Archive" : activeTab === 'packages' ? "Collections" : "Leads"} 
          />
          
          <div className="flex gap-4">
            {(activeTab === 'stills') && (
              <button 
                onClick={() => setShowBulkForm(true)}
                className="flex items-center gap-2 bg-zinc-900 text-zinc-300 border border-white/10 px-6 py-3 rounded-full font-sans text-[0.6rem] uppercase tracking-[0.2em] font-bold hover:bg-zinc-800 transition-all"
              >
                <Layers size={14} className="text-amber-600" />
                <span>Bulk Upload</span>
              </button>
            )}
            {activeTab !== 'inquiries' && (
              <button 
                onClick={() => { setEditingItem(null); setShowForm(true); }}
                className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-full font-sans text-[0.6rem] uppercase tracking-[0.2em] font-bold hover:bg-amber-600 hover:text-white transition-all"
              >
                <Plus size={14} />
                <span>Add Record</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-10 border-b border-white/5 mb-16 overflow-x-auto no-scrollbar">
          {[
            { id: 'stills', label: 'Stills', icon: Camera },
            { id: 'cinema', label: 'Cinema', icon: Film },
            { id: 'packages', label: 'Collections', icon: PackageIcon },
            { id: 'inquiries', label: 'Inquiries', icon: Mail },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setShowForm(false); setShowBulkForm(false); }}
              className={`flex items-center gap-3 pb-6 font-sans text-[0.65rem] uppercase tracking-[0.3em] transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <tab.icon size={14} className={activeTab === tab.id ? 'text-amber-600' : ''} />
              <span>{tab.label}</span>
              {activeTab === tab.id && <motion.div layoutId="admin-tab" className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-amber-600" />}
            </button>
          ))}
        </div>

        {/* Grid View */}
        {loading ? (
          <div className="py-32 text-center">
            <div className="w-10 h-10 border-t-2 border-amber-600 border-solid rounded-full animate-spin mx-auto mb-6" />
            <span className="font-sans uppercase tracking-[0.5em] text-[0.6rem] text-zinc-600">Accessing Archives...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {items.map((item) => (
              <motion.div 
                layout
                key={item.id} 
                className="bg-zinc-900/40 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col group hover:border-white/10 transition-colors"
              >
                {(activeTab === 'stills' || activeTab === 'cinema') && (
                  <div className="aspect-[16/10] relative overflow-hidden bg-black">
                    {activeTab === 'cinema' ? (
                      <div className="w-full h-full relative group/video">
                        {/* Check if it's an Instagram link */}
                        {item.url && item.url.includes('instagram') ? (
                           <>
                              {item.thumbnail_url ? (
                                <img src={item.thumbnail_url} className="w-full h-full object-cover opacity-60" loading="lazy" />
                              ) : (
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">No Cover</div>
                              )}
                              {/* On hover, we could show iframe? Or just a clear Play indicator. Admin usually doesn't need to play IN grid. 
                                  User said 'run video on admin page also'. I'll add a 'Preview' button overlay. */}
                               <div className="absolute inset-0 flex items-center justify-center z-20">
                                   <a href={item.url} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-4 rounded-full backdrop-blur-md hover:bg-amber-600 hover:text-white transition-all text-white">
                                       <PlayCircle size={32} />
                                   </a>
                               </div>
                           </>
                        ) : (
                           <>
                             <video src={item.url} className="w-full h-full object-cover opacity-50" muted />
                             <div className="absolute inset-0 flex items-center justify-center">
                               <PlayCircle size={32} className="text-amber-600/60" />
                             </div>
                           </>
                        )}
                      </div>
                    ) : (
                      <img 
                        src={item.url} 
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                        loading="lazy" 
                        onError={(e) => {
                          console.error("Broken Image URL:", item.url);
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Load+Error';
                        }}
                      />
                    )}
                  </div>
                )}

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-grow">
                      <h4 className="font-serif italic text-2xl text-white mb-2 line-clamp-1">{item.title || item.name || item.email}</h4>
                      <div className="flex items-center gap-3">
                         <span className="font-sans text-[0.55rem] uppercase tracking-[0.2em] text-amber-600/80">{item.category || item.duration}</span>
                         {item.is_popular && <CheckCircle2 size={12} className="text-amber-600" />}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {activeTab !== 'inquiries' && (
                        <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                          <Edit3 size={14} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(item.id)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {activeTab === 'inquiries' && (
                    <div className="mt-auto pt-6 border-t border-white/5">
                      <p className="text-zinc-400 text-[0.8rem] italic leading-relaxed mb-6 line-clamp-3">"{item.message}"</p>
                      <div className="flex justify-between items-center text-[0.6rem] uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2 text-zinc-600">
                          <Clock size={10} />
                          <span>{item.event_date}</span>
                        </div>
                        <a href={`mailto:${item.email}`} className="text-amber-600 hover:text-white flex items-center gap-2 group/link transition-colors">
                          <span>Respond</span>
                          <ExternalLink size={10} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bulk Modal */}
        <AnimatePresence>
          {showBulkForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/90 backdrop-blur-xl">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-white/10 w-full max-w-xl p-12 rounded-[3rem] shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="font-serif italic text-3xl text-white">Batch Upload Stills</h3>
                  <button onClick={() => setShowBulkForm(false)} className="text-zinc-500 hover:text-white transition-colors"><X size={24} strokeWidth={1} /></button>
                </div>
                <form onSubmit={handleBulkUpload} className="space-y-8">
                  <div className="space-y-2">
                    <label className="block font-sans text-[0.5rem] uppercase tracking-[0.3em] text-zinc-600 mb-3 ml-1">Category</label>
                    <select name="category" required className="w-full bg-zinc-800 text-white p-4 rounded-2xl text-[0.6rem] uppercase tracking-[0.2em] border border-white/5 focus:border-amber-600">
                      {Object.values(GalleryFilter).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-sans text-[0.5rem] uppercase tracking-[0.3em] text-zinc-600 mb-3 ml-1">Select Images</label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      className="w-full bg-transparent border border-white/10 rounded-2xl p-5 text-zinc-300 font-sans text-xs focus:outline-none focus:border-amber-600 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                    />
                  </div>
                  <button disabled={uploading} type="submit" className="w-full bg-white text-zinc-950 py-5 rounded-2xl font-sans text-[0.7rem] uppercase tracking-[0.4em] font-bold hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center gap-4 disabled:opacity-50 relative overflow-hidden">
                    
                    {uploading && (
                      <div className="absolute inset-0 bg-amber-600/20 z-0">
                         <div className="h-full bg-amber-600/40 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}
                    
                    <div className="relative z-10 flex items-center gap-4">
                      {uploading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                      <span>{uploading ? `Uploading ${uploadProgress}%` : 'Start Batch Upload'}</span>
                    </div>
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Single Modal */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/90 backdrop-blur-xl">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-white/10 w-full max-w-xl p-12 rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="font-serif italic text-3xl text-white">{editingItem ? 'Edit' : 'New'} {activeTab === 'stills' ? 'Still' : activeTab === 'cinema' ? 'Film' : activeTab}</h3>
                  <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white transition-colors"><X size={24} strokeWidth={1} /></button>
                </div>
                
                <form onSubmit={handleSave} className="space-y-8">
                  {(activeTab === 'stills' || activeTab === 'cinema') && (
                    <>
                      <div className="space-y-2">
                        <label className="block font-sans text-[0.5rem] uppercase tracking-[0.3em] text-zinc-600 ml-1">Title</label>
                        <input name="title" defaultValue={editingItem?.title} placeholder="The Eternal Vow" className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-amber-600 placeholder:text-zinc-800 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="block font-sans text-[0.5rem] uppercase tracking-[0.3em] text-zinc-600 ml-1">
                          {activeTab === 'cinema' ? 'Instagram Reel Link (or full Embed Code)' : 'Upload File'} {editingItem && !editingItem.url.includes('instagram') && '(Leave empty to keep current)'}
                        </label>
                        
                        {activeTab === 'cinema' ? (
                          <div className="space-y-4">
                             <input 
                                name="url" 
                                defaultValue={editingItem?.url} 
                                placeholder="Paste URL or Embed Code here..." 
                                className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-amber-600 placeholder:text-zinc-800 text-sm" 
                              />
                              <div className="space-y-2">
                                <label className="block font-sans text-[0.5rem] uppercase tracking-[0.3em] text-zinc-600 ml-1">Cover Image (Thumbnail)</label>
                                <input 
                                    name="cover_file" 
                                    type="file" 
                                    accept="image/*"
                                    className="w-full bg-transparent border-b border-white/10 py-4 text-zinc-300 font-sans text-sm focus:outline-none focus:border-amber-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                                />
                              </div>
                          </div>
                        ) : (
                          <input 
                              name="file" 
                              type="file" 
                              accept="image/*"
                              className="w-full bg-transparent border-b border-white/10 py-4 text-zinc-300 font-sans text-sm focus:outline-none focus:border-amber-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block font-sans text-[0.5rem] uppercase tracking-[0.3em] text-zinc-600 mb-3 ml-1">Category</label>
                        <select name="category" defaultValue={editingItem?.category || GalleryFilter.WEDDINGS} className="w-full bg-zinc-800 text-white p-4 rounded-2xl text-[0.6rem] uppercase tracking-[0.2em] border border-white/5 focus:border-amber-600">
                          {Object.values(GalleryFilter).map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  {activeTab === 'packages' && (
                    <>
                      <div className="space-y-2">
                        <label className="block font-sans text-[0.5rem] uppercase tracking-[0.3em] text-zinc-600 ml-1">Collection Name</label>
                        <input required name="name" defaultValue={editingItem?.name} placeholder="Platinum Legacy" className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-amber-600 placeholder:text-zinc-800 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="block font-sans text-[0.5rem] uppercase tracking-[0.3em] text-zinc-600 ml-1">Duration</label>
                        <input name="duration" defaultValue={editingItem?.duration} placeholder="3 Day Multi-Event" className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-amber-600 placeholder:text-zinc-800 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="block font-sans text-[0.5rem] uppercase tracking-[0.3em] text-zinc-600 ml-1">Deliverables</label>
                        <textarea name="deliverables" defaultValue={editingItem?.deliverables?.join('\n')} placeholder="1000+ High Res Photos&#10;Cinematic Short Film" rows={4} className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-amber-600 text-sm resize-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="block font-sans text-[0.5rem] uppercase tracking-[0.3em] text-zinc-600 ml-1">Highlights</label>
                        <textarea name="highlights" defaultValue={editingItem?.highlights?.join('\n')} placeholder="Same Day Edit&#10;Drone Coverage" rows={3} className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-amber-600 text-sm resize-none" />
                      </div>
                      <div className="flex items-center gap-4 bg-zinc-800/30 p-5 rounded-2xl border border-white/5">
                        <input type="checkbox" name="is_popular" defaultChecked={editingItem?.is_popular} className="w-5 h-5 accent-amber-600" />
                        <label className="text-zinc-400 text-[0.65rem] uppercase tracking-widest font-bold">Featured Collection</label>
                      </div>
                    </>
                  )}

                  <button disabled={uploading} type="submit" className="w-full bg-white text-zinc-950 py-5 rounded-2xl font-sans text-[0.7rem] uppercase tracking-[0.4em] font-bold hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center gap-4 disabled:opacity-50">
                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    <span>{uploading ? 'Archiving...' : 'Archive Change'}</span>
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
