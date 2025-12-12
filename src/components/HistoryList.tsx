import { motion } from 'framer-motion';
import { Clock, Trash2 } from 'lucide-react';
import { emotionConfig, EmotionType } from '@/lib/theme';

interface HistoryEntry {
  id: string;
  emotion: EmotionType;
  confidence: number;
  timestamp: Date;
}

interface HistoryListProps {
  history: HistoryEntry[];
  onClear: () => void;
}

export function HistoryList({ history, onClear }: HistoryListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Detection History</h3>
            <p className="text-xs text-muted-foreground">Recent emotion events</p>
          </div>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Clear history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* History entries */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No events yet</p>
            <p className="text-xs mt-1">Start detection to see history</p>
          </div>
        ) : (
          history.map((entry, index) => {
            const config = emotionConfig[entry.emotion];
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <span className="text-xl" role="img" aria-label={entry.emotion}>
                  {config.icon}
                </span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">
                      {entry.emotion}
                    </span>
                    <span className={`emotion-badge ${config.barClass} text-xs px-2 py-0.5`}>
                      {entry.confidence.toFixed(0)}%
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
