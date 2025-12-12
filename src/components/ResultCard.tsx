import { motion, AnimatePresence } from 'framer-motion';
import { User, AlertTriangle } from 'lucide-react';
import { emotionConfig, EmotionType } from '@/lib/theme';
import type { PredictionResult } from '@/lib/theme';
import { ProbabilityChart } from './ProbabilityChart';

interface ResultCardProps {
  prediction: PredictionResult | null;
}

export function ResultCard({ prediction }: ResultCardProps) {
  const noFace = !prediction?.faceDetected;
  const topEmotion = prediction?.topEmotion;
  const confidence = prediction?.confidence ?? 0;
  
  const config = topEmotion ? emotionConfig[topEmotion] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card p-6 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Live Prediction</h3>
          <p className="text-xs text-muted-foreground">Real-time emotion analysis</p>
        </div>
      </div>

      {/* Main prediction display */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {noFace ? (
            <motion.div
              key="no-face"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                <AlertTriangle className="w-10 h-10 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">No Face Detected</h4>
              <p className="text-sm text-muted-foreground">
                Position your face in front of the camera
              </p>
            </motion.div>
          ) : topEmotion && config ? (
            <motion.div
              key={topEmotion}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center mb-6"
            >
              {/* Emotion icon and label */}
              <motion.div
                className="prediction-glow inline-block"
                key={`${topEmotion}-${Math.floor(confidence)}`}
              >
                <div 
                  className={`w-24 h-24 rounded-3xl ${config.bgClass} mx-auto flex items-center justify-center mb-4 shadow-lg`}
                  style={{ boxShadow: `0 8px 24px ${config.color}40` }}
                >
                  <span className="text-5xl">{config.icon}</span>
                </div>
              </motion.div>
              
              <h4 className="text-2xl font-bold text-foreground mb-2">{topEmotion}</h4>
              
              {/* Confidence badge */}
              <div className={`emotion-badge ${config.barClass} mx-auto`}>
                <span className="text-lg font-bold">{confidence.toFixed(1)}%</span>
                <span>confidence</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Waiting for detection...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Probability Chart */}
        {prediction && prediction.faceDetected && (
          <div className="mt-6">
            <h5 className="text-sm font-medium text-muted-foreground mb-3">
              Emotion Confidence Levels
            </h5>
            <ProbabilityChart 
              predictions={prediction.predictions} 
              topEmotion={prediction.topEmotion}
            />
          </div>
        )}
      </div>

      {/* Timestamp */}
      {prediction && (
        <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground text-center">
          Last updated: {prediction.timestamp.toLocaleTimeString()}
        </div>
      )}
    </motion.div>
  );
}
