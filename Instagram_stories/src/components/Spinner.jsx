export default function Spinner({ size = '24px', className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`border-2 border-ig-muted border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
    />
  );
}
