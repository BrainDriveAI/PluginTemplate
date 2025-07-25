// TEMPLATE: Comprehensive error handling utilities for BrainDrive plugins
// TODO: Customize error types and handling strategies for your specific plugin needs

/**
 * Custom error types for better error categorization and handling
 */
export class PluginError extends Error {
  public readonly code: string;
  public readonly details?: any;
  public readonly timestamp: string;
  public readonly recoverable: boolean;

  constructor(
    message: string,
    code: string = 'PLUGIN_ERROR',
    details?: any,
    recoverable: boolean = true
  ) {
    super(message);
    this.name = 'PluginError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.recoverable = recoverable;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PluginError);
    }
  }

  /**
   * Convert error to a serializable object for logging/reporting
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      recoverable: this.recoverable,
      stack: this.stack
    };
  }
}

/**
 * Service-related errors (API, Event Service, etc.)
 */
export class ServiceError extends PluginError {
  public readonly service: string;

  constructor(
    message: string,
    service: string,
    code: string = 'SERVICE_ERROR',
    details?: any,
    recoverable: boolean = true
  ) {
    super(message, code, details, recoverable);
    this.name = 'ServiceError';
    this.service = service;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      service: this.service
    };
  }
}

/**
 * Validation-related errors
 */
export class ValidationError extends PluginError {
  public readonly field?: string;
  public readonly value?: any;

  constructor(
    message: string,
    field?: string,
    value?: any,
    code: string = 'VALIDATION_ERROR'
  ) {
    super(message, code, { field, value }, false); // Validation errors are typically not recoverable
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      field: this.field,
      value: this.value
    };
  }
}

/**
 * Configuration-related errors
 */
export class ConfigurationError extends PluginError {
  public readonly configKey?: string;

  constructor(
    message: string,
    configKey?: string,
    code: string = 'CONFIG_ERROR'
  ) {
    super(message, code, { configKey }, false);
    this.name = 'ConfigurationError';
    this.configKey = configKey;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      configKey: this.configKey
    };
  }
}

/**
 * Network/API related errors
 */
export class NetworkError extends ServiceError {
  public readonly status?: number;
  public readonly url?: string;

  constructor(
    message: string,
    status?: number,
    url?: string,
    code: string = 'NETWORK_ERROR'
  ) {
    super(message, 'network', code, { status, url }, true);
    this.name = 'NetworkError';
    this.status = status;
    this.url = url;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      status: this.status,
      url: this.url
    };
  }
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Error handling strategies
 */
export enum ErrorStrategy {
  RETRY = 'retry',
  FALLBACK = 'fallback',
  IGNORE = 'ignore',
  ESCALATE = 'escalate',
  USER_ACTION = 'user_action'
}

/**
 * Error context information
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  pluginId?: string;
  moduleId?: string;
  additionalData?: Record<string, any>;
}

/**
 * Error handling configuration
 */
export interface ErrorHandlingConfig {
  maxRetries?: number;
  retryDelay?: number;
  enableLogging?: boolean;
  enableReporting?: boolean;
  fallbackValues?: Record<string, any>;
  userNotification?: boolean;
}

/**
 * Comprehensive error handler class
 */
export class ErrorHandler {
  private config: ErrorHandlingConfig;
  private context: ErrorContext;
  private errorCounts: Map<string, number> = new Map();

  constructor(config: ErrorHandlingConfig = {}, context: ErrorContext = {}) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      enableLogging: true,
      enableReporting: true,
      userNotification: true,
      ...config
    };
    this.context = context;
  }

  /**
   * Handle an error with appropriate strategy
   */
  async handleError(
    error: Error,
    strategy: ErrorStrategy = ErrorStrategy.RETRY,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): Promise<{ handled: boolean; result?: any; shouldRetry?: boolean }> {
    const errorKey = this.getErrorKey(error);
    const currentCount = this.errorCounts.get(errorKey) || 0;

    // Log error if enabled
    if (this.config.enableLogging) {
      this.logError(error, severity, currentCount);
    }

    // Report error if enabled
    if (this.config.enableReporting) {
      await this.reportError(error, severity);
    }

    // Increment error count
    this.errorCounts.set(errorKey, currentCount + 1);

    // Apply handling strategy
    switch (strategy) {
      case ErrorStrategy.RETRY:
        return this.handleRetryStrategy(error, currentCount);

      case ErrorStrategy.FALLBACK:
        return this.handleFallbackStrategy(error);

      case ErrorStrategy.IGNORE:
        return this.handleIgnoreStrategy(error);

      case ErrorStrategy.ESCALATE:
        return this.handleEscalateStrategy(error, severity);

      case ErrorStrategy.USER_ACTION:
        return this.handleUserActionStrategy(error);

      default:
        return { handled: false };
    }
  }

  /**
   * Retry strategy implementation
   */
  private async handleRetryStrategy(
    error: Error,
    currentCount: number
  ): Promise<{ handled: boolean; shouldRetry?: boolean }> {
    const maxRetries = this.config.maxRetries || 3;

    if (currentCount < maxRetries) {
      console.log(`🔄 Retrying operation (attempt ${currentCount + 1}/${maxRetries})`);
      
      // Wait before retry
      if (this.config.retryDelay) {
        await this.delay(this.config.retryDelay * Math.pow(2, currentCount)); // Exponential backoff
      }

      return { handled: true, shouldRetry: true };
    } else {
      console.error(`❌ Max retries (${maxRetries}) exceeded for error:`, error);
      return { handled: false, shouldRetry: false };
    }
  }

  /**
   * Fallback strategy implementation
   */
  private handleFallbackStrategy(error: Error): { handled: boolean; result?: any } {
    console.log('🔄 Using fallback strategy for error:', error.message);
    
    const fallbackKey = error.constructor.name.toLowerCase();
    const fallbackValue = this.config.fallbackValues?.[fallbackKey];

    return {
      handled: true,
      result: fallbackValue || this.getDefaultFallback(error)
    };
  }

  /**
   * Ignore strategy implementation
   */
  private handleIgnoreStrategy(error: Error): { handled: boolean } {
    console.warn('⚠️ Ignoring error as per strategy:', error.message);
    return { handled: true };
  }

  /**
   * Escalate strategy implementation
   */
  private async handleEscalateStrategy(
    error: Error,
    severity: ErrorSeverity
  ): Promise<{ handled: boolean }> {
    console.error('🚨 Escalating error:', error);
    
    // TODO: Implement escalation logic (e.g., notify administrators, create tickets)
    await this.escalateError(error, severity);
    
    return { handled: true };
  }

  /**
   * User action strategy implementation
   */
  private handleUserActionStrategy(error: Error): { handled: boolean } {
    console.log('👤 Requiring user action for error:', error.message);
    
    if (this.config.userNotification) {
      // TODO: Show user notification/modal
      this.notifyUser(error);
    }
    
    return { handled: true };
  }

  /**
   * Safe async operation wrapper with error handling
   */
  async safeAsync<T>(
    operation: () => Promise<T>,
    fallbackValue?: T,
    strategy: ErrorStrategy = ErrorStrategy.RETRY
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const result = await this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        strategy
      );

      if (result.handled && result.result !== undefined) {
        return result.result;
      }

      if (result.shouldRetry) {
        return this.safeAsync(operation, fallbackValue, strategy);
      }

      if (fallbackValue !== undefined) {
        return fallbackValue;
      }

      throw error;
    }
  }

  /**
   * Safe sync operation wrapper with error handling
   */
  safeSync<T>(
    operation: () => T,
    fallbackValue?: T,
    strategy: ErrorStrategy = ErrorStrategy.FALLBACK
  ): T {
    try {
      return operation();
    } catch (error) {
      console.error('Sync operation failed:', error);
      
      if (strategy === ErrorStrategy.FALLBACK && fallbackValue !== undefined) {
        return fallbackValue;
      }

      throw error;
    }
  }

  /**
   * Validate input with comprehensive error handling
   */
  validate<T>(
    value: T,
    validators: Array<(value: T) => boolean | string>,
    fieldName?: string
  ): T {
    for (const validator of validators) {
      const result = validator(value);
      if (result !== true) {
        const message = typeof result === 'string' ? result : `Validation failed for ${fieldName || 'value'}`;
        throw new ValidationError(message, fieldName, value);
      }
    }
    return value;
  }

  /**
   * Create error-safe getter for object properties
   */
  safeGet<T>(
    obj: any,
    path: string,
    defaultValue?: T
  ): T | undefined {
    try {
      const keys = path.split('.');
      let current = obj;
      
      for (const key of keys) {
        if (current === null || current === undefined) {
          return defaultValue;
        }
        current = current[key];
      }
      
      return current !== undefined ? current : defaultValue;
    } catch (error) {
      console.warn(`Safe get failed for path "${path}":`, error);
      return defaultValue;
    }
  }

  /**
   * Reset error counts (useful for testing or manual reset)
   */
  resetErrorCounts(): void {
    this.errorCounts.clear();
    console.log('🔄 Error counts reset');
  }

  /**
   * Get error statistics
   */
  getErrorStats(): Record<string, number> {
    return Object.fromEntries(this.errorCounts);
  }

  // Private helper methods

  private getErrorKey(error: Error): string {
    return `${error.constructor.name}:${error.message}`;
  }

  private logError(error: Error, severity: ErrorSeverity, count: number): void {
    const logLevel = severity === ErrorSeverity.CRITICAL ? 'error' : 
                    severity === ErrorSeverity.HIGH ? 'error' : 
                    severity === ErrorSeverity.MEDIUM ? 'warn' : 'log';

    console[logLevel](`[${severity.toUpperCase()}] Error (count: ${count + 1}):`, {
      error: error instanceof PluginError ? error.toJSON() : error,
      context: this.context,
      timestamp: new Date().toISOString()
    });
  }

  private async reportError(error: Error, severity: ErrorSeverity): Promise<void> {
    try {
      // TODO: Implement actual error reporting service integration
      const errorReport = {
        error: error instanceof PluginError ? error.toJSON() : {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        severity,
        context: this.context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      console.log('📊 Error Report (TODO: Send to service):', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  private getDefaultFallback(error: Error): any {
    if (error instanceof ValidationError) {
      return null;
    }
    if (error instanceof NetworkError) {
      return { error: 'Network unavailable', offline: true };
    }
    return { error: 'Operation failed', fallback: true };
  }

  private async escalateError(error: Error, severity: ErrorSeverity): Promise<void> {
    // TODO: Implement escalation logic
    console.error('🚨 ESCALATED ERROR:', { error, severity, context: this.context });
  }

  private notifyUser(error: Error): void {
    // TODO: Implement user notification system
    console.log('👤 User notification needed for:', error.message);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Global error handler instance for the plugin
 * TODO: Initialize with your plugin-specific context
 */
export const globalErrorHandler = new ErrorHandler(
  {
    maxRetries: 3,
    retryDelay: 1000,
    enableLogging: true,
    enableReporting: true,
    userNotification: true
  },
  {
    pluginId: 'PluginTemplate', // TODO: Update with your plugin ID
    component: 'global'
  }
);

/**
 * Utility functions for common error handling patterns
 */
export const ErrorUtils = {
  /**
   * Check if error is recoverable
   */
  isRecoverable(error: Error): boolean {
    if (error instanceof PluginError) {
      return error.recoverable;
    }
    // Network errors are typically recoverable
    if (error instanceof NetworkError) {
      return true;
    }
    // Validation errors are typically not recoverable
    if (error instanceof ValidationError) {
      return false;
    }
    // Default to recoverable for unknown errors
    return true;
  },

  /**
   * Get user-friendly error message
   */
  getUserMessage(error: Error): string {
    if (error instanceof ValidationError) {
      return `Please check your input: ${error.message}`;
    }
    if (error instanceof NetworkError) {
      return 'Network connection issue. Please try again.';
    }
    if (error instanceof ServiceError) {
      return `Service temporarily unavailable: ${error.service}`;
    }
    return 'An unexpected error occurred. Please try again.';
  },

  /**
   * Create error from unknown value
   */
  normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    if (typeof error === 'string') {
      return new Error(error);
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return new Error(String(error.message));
    }
    return new Error('Unknown error occurred');
  }
};

/**
 * Decorator for automatic error handling in class methods
 */
export function handleErrors(
  strategy: ErrorStrategy = ErrorStrategy.RETRY,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        const errorHandler = new ErrorHandler({}, {
          component: target.constructor.name,
          action: propertyKey
        });

        const result = await errorHandler.handleError(
          error instanceof Error ? error : new Error(String(error)),
          strategy,
          severity
        );

        if (result.handled && result.result !== undefined) {
          return result.result;
        }

        throw error;
      }
    };

    return descriptor;
  };
}