# Plugin Template Development Guide

This guide provides detailed instructions for customizing and developing your BrainDrive plugin using this template.

## 🎯 Quick Start Checklist

### 1. Initial Setup

- [ ] Clone or copy the Plugin Template
- [ ] Update `package.json` with your plugin details
- [ ] Rename `PluginTemplate` files to your plugin name
- [ ] Update webpack configuration
- [ ] Customize lifecycle manager metadata

### 2. Development Environment

- [ ] Install dependencies: `npm install`
- [ ] Build the plugin: `npm run build`
- [ ] Install plugin through BrainDrive Plugin Manager for testing
- [ ] Test functionality within BrainDrive environment

### 3. Customization

- [ ] Implement your plugin's core functionality
- [ ] Add custom components and services
- [ ] Configure BrainDrive service requirements
- [ ] Style your plugin with custom CSS
- [ ] Test with real BrainDrive services

### 4. Build and Deploy

- [ ] Build plugin: `npm run build`
- [ ] Install via BrainDrive Plugin Manager
- [ ] Test functionality in BrainDrive environment

## 🔧 Detailed Customization Steps

### Step 1: Rename and Configure

#### 1.1 Update package.json

```json
{
  "name": "your-plugin-name",
  "version": "1.0.0",
  "description": "Your plugin description",
  "author": "Your Name"
}
```

#### 1.2 Update webpack.config.js

```javascript
const PLUGIN_NAME = "YourPluginName"; // Change this
const PLUGIN_PORT = 3004; // Change to available port
```

#### 1.3 Rename Files

```bash
# Rename main component files
mv src/PluginTemplate.tsx src/YourPluginName.tsx
mv src/PluginTemplate.css src/YourPluginName.css

# Update imports in index.tsx
# Update component class name
# Update CSS class names
```

#### 1.4 Update lifecycle_manager.py

```python
self.plugin_data = {
    "name": "YourPluginName",
    "description": "Your plugin description",
    "plugin_slug": "YourPluginName",
    "source_url": "https://github.com/YourUsername/YourPluginName",
    # ... other metadata
}
```

### Step 2: Implement Core Functionality

#### 2.1 Define Your Data Structure

Update `src/types.ts`:

```typescript
// Replace PluginData with your data structure
export interface YourDataType {
  id: string;
  // Add your specific fields
  title: string;
  content: string;
  status: 'active' | 'inactive';
  createdAt: string;
}
```

#### 2.2 Implement Your Service

Update `src/services/PluginService.ts`:

```typescript
export class YourPluginService {
  // Implement methods specific to your plugin
  async fetchYourData(): Promise<YourDataType[]> {
    // Your API calls
  }
  
  async processYourData(data: YourDataType): Promise<void> {
    // Your business logic
  }
}
```

#### 2.3 Update Main Component

In your main component file:

```typescript
class YourPluginName extends React.Component<YourProps, YourState> {
  // Implement your plugin's UI and logic
  
  private async loadYourData(): Promise<void> {
    // Load your specific data
  }
  
  private renderYourContent(): JSX.Element {
    // Render your plugin's content
  }
}
```

### Step 3: Configure BrainDrive Integration

#### 3.1 Service Requirements

In `lifecycle_manager.py`, specify which BrainDrive services you need:

```python
"required_services": {
    "api": {
        "methods": ["get", "post", "put", "delete"],
        "version": "1.0.0"
    },
    "theme": {
        "methods": ["getCurrentTheme", "addThemeChangeListener"],
        "version": "1.0.0"
    },
    "settings": {
        "methods": ["getSetting", "setSetting"],
        "version": "1.0.0"
    },
    # Add other services as needed
}
```

#### 3.2 Configuration Fields

Define user-configurable options:

```python
"config_fields": {
    "api_endpoint": {
        "type": "text",
        "description": "API endpoint URL",
        "default": "https://api.example.com"
    },
    "refresh_interval": {
        "type": "number",
        "description": "Refresh interval in seconds",
        "default": 60
    },
    "enable_notifications": {
        "type": "boolean",
        "description": "Enable notifications",
        "default": true
    }
}
```

#### 3.3 Layout Configuration

Set your plugin's layout constraints:

```python
"layout": {
    "minWidth": 4,
    "minHeight": 3,
    "defaultWidth": 8,
    "defaultHeight": 6,
    "maxWidth": 12,
    "maxHeight": 12
}
```

### Step 4: Custom Components

#### 4.1 Create Custom Components

```typescript
// src/components/YourCustomComponent.tsx
import React from 'react';

interface YourCustomComponentProps {
  data: YourDataType;
  onAction: (action: string) => void;
}

const YourCustomComponent: React.FC<YourCustomComponentProps> = ({ 
  data, 
  onAction 
}) => {
  return (
    <div className="your-custom-component">
      {/* Your component JSX */}
    </div>
  );
};

export default YourCustomComponent;
```

