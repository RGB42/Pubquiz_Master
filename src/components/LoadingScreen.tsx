interface LoadingScreenProps {
  message: string;
  subMessage?: string;
}

export function LoadingScreen({ message, subMessage }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Animated rings */}
          <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-ping" />
          <div className="absolute inset-2 border-4 border-pink-500/30 rounded-full animate-ping animation-delay-200" />
          <div className="absolute inset-4 border-4 border-purple-400/30 rounded-full animate-ping animation-delay-400" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-bounce">🧠</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
        {subMessage && (
          <p className="text-purple-200">{subMessage}</p>
        )}
        
        <div className="mt-8 flex justify-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
