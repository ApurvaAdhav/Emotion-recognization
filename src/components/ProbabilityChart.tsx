import { motion } from 'framer-motion';
import { EMOTIONS, EmotionType, emotionConfig } from '@/lib/theme';

interface ProbabilityChartProps {
  predictions: Record<EmotionType, number>;
  topEmotion: EmotionType | null;
}

export function ProbabilityChart({ predictions, topEmotion }: ProbabilityChartProps) {
  // Sort emotions by confidence (descending)
  const sortedEmotions = [...EMOTIONS].sort(
    (a, b) => predictions[b] - predictions[a]
  );

  return (
    <div className="space-y-3">
      {sortedEmotions.map((emotion, index) => {
        const confidence = predictions[emotion];
        const config = emotionConfig[emotion];
        const isTop = emotion === topEmotion;

        return (
          <motion.div
            key={emotion}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-3 ${isTop ? 'scale-105 origin-left' : ''}`}
          >
            {/* Emotion icon */}
            <span 
              className="text-lg w-7 flex-shrink-0"
              role="img" 
              aria-label={emotion}
            >
              {config.icon}
            </span>
            
            {/* Label */}
            <span className={`text-sm w-20 flex-shrink-0 ${
              isTop ? 'font-semibold text-foreground' : 'text-muted-foreground'
            }`}>
              {emotion}
            </span>
            
            {/* Progress bar */}
            <div className="flex-1 confidence-bar">
              <motion.div
                className={`confidence-bar-fill ${config.barClass}`}
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ 
                  duration: 0.5, 
                  ease: 'easeOut' 
                }}
                style={{
                  boxShadow: isTop ? `0 0 12px ${config.color}60` : 'none'
                }}
              />
            </div>
            
            {/* Percentage */}
            <span className={`text-sm w-14 text-right font-mono ${
              isTop ? 'font-bold text-foreground' : 'text-muted-foreground'
            }`}>
              {confidence.toFixed(1)}%
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
