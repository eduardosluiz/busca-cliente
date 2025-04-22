interface SpinnerProps {
  className?: string;
}

export function Spinner({ className = 'h-8 w-8' }: SpinnerProps) {
  return (
    <div className={`animate-spin rounded-full border-b-2 border-current ${className}`} />
  );
} 