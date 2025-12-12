import { motion } from 'framer-motion';
import { Brain, Info, Cpu, Box } from 'lucide-react';
import { EMOTIONS, MODEL_INPUT_SIZE, DETECTION_INTERVAL } from '@/lib/theme';

export function ModelInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Model Overview Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Model Information</h3>
            <p className="text-xs text-muted-foreground">CNN-based emotion classifier</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Architecture</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Convolutional Neural Network (CNN) with multiple conv layers followed by fully connected layers
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Box className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Input Shape</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {MODEL_INPUT_SIZE}x{MODEL_INPUT_SIZE}x1 (Grayscale)
            </p>
          </div>
        </div>
      </div>

      {/* Emotions Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Detected Emotions</h3>
            <p className="text-xs text-muted-foreground">7-class classification</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EMOTIONS.map((emotion, idx) => (
            <motion.div
              key={emotion}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 rounded-xl bg-muted/30 text-center"
            >
              <span className="text-2xl block mb-1">
                {['😊', '😢', '😐', '😠', '😨', '😮', '🤢'][idx]}
              </span>
              <span className="text-xs font-medium text-foreground">{emotion}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Technical Details */}
      <div className="glass-card p-6">
        <h4 className="font-semibold text-foreground mb-4">Technical Specifications</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex justify-between">
            <span>Detection Interval</span>
            <span className="font-mono text-foreground">{DETECTION_INTERVAL}ms</span>
          </li>
          <li className="flex justify-between">
            <span>Face Detection</span>
            <span className="font-mono text-foreground">TinyFaceDetector</span>
          </li>
          <li className="flex justify-between">
            <span>Framework</span>
            <span className="font-mono text-foreground">TensorFlow.js</span>
          </li>
          <li className="flex justify-between">
            <span>Preprocessing</span>
            <span className="font-mono text-foreground">Grayscale, Normalized</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
