import React from 'react';
import { Services } from '../types';
import './SettingsExample.css';

interface SettingsExampleProps {
  pluginId?: string;
  moduleId?: string;
  instanceId?: string;
  services?: Services;
}

interface SettingsExampleState {
  currentTheme: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * SettingsExample Component
 * 
 * This is a simple template for creating settings plugins in BrainDrive.
 * It demonstrates:
 * - Basic settings plugin structure
 * - Theme awareness and switching
 * - Access to the settings service
 * - Clean, minimal UI following BrainDrive patterns
 * 
 * Use this as a starting point for your own settings plugins.
 */
export class SettingsExample extends React.Component<SettingsExampleProps, SettingsExampleState> {
  private themeChangeListener: ((theme: string) => void) | null = null;

  constructor(props: SettingsExampleProps) {
    super(props);
    
    this.state = {
      currentTheme: 'light',
      isLoading: false,
      error: null
    };
  }

  async componentDidMount() {
    console.log('SettingsExample componentDidMount - initializing...');
    console.log('SettingsExample props received:', {
      pluginId: this.props.pluginId,
      moduleId: this.props.moduleId,
      instanceId: this.props.instanceId,
      hasServices: !!this.props.services,
      hasThemeService: this.props.services?.theme ? 'YES' : 'NO',
      hasSettingsService: this.props.services?.settings ? 'YES' : 'NO',
      hasApiService: this.props.services?.api ? 'YES' : 'NO'
    });
    
    this.initializeTheme();
  }

  componentWillUnmount() {
    // Clean up theme listener
    if (this.props.services?.theme && this.themeChangeListener) {
      this.props.services.theme.removeThemeChangeListener(this.themeChangeListener);
    }
  }

  /**
   * Initialize theme service - following ComponentTheme pattern exactly
   */
  initializeTheme() {
    if (this.props.services?.theme) {
      try {
        console.log('Initializing theme service...');
        const theme = this.props.services.theme.getCurrentTheme();
        console.log('Current theme retrieved:', theme);
        this.setState({ currentTheme: theme });
        
        // Subscribe to theme changes
        this.themeChangeListener = (newTheme: string) => {
          console.log('Theme changed to:', newTheme);
          this.setState({ currentTheme: newTheme });
        };
        
        console.log('Adding theme change listener...');
        this.props.services.theme.addThemeChangeListener(this.themeChangeListener);
        console.log('Theme service initialized successfully');
      } catch (error) {
        console.error('Error initializing theme service:', error);
        this.setState({ error: 'Failed to initialize theme service' });
      }
    } else {
      console.warn('Theme service not available');
      this.setState({ error: 'Theme service not available' });
    }
  }



  render() {
    const { currentTheme, isLoading, error } = this.state;

    return (
      <div className={`settings-example-container ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
        
        {/* Error message */}
        {error && (
          <div className="error-message">
            <strong>Error: </strong>{error}
          </div>
        )}

        {/* Main content */}
        <div className="settings-content">
          
          {/* Header */}
          <div className="settings-header">
            <h2>This is the Settings Plugin Template!</h2>
            <p>A simple starting point for creating BrainDrive settings plugins.</p>
          </div>

          {/* Plugin info */}
          <div className="plugin-info">
            <h3>Plugin Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Plugin ID:</strong> {this.props.pluginId || 'Not provided'}
              </div>
              <div className="info-item">
                <strong>Module ID:</strong> {this.props.moduleId || 'Not provided'}
              </div>
              <div className="info-item">
                <strong>Instance ID:</strong> {this.props.instanceId || 'Not provided'}
              </div>
              <div className="info-item">
                <strong>Services Available:</strong>
                <ul>
                  <li>Theme: {this.props.services?.theme ? '✅' : '❌'}</li>
                  <li>Settings: {this.props.services?.settings ? '✅' : '❌'}</li>
                  <li>API: {this.props.services?.api ? '✅' : '❌'}</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default SettingsExample;