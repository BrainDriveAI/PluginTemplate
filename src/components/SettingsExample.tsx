import React from 'react';
import { Services } from '../types';
import './SettingsExample.css';

interface SettingsExampleProps {
  services: Services;
}

interface SettingsExampleState {
  settings: {
    apiEndpoint: string;
    enableNotifications: boolean;
    refreshInterval: number;
    maxItems: number;
    theme: 'auto' | 'light' | 'dark';
  };
  loading: boolean;
  error: string | null;
  saveMessage: string | null;
}

/**
 * SettingsExample Component
 * 
 * This component demonstrates how to create a settings module for BrainDrive.
 * Settings modules are special components that:
 * 1. Have a "settings" tag in their module configuration
 * 2. Use a second tag as the setting identifier
 * 3. Are automatically rendered in the Settings page
 * 4. Can save/load configuration using the settings service
 * 
 * Key Features:
 * - Integrates with BrainDrive's settings service
 * - Provides a clean, accessible interface
 * - Handles loading, error, and success states
 * - Follows BrainDrive's theming patterns
 */
export class SettingsExample extends React.Component<SettingsExampleProps, SettingsExampleState> {
  constructor(props: SettingsExampleProps) {
    super(props);
    
    this.state = {
      settings: {
        apiEndpoint: 'https://api.example.com',
        enableNotifications: true,
        refreshInterval: 30,
        maxItems: 50,
        theme: 'auto'
      },
      loading: false,
      error: null,
      saveMessage: null
    };
  }

  async componentDidMount() {
    await this.loadSettings();
  }

