import React from 'react';
import './PluginTemplate.css';
import {
  PluginTemplateProps,
  PluginTemplateState,
  PluginData,
  Services
} from './types';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorDisplay, { ErrorInfo } from './components/ErrorDisplay';
import {
  ErrorHandler,
  PluginError,
  ServiceError,
  ValidationError,
  ErrorStrategy,
  ErrorSeverity,
  ErrorUtils
} from './utils/errorHandling';

// TEMPLATE: Import your components here
// import { YourComponent } from './components';

/**
 * TEMPLATE: Main Plugin Component
 * 
 * This is the main component for your BrainDrive plugin.
 * TODO: Customize this component for your specific plugin functionality.
 * 
 * Key patterns to follow:
 * 1. Use class-based components for compatibility
 * 2. Initialize services in componentDidMount
 * 3. Clean up listeners in componentWillUnmount
 * 4. Handle theme changes automatically
 * 5. Provide error boundaries and loading states
 */
class PluginTemplate extends React.Component<PluginTemplateProps, PluginTemplateState> {
  private themeChangeListener: ((theme: string) => void) | null = null;
  private pageContextUnsubscribe: (() => void) | null = null;
  private errorHandler: ErrorHandler;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor(props: PluginTemplateProps) {
    super(props);
    
    // Initialize error handler with plugin context
    this.errorHandler = new ErrorHandler(
      {
        maxRetries: this.maxRetries,
        retryDelay: 1000,
        enableLogging: true,
        enableReporting: true,
        userNotification: true,
        fallbackValues: {
          plugindata: null,
          theme: 'light',
          settings: {}
        }
      },
      {
        component: 'PluginTemplate',
        pluginId: props.pluginId || 'PluginTemplate',
        moduleId: props.moduleId || 'main'
      }
    );
    
    // TEMPLATE: Initialize your plugin's state with enhanced error handling
    this.state = {
      isLoading: false,
      error: '',
      currentTheme: 'light',
      isInitializing: true,
      data: null, // TODO: Replace with your plugin's data structure
      lastError: null,
      retryAvailable: false
    };

    // Bind error handling methods
    this.handleRetry = this.handleRetry.bind(this);
    this.handleDismissError = this.handleDismissError.bind(this);
  }

  async componentDidMount() {
    await this.errorHandler.safeAsync(
      async () => {
        await this.initializeServices();
        await this.loadInitialData();
        this.setState({
          isInitializing: false,
          error: '',
          lastError: null,
          retryAvailable: false
        });
      },
      undefined,
      ErrorStrategy.RETRY
    ).catch((error) => {
      this.handleComponentError(error, 'componentDidMount');
    });
  }

  componentWillUnmount() {
    this.cleanupServices();
  }

  /**
   * Handle component-level errors with comprehensive error management
   */
  private handleComponentError = (error: unknown, context: string) => {
    const normalizedError = ErrorUtils.normalizeError(error);
    const pluginError = new PluginError(
      `Component error in ${context}: ${normalizedError.message}`,
      'COMPONENT_ERROR',
      { context, originalError: normalizedError },
      true
    );

    console.error(`PluginTemplate: ${context} error:`, pluginError);

    this.setState({
      error: ErrorUtils.getUserMessage(pluginError),
      isInitializing: false,
      isLoading: false,
      lastError: pluginError,
      retryAvailable: this.retryCount < this.maxRetries
    });
  };

  /**
   * Handle retry action from user
   */
  private handleRetry = async () => {
    if (this.retryCount >= this.maxRetries) {
      console.warn('PluginTemplate: Max retries exceeded');
      this.setState({ retryAvailable: false });
      return;
    }

    this.retryCount++;
    console.log(`PluginTemplate: Retry attempt ${this.retryCount}/${this.maxRetries}`);

    this.setState({
      isLoading: true,
      error: '',
      lastError: null
    });

    // Retry the initialization process
    await this.componentDidMount();
  };

  /**
   * Handle error dismissal
   */
  private handleDismissError = () => {
    this.setState({
      error: '',
      lastError: null,
      retryAvailable: false
    });
  };

