# BrainDrive Plugin Template

A comprehensive template for creating BrainDrive plugins with React, TypeScript, and Module Federation. This template provides all the essential structure, configuration, and examples needed to get started with BrainDrive plugin development.

## 🚀 Features

- **React 18 + TypeScript**: Modern React development with full TypeScript support
- **Module Federation**: Webpack 5 Module Federation for plugin architecture
- **BrainDrive Services**: Integration with BrainDrive's service system (API, Theme, Settings, Events)
- **Theme Support**: Automatic light/dark theme switching
- **Component Examples**: Reusable components with proper patterns
- **Build System**: Automated build and development workflow
- **Lifecycle Management**: Python-based plugin lifecycle management
- **Development Environment**: Hot reload and mock services for development

## 📁 Project Structure

```
PluginTemplate/
├── src/
│   ├── components/          # Reusable components
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorDisplay.tsx
│   │   └── index.ts
│   ├── services/           # Business logic services
│   │   ├── PluginService.ts
│   │   └── index.ts
│   ├── PluginTemplate.tsx  # Main plugin component
│   ├── PluginTemplate.css  # Theme-aware styles
│   ├── types.ts           # TypeScript type definitions
│   ├── utils.ts           # Utility functions
│   └── index.tsx          # Entry point
├── public/
│   └── index.html         # Development HTML template
├── dist/                  # Build output (generated)
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── webpack.config.js      # Webpack Module Federation setup
├── build.sh              # Build script
├── lifecycle_manager.py   # Plugin lifecycle management
└── README.md             # This file
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 16+
- npm 7+
- Python 3.8+ (for lifecycle management)

### 1. Customize the Template

Before building, customize the template for your plugin:

#### Update Plugin Metadata

1. **package.json**: Update name, description, version, and author
2. **webpack.config.js**: Change `PLUGIN_NAME` and `PLUGIN_PORT`
3. **lifecycle_manager.py**: Update plugin metadata in `plugin_data` and `module_data`

#### Rename Files and Components

1. Rename `PluginTemplate.tsx` to `YourPluginName.tsx`
2. Rename `PluginTemplate.css` to `YourPluginName.css`
3. Update import statements and component names
4. Update the webpack expose configuration

### 2. Install Dependencies

```bash
npm install
```

### 3. Development

Start the development server with hot reload:

```bash
npm start
```

This will start the development server at `http://localhost:3003` (or your configured port) with mock BrainDrive services.

### 4. Build

Build the plugin for production:

```bash
chmod +x build.sh
./build.sh
```

Or use npm:

```bash
npm run build
```

The build output will be in the `dist/` directory with `remoteEntry.js` as the main bundle.

## 🔧 Customization Guide

### Adding New Components

1. Create your component in `src/components/`
2. Export it from `src/components/index.ts`
3. Import and use in your main plugin component

### Adding Services

1. Create your service in `src/services/`
2. Export it from `src/services/index.ts`
3. Use the service in your components

### Configuring BrainDrive Services

Update the `required_services` in `lifecycle_manager.py` to specify which BrainDrive services your plugin needs:

```python
"required_services": {
    "api": {"methods": ["get", "post"], "version": "1.0.0"},
    "theme": {"methods": ["getCurrentTheme"], "version": "1.0.0"},
    # Add other services as needed
}
```

### Adding Configuration Options

1. Define config fields in `lifecycle_manager.py`:

```python
"config_fields": {
    "your_setting": {
        "type": "text",
        "description": "Your setting description",
        "default": "default_value"
    }
}
```

2. Use the configuration in your component via props

### Styling

The template includes a comprehensive CSS system with:

- CSS variables for theme support
- Utility classes for common layouts
- Responsive design patterns
- Dark/light theme switching

Customize `src/PluginTemplate.css` for your plugin's specific styling needs.

## 🎨 Theme Support

The template automatically supports BrainDrive's theme system:

- CSS variables automatically switch between light/dark themes
- Theme changes are handled via the Theme service
- Components re-render when theme changes

## 📡 Service Integration

### API Service

```typescript
const response = await services.api.get('/your-endpoint');
const data = await services.api.post('/your-endpoint', payload);
```

### Settings Service

```typescript
const setting = await services.settings.getSetting('your_setting');
await services.settings.setSetting('your_setting', value);
```

### Theme Service

```typescript
const currentTheme = services.theme.getCurrentTheme();
services.theme.addThemeChangeListener(handleThemeChange);
```

### Event Service

```typescript
services.event.sendMessage('target', message);
services.event.subscribeToMessages('target', handleMessage);
```

## 🚀 Installation

### Via BrainDrive Plugin Manager

1. Build your plugin using `./build.sh`
2. Use the BrainDrive Plugin Manager to install from your repository
3. Or install locally by copying the built plugin

### Via Lifecycle Manager

```bash
python3 lifecycle_manager.py install
```

## 🧪 Testing

The template includes mock services for development testing. You can:

1. Test components in isolation
2. Mock API responses
3. Test theme switching
4. Verify service integration

## 📝 Development Tips

### TODO Comments

The template includes `TODO` comments throughout the code indicating areas that need customization:

- Search for `TODO:` to find customization points
- Search for `TEMPLATE:` to find template-specific code
- Replace placeholder content with your plugin's functionality

### Common Patterns

1. **Error Handling**: Use try-catch blocks and display user-friendly errors
2. **Loading States**: Show loading indicators during async operations
3. **Debouncing**: Use debounced functions for frequent operations
4. **Cleanup**: Always clean up listeners and intervals in `componentWillUnmount`

### Performance

- Use React's built-in optimization patterns
- Implement proper cleanup to prevent memory leaks
- Consider lazy loading for large components
- Use debouncing for expensive operations

## 🐛 Troubleshooting

### Build Issues

- Ensure all dependencies are installed: `npm install`
- Check Node.js version compatibility
- Verify webpack configuration

### TypeScript Errors

- Install missing type definitions
- Check import paths
- Verify interface definitions

### Runtime Issues

- Check browser console for errors
- Verify service availability
- Test with mock services first

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📚 Resources

- [BrainDrive Documentation](https://braindrive.ai/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation)

## 🆘 Support

For issues and support:
- Check the troubleshooting section above
- Review BrainDrive plugin development documentation
- Create an issue in the repository

---

**Happy Plugin Development! 🧩**