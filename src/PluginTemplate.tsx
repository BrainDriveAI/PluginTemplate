import React from 'react';
import './PluginTemplate.css';
import {
  PluginTemplateProps,
  PluginTemplateState,
  PluginData,
  Services
} from './types';
import {
  generateId,
  debounce,
  formatRelativeTime
} from './utils';

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
  private refreshInterval: ReturnType<typeof setInterval> | null = null;
  private debouncedRefresh: () => void;

  constructor(props: PluginTemplateProps) {
    super(props);
    
    // TEMPLATE: Initialize your plugin's state
    this.state = {
      isLoading: false,
      error: '',
      currentTheme: 'light',
      isInitializing: true,
      data: null // TODO: Replace with your plugin's data structure
    };

    // Create debounced refresh function
    this.debouncedRefresh = debounce(this.refreshData.bind(this), 1000);
  }

  async componentDidMount() {
    try {
      await this.initializeServices();
      await this.loadInitialData();
      this.setState({ isInitializing: false });
    } catch (error) {
      console.error('PluginTemplate: Failed to initialize:', error);
      this.setState({ 
        error: 'Failed to initialize plugin',
        isInitializing: false 
      });
    }
  }

  componentWillUnmount() {
    this.cleanupServices();
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  /**
   * Initialize BrainDrive services
   */
  private async initializeServices(): Promise<void> {
    const { services } = this.props;

    // Initialize theme service
    if (services.theme) {
      const currentTheme = services.theme.getCurrentTheme();
      this.setState({ currentTheme });

      // Listen for theme changes
      this.themeChangeListener = (theme: string) => {
        this.setState({ currentTheme: theme });
      };
      services.theme.addThemeChangeListener(this.themeChangeListener);
    }

    // Initialize page context service
    if (services.pageContext) {
      this.pageContextUnsubscribe = services.pageContext.onPageContextChange((context) => {
        console.log('PluginTemplate: Page context changed:', context);
        // TODO: Handle page context changes if needed
      });
    }

    // TODO: Initialize other services as needed
    // Example: Load settings
    if (services.settings) {
      try {
        const savedConfig = await services.settings.getSetting?.('plugin_template_config');
        if (savedConfig) {
          // TODO: Apply saved configuration
          console.log('PluginTemplate: Loaded saved config:', savedConfig);
        }
      } catch (error) {
        console.warn('PluginTemplate: Failed to load settings:', error);
      }
    }
  }

  /**
   * Clean up services and listeners
   */
  private cleanupServices(): void {
    const { services } = this.props;

    if (services.theme && this.themeChangeListener) {
      services.theme.removeThemeChangeListener(this.themeChangeListener);
    }

    if (this.pageContextUnsubscribe) {
      this.pageContextUnsubscribe();
    }
  }

  /**
   * Load initial data for the plugin
   */
  private async loadInitialData(): Promise<void> {
    this.setState({ isLoading: true, error: '' });

    try {
      // TODO: Replace this with your actual data loading logic
      const data = await this.fetchPluginData();
      this.setState({ data, isLoading: false });

      // Set up auto-refresh if configured
      const refreshInterval = this.props.config?.refreshInterval || 60000; // Default 1 minute
      this.refreshInterval = setInterval(() => {
        this.debouncedRefresh();
      }, refreshInterval);

    } catch (error) {
      console.error('PluginTemplate: Failed to load data:', error);
      this.setState({ 
        error: 'Failed to load data',
        isLoading: false 
      });
    }
  }

  /**
   * Fetch plugin data - TODO: Replace with your actual data fetching logic
   */
  private async fetchPluginData(): Promise<PluginData> {
    const { services } = this.props;

    // TEMPLATE: Example API call - replace with your actual API endpoints
    if (services.api) {
      try {
        const response = await services.api.get('/api/plugin-template/data');
        return response.data;
      } catch (error) {
        console.warn('PluginTemplate: API call failed, using mock data');
      }
    }

    // Mock data for development
    return {
      id: generateId(),
      name: 'Sample Data',
      value: Math.floor(Math.random() * 100),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Refresh plugin data
   */
  private async refreshData(): Promise<void> {
    if (this.state.isLoading) return;

    try {
      const data = await this.fetchPluginData();
      this.setState({ data, error: '' });
    } catch (error) {
      console.error('PluginTemplate: Failed to refresh data:', error);
      this.setState({ error: 'Failed to refresh data' });
    }
  }

  /**
   * Handle user interactions - TODO: Customize for your plugin
   */
  private handleRefreshClick = (): void => {
    this.refreshData();
  };

  private handleSettingsChange = async (key: string, value: any): Promise<void> => {
    const { services } = this.props;
    
    if (services.settings) {
      try {
        await services.settings.setSetting?.(key, value);
        console.log(`PluginTemplate: Setting ${key} updated to:`, value);
      } catch (error) {
        console.error('PluginTemplate: Failed to save setting:', error);
      }
    }
  };

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
   * Render error state
   */
  private renderError(): JSX.Element {
    return (
      <div className="plugin-template-error">
        <div className="error-icon">⚠️</div>
        <p>{this.state.error}</p>
        <button onClick={this.handleRefreshClick} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  /**
   * Render main plugin content
   */
  private renderContent(): JSX.Element {
    const { data } = this.state;
    const { title = "Plugin Template", description = "A template for BrainDrive plugins" } = this.props;

    return (
      <div className="plugin-template-content">
        <div className="plugin-header">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        {/* TODO: Replace this with your actual plugin content */}
        <div className="plugin-body">
          {data ? (
            <div className="data-display">
              <div className="data-item">
                <label>Name:</label>
                <span>{data.name}</span>
              </div>
              <div className="data-item">
                <label>Value:</label>
                <span>{data.value}</span>
              </div>
              <div className="data-item">
                <label>Last Updated:</label>
                <span>{formatRelativeTime(data.timestamp)}</span>
              </div>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>

        <div className="plugin-actions">
          <button 
            onClick={this.handleRefreshClick}
            disabled={this.state.isLoading}
            className="refresh-button"
          >
            {this.state.isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
    );
  }

  render(): JSX.Element {
    const { currentTheme, isInitializing, error } = this.state;

    return (
      <div className={`plugin-template plugin-template--${currentTheme}`}>
        {isInitializing ? (
          this.renderLoading()
        ) : error ? (
          this.renderError()
        ) : (
          this.renderContent()
        )}
      </div>
    );
  }
}

export default PluginTemplate;