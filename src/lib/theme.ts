// Theme configuration for Emotion Recognition Dashboard

export const EMOTIONS = [
  'Happy',
  'Sad',
  'Neutral',
  'Angry',
  'Fear',
  'Surprise',
  'Disgust'
] as const;

export type EmotionType = typeof EMOTIONS[number];

export const emotionConfig: Record<EmotionType, {
  color: string;
  bgClass: string;
  barClass: string;
  icon: string;
  gradient: string;
}> = {
  Happy: {
    color: 'hsl(45 90% 55%)',
    bgClass: 'bg-pastel-yellow',
    barClass: 'happy',
    icon: '😊',
    gradient: 'from-yellow-400 to-orange-300',
  },
  Sad: {
    color: 'hsl(210 70% 55%)',
    bgClass: 'bg-pastel-blue',
    barClass: 'sad',
    icon: '😢',
    gradient: 'from-blue-400 to-indigo-400',
  },
  Neutral: {
    color: 'hsl(220 15% 55%)',
    bgClass: 'bg-muted',
    barClass: 'neutral',
    icon: '😐',
    gradient: 'from-gray-400 to-slate-400',
  },
  Angry: {
    color: 'hsl(0 75% 55%)',
    bgClass: 'bg-pastel-red',
    barClass: 'angry',
    icon: '😠',
    gradient: 'from-red-400 to-rose-400',
  },
  Fear: {
    color: 'hsl(270 60% 55%)',
    bgClass: 'bg-pastel-purple',
    barClass: 'fear',
    icon: '😨',
    gradient: 'from-purple-400 to-violet-400',
  },
  Surprise: {
    color: 'hsl(35 90% 55%)',
    bgClass: 'bg-pastel-orange',
    barClass: 'surprise',
    icon: '😮',
    gradient: 'from-orange-400 to-amber-400',
  },
  Disgust: {
    color: 'hsl(150 50% 45%)',
    bgClass: 'bg-pastel-green',
    barClass: 'disgust',
    icon: '🤢',
    gradient: 'from-green-400 to-emerald-400',
  },
};

export const defaultPrediction: Record<EmotionType, number> = {
  Happy: 0,
  Sad: 0,
  Neutral: 0,
  Angry: 0,
  Fear: 0,
  Surprise: 0,
  Disgust: 0,
};

export interface PredictionResult {
  predictions: Record<EmotionType, number>;
  topEmotion: EmotionType | null;
  confidence: number;
  timestamp: Date;
  faceDetected: boolean;
}

export const DETECTION_INTERVAL = 250; // ms between detections
export const MODEL_INPUT_SIZE = 48; // Expected model input size (48x48 grayscale)