  /**
   * Initialize BrainDrive services with comprehensive error handling
   */
  private async initializeServices(): Promise<void> {
    const { services } = this.props;

    // Initialize theme service with error handling
    await this.errorHandler.safeAsync(async () => {
      if (services.theme) {
        const currentTheme = this.errorHandler.safeSync(
          () => services.theme!.getCurrentTheme(),
          'light'
        );
        this.setState({ currentTheme });

        // Listen for theme changes with error handling
        this.themeChangeListener = (theme: string) => {
          this.errorHandler.safeSync(() => {
            this.setState({ currentTheme: theme });
          });
        };
        
        services.theme.addThemeChangeListener(this.themeChangeListener);
        console.log('PluginTemplate: Theme service initialized successfully');
      } else {
        console.warn('PluginTemplate: Theme service not available');
      }
    }, undefined, ErrorStrategy.FALLBACK).catch(error => {
      throw new ServiceError(
        'Failed to initialize theme service',
        'theme',
        'THEME_INIT_ERROR',
        error
      );
    });

    // Initialize page context service with error handling
    await this.errorHandler.safeAsync(async () => {
      if (services.pageContext) {
        this.pageContextUnsubscribe = services.pageContext.onPageContextChange((context) => {
          this.errorHandler.safeSync(() => {
            console.log('PluginTemplate: Page context changed:', context);
            // TODO: Handle page context changes if needed
          });
        });
        console.log('PluginTemplate: Page context service initialized successfully');
      } else {
        console.warn('PluginTemplate: Page context service not available');
      }
    }, undefined, ErrorStrategy.FALLBACK).catch(error => {
      throw new ServiceError(
        'Failed to initialize page context service',
        'pageContext',
        'PAGE_CONTEXT_INIT_ERROR',
        error
      );
    });

    // Initialize settings service with comprehensive error handling
    await this.errorHandler.safeAsync(async () => {
      if (services.settings) {
        try {
          const savedConfig = await services.settings.getSetting?.('plugin_template_config');
          if (savedConfig) {
            // Validate configuration before applying
            const validatedConfig = this.errorHandler.validate(
              savedConfig,
              [
                (config) => typeof config === 'object' || 'Configuration must be an object',
                (config) => config !== null || 'Configuration cannot be null'
              ],
              'plugin_template_config'
            );
            
            // TODO: Apply saved configuration
            console.log('PluginTemplate: Loaded and validated saved config:', validatedConfig);
          }
          console.log('PluginTemplate: Settings service initialized successfully');
        } catch (error) {
          if (error instanceof ValidationError) {
            console.error('PluginTemplate: Invalid configuration:', error);
            // Use default configuration
          } else {
            throw new ServiceError(
              'Failed to load settings',
              'settings',
              'SETTINGS_LOAD_ERROR',
              error
            );
          }
        }
      } else {
        console.warn('PluginTemplate: Settings service not available');
      }
    }, undefined, ErrorStrategy.FALLBACK);

    // TODO: Initialize other services as needed with similar error handling patterns
    console.log('PluginTemplate: All services initialized');
  }

  /**
   * Clean up services and listeners with error handling
   */
  private cleanupServices(): void {
    const { services } = this.props;

    // Clean up theme service listener
    this.errorHandler.safeSync(() => {
      if (services.theme && this.themeChangeListener) {
        services.theme.removeThemeChangeListener(this.themeChangeListener);
        this.themeChangeListener = null;
        console.log('PluginTemplate: Theme service cleaned up');
      }
    });

    // Clean up page context subscription
    this.errorHandler.safeSync(() => {
      if (this.pageContextUnsubscribe) {
        this.pageContextUnsubscribe();
        this.pageContextUnsubscribe = null;
        console.log('PluginTemplate: Page context service cleaned up');
      }
    });

    // Reset error handler state
    this.errorHandler.resetErrorCounts();
    console.log('PluginTemplate: All services cleaned up successfully');
  }

  /**
   * Load initial data for the plugin
   */
  private async loadInitialData(): Promise<void> {
    // TODO: Add your plugin's data loading logic here
    this.setState({ isLoading: false, error: '' });
  }


