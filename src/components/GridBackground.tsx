export default function GridBackground() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: '20px 20px',
          backgroundImage:
            'linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)',
        }}
      />
      {/* Radial gradient mask for faded edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: '#0a0a0a',
          maskImage:
            'radial-gradient(ellipse at center, transparent 20%, black)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, transparent 20%, black)',
        }}
      />
    </>
  );
}