  /**
   * Load settings from BrainDrive's settings service
   */
  loadSettings = async () => {
    try {
      this.setState({ loading: true, error: null });
      
      if (!this.props.services.settings) {
        console.warn('Settings service not available');
        this.setState({ loading: false });
        return;
      }

      // Load each setting individually using the correct API
      const apiEndpoint = this.props.services.settings.getSetting
        ? await this.props.services.settings.getSetting('plugin_template_api_endpoint') || this.state.settings.apiEndpoint
        : this.props.services.settings.get('plugin_template_api_endpoint') || this.state.settings.apiEndpoint;
        
      const enableNotifications = this.props.services.settings.getSetting
        ? await this.props.services.settings.getSetting('plugin_template_notifications') || this.state.settings.enableNotifications
        : this.props.services.settings.get('plugin_template_notifications') || this.state.settings.enableNotifications;
        
      const refreshInterval = this.props.services.settings.getSetting
        ? await this.props.services.settings.getSetting('plugin_template_refresh_interval') || this.state.settings.refreshInterval
        : this.props.services.settings.get('plugin_template_refresh_interval') || this.state.settings.refreshInterval;
        
      const maxItems = this.props.services.settings.getSetting
        ? await this.props.services.settings.getSetting('plugin_template_max_items') || this.state.settings.maxItems
        : this.props.services.settings.get('plugin_template_max_items') || this.state.settings.maxItems;
        
      const theme = this.props.services.settings.getSetting
        ? await this.props.services.settings.getSetting('plugin_template_theme') || this.state.settings.theme
        : this.props.services.settings.get('plugin_template_theme') || this.state.settings.theme;

      this.setState({
        settings: {
          apiEndpoint,
          enableNotifications,
          refreshInterval,
          maxItems,
          theme
        },
        loading: false
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.setState({
        error: 'Failed to load settings. Please try again.',
        loading: false
      });
    }
  };

  /**
   * Save settings to BrainDrive's settings service
   */
  saveSettings = async () => {
    try {
      this.setState({ loading: true, error: null, saveMessage: null });

      if (!this.props.services.settings) {
        this.setState({
          error: 'Settings service not available',
          loading: false
        });
        return;
      }

      // Save each setting individually using the correct API
      if (this.props.services.settings.setSetting) {
        await this.props.services.settings.setSetting('plugin_template_api_endpoint', this.state.settings.apiEndpoint);
        await this.props.services.settings.setSetting('plugin_template_notifications', this.state.settings.enableNotifications);
        await this.props.services.settings.setSetting('plugin_template_refresh_interval', this.state.settings.refreshInterval);
        await this.props.services.settings.setSetting('plugin_template_max_items', this.state.settings.maxItems);
        await this.props.services.settings.setSetting('plugin_template_theme', this.state.settings.theme);
      } else {
        await this.props.services.settings.set('plugin_template_api_endpoint', this.state.settings.apiEndpoint);
        await this.props.services.settings.set('plugin_template_notifications', this.state.settings.enableNotifications);
        await this.props.services.settings.set('plugin_template_refresh_interval', this.state.settings.refreshInterval);
        await this.props.services.settings.set('plugin_template_max_items', this.state.settings.maxItems);
        await this.props.services.settings.set('plugin_template_theme', this.state.settings.theme);
      }

      this.setState({
        loading: false,
        saveMessage: 'Settings saved successfully!'
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.setState({ saveMessage: null });
      }, 3000);

    } catch (error) {
      console.error('Failed to save settings:', error);
      this.setState({
        error: 'Failed to save settings. Please try again.',
        loading: false
      });
    }
  };

  /**
   * Reset settings to default values
   */
  resetSettings = () => {
    this.setState({
      settings: {
        apiEndpoint: 'https://api.example.com',
        enableNotifications: true,
        refreshInterval: 30,
        maxItems: 50,
        theme: 'auto'
      },
      error: null,
      saveMessage: null
    });
  };

  /**
   * Handle input changes for various setting types
   */
  handleInputChange = (key: keyof SettingsExampleState['settings'], value: any) => {
    this.setState(prevState => ({
      settings: {
        ...prevState.settings,
        [key]: value
      },
      error: null,
      saveMessage: null
    }));
  };

  render() {
    const { settings, loading, error, saveMessage } = this.state;

    if (loading && !settings.apiEndpoint) {
      return (
        <div className="settings-example-loading">
          <p>Loading settings...</p>
        </div>
      );
    }

    return (
      <div className="settings-example">
        <div className="settings-example-header">
          <h3>Plugin Template Settings</h3>
          <p className="settings-description">
            Configure the behavior and appearance of the Plugin Template.
          </p>
        </div>

        {error && (
          <div className="settings-alert settings-alert-error">
            {error}
          </div>
        )}

        {saveMessage && (
          <div className="settings-alert settings-alert-success">
            {saveMessage}
          </div>
        )}

        <div className="settings-section">
          <div className="settings-group">
            <h4>API Configuration</h4>
            
            <div className="settings-field">
              <label htmlFor="apiEndpoint">API Endpoint</label>
              <input
                id="apiEndpoint"
                type="text"
                value={settings.apiEndpoint}
                onChange={(e) => this.handleInputChange('apiEndpoint', e.target.value)}
                placeholder="Enter API endpoint URL"
                disabled={loading}
              />
              <small>The base URL for API requests</small>
            </div>
          </div>

          <div className="settings-group">
            <h4>Notifications</h4>
            
            <div className="settings-field">
              <label className="settings-checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => this.handleInputChange('enableNotifications', e.target.checked)}
                  disabled={loading}
                />
                Enable Notifications
              </label>
              <small>Receive notifications for important events</small>
            </div>

            <div className="settings-field">
              <label htmlFor="refreshInterval">Refresh Interval (seconds)</label>
              <input
                id="refreshInterval"
                type="range"
                min="10"
                max="300"
                step="10"
                value={settings.refreshInterval}
                onChange={(e) => this.handleInputChange('refreshInterval', parseInt(e.target.value))}
                disabled={loading}
              />
              <div className="range-value">{settings.refreshInterval} seconds</div>
              <small>How often to refresh data automatically</small>
            </div>

            <div className="settings-field">
              <label htmlFor="maxItems">Maximum Items</label>
              <input
                id="maxItems"
                type="range"
                min="10"
                max="200"
                step="10"
                value={settings.maxItems}
                onChange={(e) => this.handleInputChange('maxItems', parseInt(e.target.value))}
                disabled={loading}
              />
              <div className="range-value">{settings.maxItems} items</div>
              <small>Maximum number of items to display</small>
            </div>
          </div>

          <div className="settings-group">
            <h4>Appearance</h4>
            
            <div className="settings-field">
              <label htmlFor="theme">Theme Preference</label>
              <select
                id="theme"
                value={settings.theme}
                onChange={(e) => this.handleInputChange('theme', e.target.value as 'auto' | 'light' | 'dark')}
                disabled={loading}
              >
                <option value="auto">Auto (Follow System)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <small>Choose your preferred theme</small>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button
            type="button"
            onClick={this.resetSettings}
            disabled={loading}
            className="settings-button settings-button-secondary"
          >
            Reset to Defaults
          </button>
          
          <button
            type="button"
            onClick={this.saveSettings}
            disabled={loading}
            className="settings-button settings-button-primary"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </div>
    );
  }
}

export default SettingsExample;