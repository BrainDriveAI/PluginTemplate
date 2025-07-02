import React from 'react';
import PluginTemplate from './PluginTemplate';
import { SettingsExample } from './components';

// TEMPLATE: Main entry point for your BrainDrive plugin
// TODO: Update the export name to match your plugin name

// Export the main component
export default PluginTemplate;

// Export individual modules for BrainDrive to load
export { SettingsExample };

// Version information - TODO: Update version as you develop
export const version = '1.0.0';

// TEMPLATE: Plugin metadata for development/debugging
export const metadata = {
  name: 'PluginTemplate',
  description: 'A template for creating BrainDrive plugins',
  version: '1.0.0',
  author: 'BrainDrive',
  // TODO: Add any additional metadata your plugin needs
};

// TEMPLATE: For development mode, render the component if we're in a standalone environment
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Check if we're running in development mode (webpack dev server)
  const rootElement = document.getElementById('root');
  if (rootElement) {
    import('react-dom/client').then(({ createRoot }) => {
      const root = createRoot(rootElement);
      
      // Mock services for development
      const mockServices = {
        api: {
          get: async (url: string) => {
            console.log('Mock API GET:', url);
            return {
              data: {
                id: 'mock-id',
                name: 'Mock Data',
                value: Math.floor(Math.random() * 100),
                timestamp: new Date().toISOString()
              }
            };
          },
          post: async (url: string, data: any) => {
            console.log('Mock API POST:', url, data);
            return { data: { success: true } };
          },
          put: async (url: string, data: any) => {
            console.log('Mock API PUT:', url, data);
            return { data: { success: true } };
          },
          delete: async (url: string) => {
            console.log('Mock API DELETE:', url);
            return { data: { success: true } };
          }
        },
        theme: {
          getCurrentTheme: () => {
            const currentTheme = localStorage.getItem('mock-theme') || 'light';
            return currentTheme;
          },
          setTheme: (theme: string) => {
            console.log('Mock setTheme:', theme);
            localStorage.setItem('mock-theme', theme);
            // Trigger theme change listeners
            const event = new CustomEvent('mock-theme-change', { detail: theme });
            window.dispatchEvent(event);
          },
          toggleTheme: () => {
            const currentTheme = localStorage.getItem('mock-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            console.log('Mock toggleTheme:', currentTheme, '->', newTheme);
            localStorage.setItem('mock-theme', newTheme);
            // Trigger theme change listeners
            const event = new CustomEvent('mock-theme-change', { detail: newTheme });
            window.dispatchEvent(event);
          },
          addThemeChangeListener: (callback: (theme: string) => void) => {
            console.log('Mock theme listener added');
            const handler = (event: CustomEvent) => callback(event.detail);
            window.addEventListener('mock-theme-change', handler as EventListener);
            // Simulate theme change after 5 seconds for testing
            setTimeout(() => callback('dark'), 5000);
          },
          removeThemeChangeListener: (callback: (theme: string) => void) => {
            console.log('Mock theme listener removed');
            // In a real implementation, you'd need to track and remove the specific listener
          }
        },
        settings: {
          get: (key: string) => {
            console.log('Mock settings get:', key);
            return null;
          },
          set: async (key: string, value: any) => {
            console.log('Mock settings set:', key, value);
          },
          getSetting: async (id: string) => {
            console.log('Mock getSetting:', id);
            return null;
          },
          setSetting: async (id: string, value: any) => {
            console.log('Mock setSetting:', id, value);
          }
        },
        event: {
          sendMessage: (target: string, message: any) => {
            console.log('Mock event send:', target, message);
          },
          subscribeToMessages: (target: string, callback: (message: any) => void) => {
            console.log('Mock event subscribe:', target);
          },
          unsubscribeFromMessages: (target: string, callback: (message: any) => void) => {
            console.log('Mock event unsubscribe:', target);
          }
        },
        pageContext: {
          getCurrentPageContext: () => ({
            pageId: 'dev-page',
            pageName: 'Development Page',
            pageRoute: '/dev',
            isStudioPage: false
          }),
          onPageContextChange: (callback: (context: any) => void) => {
            console.log('Mock page context listener added');
            return () => console.log('Mock page context listener removed');
          }
        }
      };

      // Render the plugin with mock services
      root.render(
        <React.StrictMode>
          <PluginTemplate 
            services={mockServices}
            title="Plugin Template (Development)"
            description="This is the development environment for the plugin template"
            config={{
              refreshInterval: 30000,
              showAdvancedOptions: true,
              customSetting: 'development'
            }}
          />
        </React.StrictMode>
      );
    }).catch(error => {
      console.error('Failed to load React DOM:', error);
    });
  }
}