  /**
   * Render loading state
   */
  private renderLoading(): JSX.Element {
    return (
      <div className="plugin-template-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  /**
   * Render error state with enhanced error display
   */
  private renderError(): JSX.Element {
    const { error, lastError, retryAvailable } = this.state;
    
    // Create comprehensive error info
    const errorInfo: ErrorInfo = lastError ? {
      message: error || lastError.message,
      code: lastError instanceof PluginError ? lastError.code : 'UNKNOWN_ERROR',
      details: lastError instanceof PluginError ? lastError.details : undefined,
      timestamp: lastError instanceof PluginError ? lastError.timestamp : new Date().toISOString(),
      stack: lastError.stack
    } : {
      message: error || 'An unknown error occurred',
      timestamp: new Date().toISOString()
    };

    return (
      <div className="plugin-template-error">
        <ErrorDisplay
          error={errorInfo}
          onRetry={retryAvailable ? this.handleRetry : undefined}
          onDismiss={this.handleDismissError}
          showDetails={true}
          variant="error"
        />
        
        {/* Additional error context for developers */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#6c757d'
          }}>
            <strong>🔧 Debug Info:</strong>
            <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
              <li>Retry Count: {this.retryCount}/{this.maxRetries}</li>
              <li>Error Handler Stats: {JSON.stringify(this.errorHandler.getErrorStats())}</li>
              <li>Component State: {JSON.stringify({
                isLoading: this.state.isLoading,
                isInitializing: this.state.isInitializing
              })}</li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  /**
   * Render main plugin content
   */
  private renderContent(): JSX.Element {
    const { title = "Plugin Template", description = "A template for BrainDrive plugins", services, moduleId, config, pluginId, instanceId } = this.props;

    // Get page context information
    const pageContext = services.pageContext?.getCurrentPageContext();

    return (
      <div className="plugin-template-content">
        <div className="plugin-header">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        {/* Plugin Information */}
        <div className="plugin-info">
          <h4>Plugin Information</h4>
          <div className="info-grid">
            <div className="info-item">
              <strong>Plugin ID:</strong> {pluginId || 'Not provided'}
            </div>
            <div className="info-item">
              <strong>Module ID:</strong> {moduleId || 'Not provided'}
            </div>
            <div className="info-item">
              <strong>Instance ID:</strong> {instanceId || 'Not provided'}
            </div>
            <div className="info-item">
              <strong>Current Theme:</strong> {this.state.currentTheme}
            </div>
            <div className="info-item">
              <strong>Configuration:</strong>
              <ul>
                <li>Refresh Interval: {config?.refreshInterval || 'Not set'}</li>
                <li>Show Advanced Options: {config?.showAdvancedOptions ? 'Yes' : 'No'}</li>
                <li>Custom Setting: {config?.customSetting || 'Not set'}</li>
              </ul>
            </div>
            <div className="info-item">
              <strong>Page Context:</strong>
              <ul>
                <li>Page ID: {pageContext?.pageId || 'Not available'}</li>
                <li>Page Name: {pageContext?.pageName || 'Not available'}</li>
                <li>Page Route: {pageContext?.pageRoute || 'Not available'}</li>
                <li>Is Studio Page: {pageContext?.isStudioPage ? 'Yes' : 'No'}</li>
              </ul>
            </div>
            <div className="info-item">
              <strong>Services Available:</strong>
              <ul>
                <li>API: {services.api ? '✅' : '❌'}</li>
                <li>Event: {services.event ? '✅' : '❌'}</li>
                <li>Theme: {services.theme ? '✅' : '❌'}</li>
                <li>Settings: {services.settings ? '✅' : '❌'}</li>
                <li>Page Context: {services.pageContext ? '✅' : '❌'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render(): JSX.Element {
    const { currentTheme, isInitializing, error } = this.state;

    return (
      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.error('PluginTemplate: React Error Boundary caught error:', error, errorInfo);
          // Additional error reporting can be added here
        }}
        resetOnPropsChange={true}
        resetKeys={[this.props.pluginId || 'unknown', this.props.moduleId || 'unknown']}
      >
        <div className={`plugin-template ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
          {isInitializing ? (
            this.renderLoading()
          ) : error ? (
            this.renderError()
          ) : (
            this.errorHandler.safeSync(
              () => this.renderContent(),
              <ErrorDisplay
                error="Failed to render plugin content"
                onRetry={this.handleRetry}
                variant="error"
              />
            )
          )}
        </div>
      </ErrorBoundary>
    );
  }
}

export default PluginTemplate;