import { CheckCircle, Download, Info } from 'lucide-react';
import { getImageUrl } from '../services/api';
import type { Photo } from '../types';

interface ReviewScreenProps {
  photos: Photo[];
  onDelete: (photoId: string) => Promise<void>;
}

const ReviewScreen = ({ photos }: ReviewScreenProps) => {
  const completedPhotos = photos.filter(p => p.status === 'completed');

  const handleDownload = (photo: Photo) => {
    const link = document.createElement('a');
    link.href = getImageUrl(photo.url);
    link.download = photo.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Review Photos</h2>
        <p className="text-slate-600">
          View and manage processed photos ({completedPhotos.length} completed)
        </p>
      </div>

      {completedPhotos.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <CheckCircle className="w-14 h-14 mx-auto mb-3 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No completed photos yet</h3>
          <p className="text-slate-500">Upload photos and wait for processing to complete</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {completedPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="aspect-square bg-slate-100 overflow-hidden">
                <img
                  src={getImageUrl(photo.url)}
                  alt={photo.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e2e8f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="20"%3EImage%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="text-sm font-medium text-slate-900 mb-1 truncate" title={photo.originalName}>
                  {photo.originalName}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  Processed successfully
                </div>
                
                {/* Metadata */}
                {photo.metadata && (
                  <div className="flex flex-wrap gap-1.5 text-xs text-slate-500">
                    <span className="px-2 py-0.5 bg-slate-100 rounded">
                      {photo.metadata.dimensions}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded">
                      {photo.metadata.size}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded">
                      {photo.metadata.format}
                    </span>
                  </div>
                )}

                {/* Date */}
                <div className="text-xs text-slate-400 mt-2">
                  {formatDate(photo.updatedAt)}
                </div>
              </div>

              {/* Hover Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDownload(photo)}
                  className="p-1.5 bg-white rounded-lg shadow-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Info Badge */}
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
                  <Info className="w-3 h-3 text-slate-600" />
                  <span className="text-xs text-slate-700">
                    {(photo.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewScreen;