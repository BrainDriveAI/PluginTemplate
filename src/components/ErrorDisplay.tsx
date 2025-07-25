import React from 'react';

// TEMPLATE: Enhanced error display component with comprehensive error handling
// TODO: Customize this component for your plugin's error handling

export interface ErrorInfo {
  message: string;
  code?: string;
  details?: any;
  timestamp?: string;
  stack?: string;
}

interface ErrorDisplayProps {
  error: string | ErrorInfo;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  showDetails?: boolean;
  variant?: 'error' | 'warning' | 'info';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  className = '',
  showDetails = false,
  variant = 'error'
}) => {
  const [showFullDetails, setShowFullDetails] = React.useState(false);
  
  // Normalize error to ErrorInfo format
  const errorInfo: ErrorInfo = typeof error === 'string'
    ? { message: error, timestamp: new Date().toISOString() }
    : { timestamp: new Date().toISOString(), ...error };

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          backgroundColor: '#fff3cd',
          borderColor: '#ffeaa7',
          color: '#856404',
          icon: '⚠️'
        };
      case 'info':
        return {
          backgroundColor: '#d1ecf1',
          borderColor: '#bee5eb',
          color: '#0c5460',
          icon: 'ℹ️'
        };
      default:
        return {
          backgroundColor: '#f8d7da',
          borderColor: '#f5c6cb',
          color: '#721c24',
          icon: '❌'
        };
    }
  };

  const styles = getVariantStyles();

  const handleCopyError = () => {
    const errorText = `Error: ${errorInfo.message}\nCode: ${errorInfo.code || 'N/A'}\nTime: ${errorInfo.timestamp}\nDetails: ${JSON.stringify(errorInfo.details, null, 2)}`;
    navigator.clipboard.writeText(errorText).then(() => {
      console.log('Error details copied to clipboard');
    }).catch(err => {
      console.warn('Failed to copy error details:', err);
    });
  };

  return (
    <div
      className={`error-display ${className}`}
      style={{
        padding: '12px',
        margin: '8px 0',
        border: `1px solid ${styles.borderColor}`,
        borderRadius: '6px',
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <div className="error-icon" style={{ fontSize: '16px', flexShrink: 0 }}>
          {styles.icon}
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p className="error-message" style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: '500',
              wordBreak: 'break-word'
            }}>
              {errorInfo.message}
            </p>
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '0',
                  marginLeft: '8px',
                  color: styles.color,
                  opacity: 0.7
                }}
                title="Dismiss error"
              >
                ×
              </button>
            )}
          </div>

          {errorInfo.code && (
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
              <strong>Error Code:</strong> {errorInfo.code}
            </div>
          )}

          {errorInfo.timestamp && (
            <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '8px' }}>
              {new Date(errorInfo.timestamp).toLocaleString()}
            </div>
          )}

          {showDetails && (errorInfo.details || errorInfo.stack) && (
            <div style={{ marginBottom: '8px' }}>
              <button
                onClick={() => setShowFullDetails(!showFullDetails)}
                style={{
                  background: 'none',
                  border: `1px solid ${styles.color}`,
                  color: styles.color,
                  padding: '2px 6px',
                  fontSize: '10px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  opacity: 0.8
                }}
              >
                {showFullDetails ? 'Hide Details' : 'Show Details'}
              </button>
              
              {showFullDetails && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  maxHeight: '200px',
                  overflow: 'auto'
                }}>
                  {errorInfo.details && (
                    <div>
                      <strong>Details:</strong>
                      <pre style={{ margin: '4px 0', whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(errorInfo.details, null, 2)}
                      </pre>
                    </div>
                  )}
                  {errorInfo.stack && (
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre style={{ margin: '4px 0', whiteSpace: 'pre-wrap' }}>
                        {errorInfo.stack}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {onRetry && (
              <button
                onClick={onRetry}
                className="retry-button"
                style={{
                  padding: '6px 12px',
                  backgroundColor: styles.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Try Again
              </button>
            )}
            
            {showDetails && (
              <button
                onClick={handleCopyError}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  color: styles.color,
                  border: `1px solid ${styles.color}`,
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
                title="Copy error details to clipboard"
              >
                Copy Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;