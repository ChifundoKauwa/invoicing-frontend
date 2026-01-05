// ErrorMessage displays an error summary with an optional retry action button.

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ 
  title = 'Error', 
  message, 
  onRetry 
}: ErrorMessageProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
      <div className="text-red-600 mb-3 sm:mb-4">
        <svg
          className="w-10 h-10 sm:w-12 sm:h-12 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors active:scale-95 text-sm sm:text-base"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
