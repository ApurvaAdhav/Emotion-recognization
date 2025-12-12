import { useState, useCallback, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { WebcamPanel } from '@/components/WebcamPanel';
import { ResultCard } from '@/components/ResultCard';
import { HistoryList } from '@/components/HistoryList';
import { ModelInfo } from '@/components/ModelInfo';
import { Reports } from '@/components/Reports';
import { Footer } from '@/components/Footer';
import type { PredictionResult, EmotionType } from '@/lib/theme';

interface HistoryEntry {
  id: string;
  emotion: EmotionType;
  confidence: number;
  timestamp: Date;
}

export default function EmotionDashboard() {
  const [activeView, setActiveView] = useState('realtime');
  const [isStreaming, setIsStreaming] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [emotionCounts, setEmotionCounts] = useState<Record<string, number>>({});
  const [totalDetections, setTotalDetections] = useState(0);
  
  const lastEmotionRef = useRef<EmotionType | null>(null);

  const handlePrediction = useCallback((result: PredictionResult) => {
    setPrediction(result);
    
    // Track emotion changes for history
    if (result.faceDetected && result.topEmotion) {
      // Only add to history if emotion changed
      if (result.topEmotion !== lastEmotionRef.current) {
        lastEmotionRef.current = result.topEmotion;
        
        const newEntry: HistoryEntry = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          emotion: result.topEmotion,
          confidence: result.confidence,
          timestamp: result.timestamp
        };
        
        setHistory(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50 entries
      }
      
      // Update counts
      setTotalDetections(prev => prev + 1);
      setEmotionCounts(prev => ({
        ...prev,
        [result.topEmotion!]: (prev[result.topEmotion!] || 0) + 1
      }));
    } else {
      lastEmotionRef.current = null;
    }
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setEmotionCounts({});
    setTotalDetections(0);
    lastEmotionRef.current = null;
  }, []);

  const renderMainContent = () => {
    switch (activeView) {
      case 'model-info':
        return <ModelInfo />;
      case 'reports':
        return <Reports totalDetections={totalDetections} emotionCounts={emotionCounts} />;
      case 'dashboard':
      case 'realtime':
      default:
        return (
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Webcam Panel - takes 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              <WebcamPanel
                onPrediction={handlePrediction}
                isStreaming={isStreaming}
                setIsStreaming={setIsStreaming}
              />
              <HistoryList history={history} onClear={handleClearHistory} />
            </div>
            
            {/* Result Card - takes 2 columns */}
            <div className="lg:col-span-2">
              <ResultCard prediction={prediction} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-pastel flex w-full">
      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar isStreaming={isStreaming} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderMainContent()}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
