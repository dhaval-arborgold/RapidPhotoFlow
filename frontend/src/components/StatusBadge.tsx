import { CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import type { ReactElement } from 'react';
import type { PhotoStatus } from '../types';

interface StatusBadgeProps {
  status: PhotoStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles: Record<PhotoStatus, string> = {
    completed: 'bg-green-50 text-green-700 border-green-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    pending: 'bg-slate-50 text-slate-700 border-slate-200',
    failed: 'bg-red-50 text-red-700 border-red-200'
  };
  
  const icons: Record<PhotoStatus, ReactElement> = {
    completed: <CheckCircle className="w-3 h-3" />,
    processing: <Loader2 className="w-3 h-3 animate-spin" />,
    pending: <Clock className="w-3 h-3" />,
    failed: <XCircle className="w-3 h-3" />
  };

  const labels: Record<PhotoStatus, string> = {
    completed: 'Completed',
    processing: 'Processing',
    pending: 'Pending',
    failed: 'Failed'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {icons[status]}
      {labels[status]}
    </span>
  );
};

export default StatusBadge;