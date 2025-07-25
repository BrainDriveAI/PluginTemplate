import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorDisplay, { ErrorInfo as ErrorInfoType } from './ErrorDisplay';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * TEMPLATE: Error Boundary Component
 * 
 * This component catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * Key features:
 * - Catches and displays React component errors
 * - Provides detailed error information for debugging
 * - Supports custom fallback UI
 * - Automatic error reporting
 * - Reset functionality for error recovery
 * - Integration with plugin error handling patterns
 */
class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.group('🚨 ErrorBoundary: Component Error Caught');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    // Update state with error information
    this.setState({
      error,
      errorInfo,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        console.error('ErrorBoundary: Error in custom error handler:', handlerError);
      }
    }

    // Report error to external service (if configured)
    this.reportError(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    // Reset error state if resetKeys changed
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys![index]
      );
      
      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }

    // Reset error state if resetOnPropsChange is true and props changed
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  /**
   * Report error to external monitoring service
   * TODO: Integrate with your error reporting service (e.g., Sentry, LogRocket)
   */
  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Example: Send to error reporting service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        errorId: this.state.errorId
      };

      // TODO: Replace with your error reporting service
      console.log('📊 Error Report (TODO: Send to monitoring service):', errorReport);
      
      // Example integration:
      // if (window.Sentry) {
      //   window.Sentry.captureException(error, {
      //     contexts: { react: { componentStack: errorInfo.componentStack } }
      //   });
      // }
      
    } catch (reportingError) {
      console.error('ErrorBoundary: Failed to report error:', reportingError);
    }
  };

  /**
   * Reset the error boundary state
   */
  private resetErrorBoundary = () => {
    console.log('🔄 ErrorBoundary: Resetting error state');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  /**
   * Handle retry action from error display
   */
  private handleRetry = () => {
    console.log('🔄 ErrorBoundary: User initiated retry');
    this.resetErrorBoundary();
  };

  /**
   * Handle automatic retry with delay
   */
  private handleAutoRetry = (delayMs: number = 5000) => {
    console.log(`⏰ ErrorBoundary: Auto-retry scheduled in ${delayMs}ms`);
    
    this.resetTimeoutId = window.setTimeout(() => {
      console.log('🔄 ErrorBoundary: Auto-retry executing');
      this.resetErrorBoundary();
    }, delayMs);
  };

  /**
   * Create detailed error information for display
   */
  private createErrorInfo = (): ErrorInfoType => {
    const { error, errorInfo, errorId } = this.state;
    
    return {
      message: error?.message || 'An unexpected error occurred',
      code: error?.name || 'COMPONENT_ERROR',
      details: {
        stack: error?.stack,
        componentStack: errorInfo?.componentStack,
        errorId,
        timestamp: new Date().toISOString(),
        props: this.props.children ? 'Component tree present' : 'No component tree'
      },
      timestamp: new Date().toISOString(),
      stack: error?.stack
    };
  };

  render() {
    const { hasError } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Custom fallback UI provided
      if (fallback) {
        return fallback;
      }

      // Default error UI with comprehensive error information
      const errorInfo = this.createErrorInfo();

      return (
        <div style={{
          padding: '20px',
          margin: '10px',
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#fff5f5',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#d63031'
          }}>
            🚨 Component Error
          </div>

          <ErrorDisplay
            error={errorInfo}
            onRetry={this.handleRetry}
            showDetails={true}
            variant="error"
          />

          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#6c757d'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>🔧 Troubleshooting Tips:</strong>
            </div>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li>Check the browser console for additional error details</li>
              <li>Verify that all required props are provided correctly</li>
              <li>Ensure all dependencies are properly imported</li>
              <li>Check for any recent changes that might have caused this error</li>
              <li>Try refreshing the page if this is a temporary issue</li>
            </ul>
          </div>

          <div style={{
            marginTop: '12px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => this.handleAutoRetry(1000)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Auto-Retry in 1s
            </button>
            
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

/**
 * HOC (Higher-Order Component) wrapper for easy error boundary usage
 * 
 * @example
 * const SafeComponent = withErrorBoundary(MyComponent, {
 *   onError: (error, errorInfo) => console.log('Component error:', error)
 * });
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
}

/**
 * Hook for programmatic error boundary reset
 * Use this in functional components to trigger error boundary reset
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  const throwError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  return { throwError, resetError };
};