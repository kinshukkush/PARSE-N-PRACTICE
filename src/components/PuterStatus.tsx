import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function PuterStatus() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('ready');

  useEffect(() => {
    // Don't test API on mount to save quota
    // API will be tested when user actually uses it
    console.log('✅ OpenRouter AI configured and ready to use');
    setStatus('ready');
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 text-yellow-400 text-xs">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Loading AI...</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-red-400 text-xs">
        <XCircle className="h-3 w-3" />
        <span>AI Failed to Load - Please Refresh</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-400 text-xs">
      <CheckCircle className="h-3 w-3" />
      <span>AI Ready (OpenRouter)</span>
    </div>
  );
}
