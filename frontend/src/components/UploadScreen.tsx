import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileImage } from 'lucide-react';

interface UploadScreenProps {
  onUpload: (files: File[]) => Promise<void>;
  loading: boolean;
}

interface FileWithProgress {
  file: File;
  progress: number;
  preview?: string;
}

const UploadScreen = ({ onUpload, loading }: UploadScreenProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles: FileWithProgress[] = [];
    
    Array.from(files).forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return;
      }

      // Validate file size (10MB)
      if (file.size > 50 * 1024 * 1024) {
        alert(`${file.name} is too large (max 10MB)`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setSelectedFiles(prev => 
          prev.map(f => 
            f.file === file ? { ...f, preview } : f
          )
        );
      };
      reader.readAsDataURL(file);

      newFiles.push({ file, progress: 0 });
    });

    setSelectedFiles(prev => [...prev, ...newFiles]);
  }, []);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  // Handle file input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  // Remove file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    const files = selectedFiles.map(f => f.file);
    await onUpload(files);
    setSelectedFiles([]);
  };

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div
        className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all cursor-pointer bg-white ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-300 hover:border-blue-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg">
          <Upload className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Drop photos here or click to browse
        </h3>
        <p className="text-sm text-slate-500">
          Support for JPG, PNG, GIF, WEBP • Max 10MB per file • Up to 10 files
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">
              Selected Files ({selectedFiles.length})
            </h3>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload All'}
            </button>
          </div>

          <div className="space-y-3">
            {selectedFiles.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {item.preview ? (
                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileImage className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {item.file.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatSize(item.file.size)}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFiles.length === 0 && (
        <div className="text-center text-slate-400 mt-4">
          <p className="text-sm">No files selected yet</p>
        </div>
      )}
    </div>
  );
};

export default UploadScreen;