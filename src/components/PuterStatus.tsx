import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function PuterStatus() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 30;
    
    const checkPuter = setInterval(() => {
      attempts++;
      
      if (typeof puter !== 'undefined' && puter?.ai) {
        console.log('✅ Puter.js is ready!');
        setStatus('ready');
        clearInterval(checkPuter);
      } else if (attempts >= maxAttempts) {
        console.error('❌ Puter.js failed to load');
        setStatus('error');
        clearInterval(checkPuter);
      }
    }, 200);

    return () => clearInterval(checkPuter);
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
      <span>AI Ready</span>
    </div>
  );
}
