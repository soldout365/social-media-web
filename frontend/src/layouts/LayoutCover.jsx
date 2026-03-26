import BackgroundEffect from "../components/BackgroundEffect";

function LayoutCover({ children }) {
  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      {/* DECORATORS - GLOW SHAPES */}
      <div className="absolute top-10 left-10 size-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-10 right-10 size-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-pink-500/10 rounded-full blur-[150px]" />
      <div
        className="absolute top-1/3 right-1/4 size-[400px] bg-blue-500/15 rounded-full blur-[100px] animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* BACKGROUND EFFECT */}
      <BackgroundEffect type="particles" />

      {/* CONTENT - Render children directly */}
      {children}
    </div>
  );
}

export default LayoutCover;
