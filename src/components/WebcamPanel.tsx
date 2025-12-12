import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Square, Camera, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as faceapi from 'face-api.js';
import { EMOTIONS, EmotionType, DETECTION_INTERVAL } from '@/lib/theme';
import type { PredictionResult } from '@/lib/theme';

interface WebcamPanelProps {
  onPrediction: (result: PredictionResult) => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
}

// Map face-api.js expressions to our emotion labels
const expressionToEmotion: Record<string, EmotionType> = {
  happy: 'Happy',
  sad: 'Sad',
  neutral: 'Neutral',
  angry: 'Angry',
  fearful: 'Fear',
  surprised: 'Surprise',
  disgusted: 'Disgust'
};

export function WebcamPanel({ onPrediction, isStreaming, setIsStreaming }: WebcamPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  
  const [fps, setFps] = useState(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Loading face detection models...');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const frameTimesRef = useRef<number[]>([]);

  // Load face-api.js models from CDN
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model';
        
        setLoadingStatus('Loading face detector...');
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        
        setLoadingStatus('Loading expression recognizer...');
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        
        setModelsLoaded(true);
        setLoadingStatus('Models loaded!');
        console.log('Face-api.js models loaded successfully');
      } catch (err) {
        console.error('Error loading models:', err);
        setError('Failed to load face detection models. Please refresh the page.');
      }
    };
    
    loadModels();
  }, []);

  // Calculate FPS
  const updateFps = useCallback(() => {
    const now = performance.now();
    frameTimesRef.current.push(now);
    
    while (frameTimesRef.current.length > 30) {
      frameTimesRef.current.shift();
    }
    
    if (frameTimesRef.current.length >= 2) {
      const elapsed = now - frameTimesRef.current[0];
      const currentFps = Math.round((frameTimesRef.current.length - 1) / (elapsed / 1000));
      setFps(currentFps);
    }
  }, []);

  // Run prediction on video frame
  const runPrediction = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    if (displaySize.width === 0 || displaySize.height === 0) return;
    
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;

    updateFps();

    let faceDetected = false;
    const predictions: Record<EmotionType, number> = {
      Happy: 0,
      Sad: 0,
      Neutral: 0,
      Angry: 0,
      Fear: 0,
      Surprise: 0,
      Disgust: 0
    };

    try {
      // Detect face with expressions
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 320, 
          scoreThreshold: 0.5 
        }))
        .withFaceExpressions();

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detection) {
        faceDetected = true;
        
        // Draw face detection box (mirrored)
        const box = detection.detection.box;
        const mirroredX = canvas.width - box.x - box.width;
        
        ctx.strokeStyle = 'hsl(226, 70%, 55%)';
        ctx.lineWidth = 3;
        ctx.strokeRect(mirroredX, box.y, box.width, box.height);
        
        // Add glow effect
        ctx.shadowColor = 'hsl(226, 70%, 55%)';
        ctx.shadowBlur = 10;
        ctx.strokeRect(mirroredX, box.y, box.width, box.height);
        ctx.shadowBlur = 0;

        // Convert face-api expressions to our format
        const expressions = detection.expressions;
        
        predictions.Happy = expressions.happy * 100;
        predictions.Sad = expressions.sad * 100;
        predictions.Neutral = expressions.neutral * 100;
        predictions.Angry = expressions.angry * 100;
        predictions.Fear = expressions.fearful * 100;
        predictions.Surprise = expressions.surprised * 100;
        predictions.Disgust = expressions.disgusted * 100;
      }
    } catch (err) {
      console.error('Detection error:', err);
    }

    // Find top emotion
    let topEmotion: EmotionType | null = null;
    let maxConfidence = 0;

    if (faceDetected) {
      Object.entries(predictions).forEach(([emotion, confidence]) => {
        if (confidence > maxConfidence) {
          maxConfidence = confidence;
          topEmotion = emotion as EmotionType;
        }
      });
    }

    onPrediction({
      predictions,
      topEmotion,
      confidence: maxConfidence,
      timestamp: new Date(),
      faceDetected
    });
  }, [modelsLoaded, onPrediction, updateFps]);

  // Start webcam stream
  const startStream = async () => {
    if (!modelsLoaded) {
      setError('Please wait for models to load...');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 }, 
          facingMode: 'user' 
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setIsStreaming(true);
      frameTimesRef.current = [];
      
      // Start detection loop
      detectionIntervalRef.current = window.setInterval(runPrediction, DETECTION_INTERVAL);
      
    } catch (err) {
      console.error('Webcam error:', err);
      setError('Unable to access webcam. Please ensure camera permissions are granted.');
    } finally {
      setIsLoading(false);
    }
  };

  // Stop webcam stream
  const stopStream = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    
    setIsStreaming(false);
    setFps(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Camera className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Live Camera Feed</h3>
            <p className="text-xs text-muted-foreground">Real-time emotion detection</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isStreaming ? (
            <button
              onClick={stopStream}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive text-destructive-foreground font-medium text-sm transition-all hover:opacity-90"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          ) : (
            <button
              onClick={startStream}
              disabled={isLoading || !modelsLoaded}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isLoading ? 'Starting...' : 'Start'}
            </button>
          )}
        </div>
      </div>

      {/* Video Container */}
      <div className="webcam-container aspect-video relative bg-muted">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: 'scaleX(-1)' }}
        />
        
        {/* FPS Badge */}
        {isStreaming && (
          <div className="fps-badge">
            {fps} FPS
          </div>
        )}
        
        {/* Status overlay when not streaming */}
        <AnimatePresence>
          {!isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              {error ? (
                <div className="text-center p-6">
                  <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              ) : !modelsLoaded ? (
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                  <p className="text-muted-foreground font-medium">{loadingStatus}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This may take a few seconds...
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">Camera is off</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click "Start" to begin emotion detection
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className={modelsLoaded ? 'text-green-600' : 'text-amber-500'}>
            {modelsLoaded ? '✓ Models Ready' : '⏳ Loading models...'}
          </span>
        </div>
        <span>Detection interval: {DETECTION_INTERVAL}ms</span>
      </div>
    </motion.div>
  );
}
