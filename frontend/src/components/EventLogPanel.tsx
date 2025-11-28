import { Activity, Upload, CheckCircle, XCircle, Clock, Trash2, X } from 'lucide-react';
import type { Event } from '../types';

interface EventLogPanelProps {
  events: Event[];
  variant?: 'sidebar' | 'drawer';
  onClose?: () => void;
}

const EventLogPanel = ({ events, variant = 'sidebar', onClose }: EventLogPanelProps) => {
  const getEventColor = (eventType: string): string => {
    switch(eventType) {
      case 'photo_uploaded': return 'bg-purple-500';
      case 'processing_started': return 'bg-blue-500';
      case 'processing_completed': return 'bg-green-500';
      case 'processing_failed': return 'bg-red-500';
      case 'status_updated': return 'bg-yellow-500';
      case 'photo_deleted': return 'bg-slate-500';
      default: return 'bg-slate-400';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch(eventType) {
      case 'photo_uploaded': return <Upload className="w-3 h-3" />;
      case 'processing_started': return <Clock className="w-3 h-3" />;
      case 'processing_completed': return <CheckCircle className="w-3 h-3" />;
      case 'processing_failed': return <XCircle className="w-3 h-3" />;
      case 'status_updated': return <Activity className="w-3 h-3" />;
      case 'photo_deleted': return <Trash2 className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  const getEventLabel = (eventType: string): string => {
    switch(eventType) {
      case 'photo_uploaded': return 'Uploaded';
      case 'processing_started': return 'Processing';
      case 'processing_completed': return 'Completed';
      case 'processing_failed': return 'Failed';
      case 'status_updated': return 'Updated';
      case 'photo_deleted': return 'Deleted';
      default: return eventType;
    }
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const getEventMessage = (event: Event): string => {
    const details = event.details;
    
    switch(event.event) {
      case 'photo_uploaded':
        return `${details.filename || 'Photo'} uploaded`;
      case 'processing_started':
        return 'Processing started';
      case 'processing_completed':
        return 'Processing completed successfully';
      case 'processing_failed':
        return `Processing failed${details.error ? ': ' + details.error : ''}`;
      case 'status_updated':
        return `Status changed to ${details.newStatus || 'unknown'}`;
      case 'photo_deleted':
        return `${details.filename || 'Photo'} deleted`;
      default:
        return event.event;
    }
  };

  const containerStyles =
    variant === 'drawer'
      ? 'bg-white rounded-t-2xl shadow-2xl max-h-[70vh]'
      : 'bg-white border-l border-slate-200 h-full';

  return (
    <div className={`flex h-full flex-col ${containerStyles}`}>
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate-700" />
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Event Log</h3>
            <p className="text-xs text-slate-500">Real-time workflow events</p>
          </div>
        </div>
        {variant === 'drawer' && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-600">No events yet</p>
            <p className="text-xs text-slate-400 mt-1">Activity will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, idx) => (
              <div key={event.id} className="flex gap-3">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm ${getEventColor(event.event)}`}>
                    {getEventIcon(event.event)}
                  </div>
                  {idx !== events.length - 1 && (
                    <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full text-white ${getEventColor(event.event)}`}>
                      {getEventLabel(event.event)}
                    </span>
                    <span className="text-xs text-slate-500 shrink-0">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm text-slate-700 break-words">
                    {getEventMessage(event)}
                  </div>
                  
                  {/* Additional details */}
                  {event.details && Object.keys(event.details).length > 0 && (
                    <div className="mt-2 text-xs text-slate-500">
                      {(() => {
                        const sizeValue = event.details.size;
                        const sizeInBytes =
                          typeof sizeValue === 'number'
                            ? sizeValue
                            : typeof sizeValue === 'string'
                              ? Number(sizeValue)
                              : undefined;
                        if (!Number.isFinite(sizeInBytes)) {
                          return null;
                        }
                        return (
                          <div>
                            Size: {((sizeInBytes as number) / 1024 / 1024).toFixed(2)} MB
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventLogPanel;