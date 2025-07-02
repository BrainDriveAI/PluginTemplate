import React from 'react';
import './PluginTemplate.css';
import {
  PluginTemplateProps,
  PluginTemplateState,
  PluginData,
  Services
} from './types';

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
   * Render error state
   */
  private renderError(): JSX.Element {
    return (
      <div className="plugin-template-error">
        <div className="error-icon">⚠️</div>
        <p>{this.state.error}</p>
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
      <div className={`plugin-template ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
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