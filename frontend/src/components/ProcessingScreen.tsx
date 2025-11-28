import { useMemo } from 'react';
import { Image, CheckCircle, Activity, XCircle, Clock, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { getImageUrl } from '../services/api';
import type { Photo } from '../types';

interface ProcessingScreenProps {
  photos: Photo[];
  onDelete: (photoId: string) => Promise<void>;
}

const ProcessingScreen = ({ photos, onDelete }: ProcessingScreenProps) => {
  const stats = useMemo(() => ({
    total: photos.length,
    completed: photos.filter(p => p.status === 'completed').length,
    processing: photos.filter(p => p.status === 'processing').length,
    failed: photos.filter(p => p.status === 'failed').length,
    pending: photos.filter(p => p.status === 'pending').length
  }), [photos]);

  const statCards = [
    { label: 'Total', count: stats.total, color: 'bg-slate-50 text-slate-700 border-slate-200', icon: Image },
    { label: 'Completed', count: stats.completed, color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
    { label: 'Processing', count: stats.processing, color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Activity },
    { label: 'Failed', count: stats.failed, color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle }
  ];

  const formatTime = (createdAt: string, updatedAt: string): string => {
    const created = new Date(createdAt);
    const updated = new Date(updatedAt);
    const diff = Math.floor((updated.getTime() - created.getTime()) / 1000);
    
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const getProgress = (photo: Photo): number => {
    return photo.progress || 0;
  };

  const getProgressStage = (progress: number): string => {
    if (progress >= 90) return 'Finalizing...';
    if (progress >= 70) return 'Optimizing...';
    if (progress >= 50) return 'Filtering...';
    if (progress >= 30) return 'Analyzing...';
    if (progress >= 10) return 'Starting...';
    return 'Pending...';
  };

  const handleDelete = async (photoId: string) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      await onDelete(photoId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Processing Queue</h2>
        <p className="text-slate-600">Monitor your photo processing pipeline in real-time</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} rounded-xl border p-4 transition hover:-translate-y-0.5`}
          >
            <stat.icon className="w-7 h-7 mb-2 opacity-70" />
            <div className="text-2xl font-bold mb-0.5">{stat.count}</div>
            <div className="text-xs font-medium opacity-75">{stat.label}</div>
          </div>
        ))}
      </div>

      {photos.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <Clock className="w-14 h-14 mx-auto mb-3 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No photos in queue</h3>
          <p className="text-slate-500">Upload some photos to get started</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {photos.map((photo) => {
                  const progress = getProgress(photo);
                  const isProcessing = photo.status === 'processing';
                  
                  return (
                    <tr key={photo.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shadow-sm flex-shrink-0 relative">
                            <img
                              src={getImageUrl(photo.url)}
                              alt={photo.originalName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%23e2e8f0" width="40" height="40"/%3E%3C/svg%3E';
                              }}
                            />
                            {isProcessing && (
                              <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-[1px] flex items-center justify-center">
                                <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate">
                              {photo.originalName}
                            </div>
                            <div className="text-xs text-slate-500">
                              {(photo.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={photo.status} />
                        {photo.error && (
                          <div className="text-xs text-red-600 mt-1">{photo.error}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">
                              {isProcessing ? getProgressStage(progress) : photo.status}
                            </span>
                            <span className="font-semibold text-slate-700">
                              {progress}%
                            </span>
                          </div>
                          <div className="w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                photo.status === 'completed' ? 'bg-green-500' :
                                photo.status === 'processing' ? 'bg-blue-500' :
                                photo.status === 'failed' ? 'bg-red-500' :
                                'bg-slate-400'
                              } ${isProcessing ? 'animate-pulse' : ''}`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatTime(photo.createdAt, photo.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(photo.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingScreen;