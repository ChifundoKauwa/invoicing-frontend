// LoadingSpinner shows a consistent animated spinner and optional message while content is loading.

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div className="text-center">
        <div
          className={`${sizeClasses[size]} inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent`}
        ></div>
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
