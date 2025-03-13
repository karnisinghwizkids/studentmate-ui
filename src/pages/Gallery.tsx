import React, { useState, useRef } from 'react';
import { Breadcrumbs } from '../common/components/Breadcrumbs';
import { Image as ImageIcon, Upload, Trash2, X, Loader2, Plus } from 'lucide-react';
import { Button } from '../common/components/Button';

interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  createdAt: string;
}

export default function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([
    {
      id: '1',
      title: 'My First Science Project',
      imageUrl: 'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=800',
      description: 'A drawing of the solar system',
      createdAt: '2024-02-15'
    },
    {
      id: '2',
      title: 'Chemistry Experiment',
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
      description: 'Documenting my first chemistry experiment',
      createdAt: '2024-02-14'
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newArtwork, setNewArtwork] = useState({
    title: '',
    description: ''
  });
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    setUploadError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set isDragging to false if we're leaving the dropzone itself
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewImage || !newArtwork.title) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // In a real app, you would upload to a server here
      // For now, we'll simulate a delay and add to local state
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newArtworkItem: Artwork = {
        id: Date.now().toString(),
        title: newArtwork.title,
        description: newArtwork.description,
        imageUrl: previewImage,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setArtworks(prev => [newArtworkItem, ...prev]);
      handleCloseUpload();
    } catch (error) {
      setUploadError('Failed to upload artwork. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseUpload = () => {
    setShowUploadDialog(false);
    setPreviewImage(null);
    setNewArtwork({ title: '', description: '' });
    setUploadError(null);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    setArtworks(prev => prev.filter(artwork => artwork.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="p-4">
        <Breadcrumbs />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Art Gallery</h1>
          <Button
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
            onClick={() => setShowUploadDialog(true)}
          >
            <Upload className="w-5 h-5" />
            Upload Artwork
          </Button>
        </div>

        {artworks.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <ImageIcon className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No artworks yet</h2>
            <p className="text-white/70">Start uploading your amazing creations!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden group"
              >
                <div className="aspect-video relative">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleDelete(artwork.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {artwork.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-2">
                    {artwork.description}
                  </p>
                  <time className="text-xs text-white/50">
                    {new Date(artwork.createdAt).toLocaleDateString()}
                  </time>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Dialog */}
        {showUploadDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Upload Artwork</h2>
                <button
                  onClick={handleCloseUpload}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                {previewImage ? (
                  <div className="relative aspect-video mb-4">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    ref={dropZoneRef}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Plus className={`w-8 h-8 mx-auto mb-2 transition-colors ${
                      isDragging ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm transition-colors ${
                      isDragging ? 'text-blue-500' : 'text-gray-500'
                    }`}>
                      {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />

                <input
                  type="text"
                  placeholder="Artwork Title"
                  value={newArtwork.title}
                  onChange={(e) => setNewArtwork(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <textarea
                  placeholder="Description (optional)"
                  value={newArtwork.description}
                  onChange={(e) => setNewArtwork(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />

                {uploadError && (
                  <p className="text-red-500 text-sm">{uploadError}</p>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseUpload}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUploading || !previewImage || !newArtwork.title}
                    className="flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}