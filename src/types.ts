// TEMPLATE: Core type definitions for BrainDrive plugins
// TODO: Customize these types based on your plugin's specific needs

// Service interfaces - these match the BrainDrive service contracts
export interface ApiService {
  get: (url: string, options?: any) => Promise<ApiResponse>;
  post: (url: string, data: any, options?: any) => Promise<ApiResponse>;
  put: (url: string, data: any, options?: any) => Promise<ApiResponse>;
  delete: (url: string, options?: any) => Promise<ApiResponse>;
  postStreaming?: (url: string, data: any, onChunk: (chunk: string) => void, options?: any) => Promise<ApiResponse>;
}

export interface EventService {
  sendMessage: (target: string, message: any, options?: any) => void;
  subscribeToMessages: (target: string, callback: (message: any) => void) => void;
  unsubscribeFromMessages: (target: string, callback: (message: any) => void) => void;
}

export interface ThemeService {
  getCurrentTheme: () => string;
  addThemeChangeListener: (callback: (theme: string) => void) => void;
  removeThemeChangeListener: (callback: (theme: string) => void) => void;
}

export interface SettingsService {
  get: (key: string) => any;
  set: (key: string, value: any) => Promise<void>;
  getSetting?: (id: string) => Promise<any>;
  setSetting?: (id: string, value: any) => Promise<any>;
  getSettingDefinitions?: () => Promise<any>;
}

export interface PageContextService {
  getCurrentPageContext(): {
    pageId: string;
    pageName: string;
    pageRoute: string;
    isStudioPage: boolean;
  } | null;
  onPageContextChange(callback: (context: any) => void): () => void;
}

// Services container
export interface Services {
  api?: ApiService;
  event?: EventService;
  theme?: ThemeService;
  settings?: SettingsService;
  pageContext?: PageContextService;
}

// API Response interface
export interface ApiResponse {
  data?: any;
  status?: number;
  id?: string;
  [key: string]: any;
}

// TEMPLATE: Plugin-specific types - customize these for your plugin
export interface PluginTemplateProps {
  moduleId?: string;
  services: Services;
  // TODO: Add your plugin-specific props here
  title?: string;
  description?: string;
  config?: PluginConfig;
}

export interface PluginTemplateState {
  // TODO: Add your plugin-specific state properties here
  isLoading: boolean;
  error: string;
  currentTheme: string;
  isInitializing: boolean;
  data: any; // Replace 'any' with your specific data type
}

// TEMPLATE: Plugin configuration interface
export interface PluginConfig {
  // TODO: Define your plugin's configuration options
  refreshInterval?: number;
  showAdvancedOptions?: boolean;
  customSetting?: string;
}

// TEMPLATE: Example data interface - replace with your plugin's data structure
export interface PluginData {
  // TODO: Define the structure of data your plugin works with
  id: string;
  name: string;
  value: any;
  timestamp: string;
}

// TEMPLATE: Example event interface - customize for your plugin's events
export interface PluginEvent {
  type: string;
  data: any;
  timestamp: string;
}