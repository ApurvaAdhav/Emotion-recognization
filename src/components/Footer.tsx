export function Footer() {
  return (
    <footer className="glass-navbar px-6 py-4 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>Real-time Emotion Analytics — Powered by AI/ML</p>
        <p className="text-xs">
          Built with TensorFlow.js & Face-API.js
        </p>
      </div>
    </footer>
  );
}
