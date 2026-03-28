import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-white/50 border-8 max-w-xl w-full space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
            
            <div className="flex flex-col items-center gap-6">
              <div className="p-6 bg-red-50 text-red-600 rounded-[2rem] shadow-sm animate-pulse">
                <AlertCircle size={48} />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Something went wrong!</h1>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">
                  We've encountered an unexpected error. Don't worry, your data is safe.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl text-left border border-gray-100 overflow-hidden">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Error Details</p>
              <p className="text-xs font-mono text-red-500 line-clamp-3">
                {this.state.error?.message || 'Unknown runtime error'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-3 bg-gray-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl active:scale-95"
              >
                <RefreshCcw size={18} /> Retry
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-3 bg-orange-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-900/10 active:scale-95"
              >
                <Home size={18} /> Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
