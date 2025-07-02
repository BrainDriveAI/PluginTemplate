import React from 'react';

// TEMPLATE: Error display component
// TODO: Customize this component for your plugin's error handling

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`error-display ${className}`}>
      <div className="error-icon">⚠️</div>
      <p className="error-message">{error}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;