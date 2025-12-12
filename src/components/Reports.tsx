import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Download } from 'lucide-react';
import { EMOTIONS, emotionConfig } from '@/lib/theme';

interface ReportsProps {
  totalDetections: number;
  emotionCounts: Record<string, number>;
}

export function Reports({ totalDetections, emotionCounts }: ReportsProps) {
  // Calculate percentages
  const emotionPercentages = EMOTIONS.map(emotion => ({
    emotion,
    count: emotionCounts[emotion] || 0,
    percentage: totalDetections > 0 
      ? ((emotionCounts[emotion] || 0) / totalDetections) * 100 
      : 0
  })).sort((a, b) => b.count - a.count);

  const topEmotion = emotionPercentages[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Detections</p>
              <p className="text-2xl font-bold text-foreground">{totalDetections}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Top Emotion</p>
              <p className="text-2xl font-bold text-foreground">
                {topEmotion.count > 0 ? topEmotion.emotion : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Session</p>
              <p className="text-2xl font-bold text-foreground">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Emotion Distribution</h3>
              <p className="text-xs text-muted-foreground">Session statistics</p>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-muted-foreground transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {totalDetections === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No data yet</p>
            <p className="text-sm mt-1">Start detection to see reports</p>
          </div>
        ) : (
          <div className="space-y-4">
            {emotionPercentages.map(({ emotion, count, percentage }, idx) => {
              const config = emotionConfig[emotion];
              
              return (
                <motion.div
                  key={emotion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>{config.icon}</span>
                      <span className="text-sm font-medium text-foreground">{emotion}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="confidence-bar">
                    <motion.div
                      className={`confidence-bar-fill ${config.barClass}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