#### 4.2 Export Components

Update `src/components/index.ts`:

```typescript
export { default as YourCustomComponent } from './YourCustomComponent';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as ErrorDisplay } from './ErrorDisplay';
```

### Step 5: Styling

#### 5.1 CSS Variables

Use CSS variables for theme support:

```css
:root {
  --your-plugin-primary: #007bff;
  --your-plugin-secondary: #6c757d;
  /* Add your color scheme */
}

.your-plugin--dark {
  --your-plugin-primary: #4dabf7;
  --your-plugin-secondary: #b0b0b0;
  /* Dark theme colors */
}
```

#### 5.2 Component Styles

```css
.your-plugin {
  background-color: var(--plugin-bg-primary);
  color: var(--plugin-text-primary);
  /* Use template variables or create your own */
}

.your-custom-component {
  /* Your component styles */
}
```

### Step 6: API Integration

#### 6.1 Using BrainDrive API Service

```typescript
// In your component
private async fetchDataFromAPI(): Promise<void> {
  const { services } = this.props;
  
  if (!services.api) {
    throw new Error('API service not available');
  }
  
  try {
    const response = await services.api.get('/your-endpoint');
    this.setState({ data: response.data });
  } catch (error) {
    this.setState({ error: 'Failed to fetch data' });
  }
}
```

#### 6.2 Handling Settings

```typescript
private async loadSettings(): Promise<void> {
  const { services } = this.props;
  
  if (services.settings) {
    const apiEndpoint = await services.settings.getSetting('api_endpoint');
    const refreshInterval = await services.settings.getSetting('refresh_interval');
    
    // Use settings in your plugin
  }
}
```

### Step 7: Error Handling

#### 7.1 Component Error Boundaries

```typescript
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  console.error('Plugin error:', error, errorInfo);
  this.setState({ 
    error: 'An unexpected error occurred',
    hasError: true 
  });
}
```

#### 7.2 Service Error Handling

```typescript
private async safeApiCall<T>(
  apiCall: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    console.error('API call failed:', error);
    return fallback;
  }
}
```

### Step 8: Testing

#### 8.1 Development Testing

```bash
# Build the plugin
npm run build

# Install via BrainDrive Plugin Manager
# Test functionality within BrainDrive
# Verify service integration works
# Check responsive design
```

#### 8.2 Build Testing

```bash
# Build plugin
npm run build

# Check bundle size
ls -la dist/remoteEntry.js

# Verify bundle was created successfully
```

#### 8.3 Integration Testing

```bash
# Test with BrainDrive
python3 lifecycle_manager.py metadata

# Install in BrainDrive development environment
# Test all functionality
# Verify service integration
```

## 🚀 Advanced Features

### Streaming API Support

```typescript
// Using streaming API
if (services.api?.postStreaming) {
  await services.api.postStreaming(
    '/streaming-endpoint',
    { query: 'your query' },
    (chunk) => {
      // Handle streaming response
      this.handleStreamingChunk(chunk);
    }
  );
}
```

### Event Communication

```typescript
// Send events to other plugins
services.event?.sendMessage('other-plugin', {
  type: 'data-update',
  data: yourData
});

// Listen for events
services.event?.subscribeToMessages('your-plugin', (message) => {
  this.handleIncomingMessage(message);
});
```

### Page Context Awareness

```typescript
// React to page changes
if (services.pageContext) {
  this.pageContextUnsubscribe = services.pageContext.onPageContextChange((context) => {
    if (context.isStudioPage) {
      // Adapt behavior for studio page
    }
  });
}
```

## 📋 Best Practices

### 1. Performance

- Use React.memo for expensive components
- Implement proper cleanup in componentWillUnmount
- Debounce expensive operations
- Use lazy loading for large components

### 2. Accessibility

- Use semantic HTML elements
- Add proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers

### 3. Responsive Design

- Use CSS Grid and Flexbox
- Test on different screen sizes
- Consider mobile-first approach
- Use relative units (rem, em, %)

### 4. Error Handling

- Always handle async operation failures
- Provide user-friendly error messages
- Log errors for debugging
- Implement retry mechanisms

### 5. Code Organization

- Keep components small and focused
- Separate business logic into services
- Use TypeScript for type safety
- Follow consistent naming conventions

## 🐛 Common Issues

### TypeScript Errors

```bash
# Install missing types
npm install --save-dev @types/node

# Check tsconfig.json configuration
# Verify import paths
```

### Build Failures

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check webpack configuration
# Verify all imports are correct
```

### Runtime Errors

```bash
# Check browser console
# Verify service availability
# Test with mock services first
# Check network requests
```

## 📚 Additional Resources

- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation)

---

Happy coding! 🚀