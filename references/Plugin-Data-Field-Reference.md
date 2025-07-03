# BrainDrive Plugin Data Field Reference

This document provides comprehensive information about each field in the `plugin_data` dictionary used in BrainDrive plugin lifecycle managers. This reference is designed for developers of all skill levels who are creating plugins for the BrainDrive platform.

## Overview

The `plugin_data` dictionary in your `lifecycle_manager.py` file defines the metadata and configuration for your plugin. This data is used throughout the BrainDrive system for plugin management, display, installation, and functionality.

## Field Reference

### Core Plugin Information

#### `name` (string, required)
- **Purpose**: The display name of your plugin as shown in the BrainDrive interface
- **Database**: Stored in `plugin.name` column
- **Frontend Usage**: Displayed in plugin cards, headers, and management interfaces
- **Example**: `"My Awesome Plugin"`
- **Best Practices**: 
  - Use a clear, descriptive name
  - Keep it concise (under 50 characters)
  - Avoid special characters that might cause issues

#### `description` (string, required)
- **Purpose**: Short description of what your plugin does
- **Database**: Stored in `plugin.description` column
- **Frontend Usage**: Shown in plugin cards and search results
- **Example**: `"A powerful tool for managing project tasks and deadlines"`
- **Best Practices**:
  - Keep it under 150 characters
  - Focus on the main benefit or purpose
  - Use clear, non-technical language

#### `version` (string, required)
- **Purpose**: Current version of your plugin using semantic versioning
- **Database**: Stored in `plugin.version` column
- **Frontend Usage**: Displayed in plugin details and update notifications
- **Example**: `"1.2.3"`
- **Best Practices**:
  - Follow semantic versioning (MAJOR.MINOR.PATCH)
  - Increment appropriately for breaking changes, features, and fixes
  - Keep consistent with your package.json version

#### `plugin_slug` (string, required)
- **Purpose**: Unique identifier for your plugin used in file paths and internal references
- **Database**: Stored in `plugin.plugin_slug` column
- **Frontend Usage**: Used for plugin identification and routing
- **Example**: `"MyAwesomePlugin"`
- **Best Practices**:
  - Use PascalCase or camelCase
  - No spaces or special characters
  - Should match your main component name
  - Must be unique across all plugins

### Plugin Classification

#### `type` (string, required)
- **Purpose**: Defines the type of plugin for system categorization
- **Database**: Stored in `plugin.type` column
- **Frontend Usage**: Used for filtering and organization
- **Common Values**: `"frontend"`, `"backend"`, `"fullstack"`
- **Example**: `"frontend"`
- **Best Practices**:
  - Use `"frontend"` for React-based UI plugins
  - Use `"backend"` for server-side only plugins
  - Use `"fullstack"` for plugins with both components

#### `category` (string, optional)
- **Purpose**: Categorizes your plugin for better organization and discovery
- **Database**: Stored in `plugin.category` column
- **Frontend Usage**: Used in filters and plugin browsing
- **Common Values**: `"productivity"`, `"communication"`, `"data"`, `"ai"`, `"utility"`, `"entertainment"`
- **Example**: `"productivity"`
- **Best Practices**:
  - Choose from established categories when possible
  - Use lowercase, single words
  - Consider how users would search for your plugin

#### `icon` (string, optional)
- **Purpose**: Icon identifier for visual representation of your plugin
- **Database**: Stored in `plugin.icon` column
- **Frontend Usage**: Displayed in plugin cards, menus, and interfaces
- **Example**: `"TaskAlt"`, `"Dashboard"`, `"Settings"`
- **Best Practices**:
  - Use Material-UI icon names
  - Choose icons that represent your plugin's function
  - Test icon appearance in both light and dark themes

### Plugin Status and Metadata

#### `official` (boolean, required)
- **Purpose**: Indicates if this is an official BrainDrive plugin
- **Database**: Stored in `plugin.official` column
- **Frontend Usage**: Shows official badge and affects trust indicators
- **Values**: `true` for official plugins, `false` for third-party
- **Example**: `false`
- **Best Practices**:
  - Set to `false` unless you're part of the BrainDrive team
  - Official plugins get special treatment in the UI

#### `author` (string, required)
- **Purpose**: Name of the plugin author or organization
- **Database**: Stored in `plugin.author` column
- **Frontend Usage**: Displayed in plugin details and cards
- **Example**: `"John Doe"`, `"Acme Corporation"`
- **Best Practices**:
  - Use your real name or organization name
  - Keep it professional and recognizable
  - Consider using the same author name across all your plugins

#### `compatibility` (string, required)
- **Purpose**: BrainDrive version compatibility information
- **Database**: Stored in `plugin.compatibility` column
- **Frontend Usage**: Used for compatibility checking during installation
- **Example**: `"1.0.0"`
- **Best Practices**:
  - Use the minimum BrainDrive version your plugin supports
  - Update when you use new BrainDrive features
  - Test compatibility thoroughly

#### `long_description` (string, optional)
- **Purpose**: Detailed description of your plugin's features and capabilities
- **Database**: Stored in `plugin.long_description` column
- **Frontend Usage**: Shown in detailed plugin views and documentation
- **Example**: `"This plugin provides comprehensive project management capabilities including task tracking, deadline management, team collaboration tools, and progress reporting. It integrates seamlessly with popular project management methodologies and supports custom workflows."`
- **Best Practices**:
  - Provide comprehensive information about features
  - Include use cases and benefits
  - Use markdown formatting if supported
  - Keep it informative but readable

### Technical Configuration

#### `scope` (string, required)
- **Purpose**: Defines the scope name for your plugin's components
- **Database**: Stored in `plugin.scope` column
- **Frontend Usage**: Used in module federation and component loading
- **Example**: `"MyAwesomePlugin"`
- **Best Practices**:
  - Should match your plugin_slug
  - Used in webpack module federation configuration
  - Must be unique and follow JavaScript naming conventions

#### `bundle_method` (string, required)
- **Purpose**: Specifies how your plugin is bundled
- **Database**: Stored in `plugin.bundle_method` column
- **Frontend Usage**: Determines how the plugin is loaded
- **Common Values**: `"webpack"`, `"rollup"`, `"vite"`
- **Example**: `"webpack"`
- **Best Practices**:
  - Use `"webpack"` for the template-based approach
  - Ensure your build process matches this setting

#### `bundle_location` (string, required)
- **Purpose**: Path to your plugin's main bundle file
- **Database**: Stored in `plugin.bundle_location` column
- **Frontend Usage**: Used to load your plugin's JavaScript bundle
- **Example**: `"dist/remoteEntry.js"`
- **Best Practices**:
  - Use relative paths from your plugin directory
  - Ensure the file exists after building
  - Standard location is `"dist/remoteEntry.js"`

#### `is_local` (boolean, required)
- **Purpose**: Indicates if the plugin is installed locally or remotely
- **Database**: Stored in `plugin.is_local` column
- **Frontend Usage**: Affects how the plugin is managed and updated
- **Values**: `true` for local development, `false` for distributed plugins
- **Example**: `false`
- **Best Practices**:
  - Set to `false` for distributed plugins
  - Set to `true` only during local development

### Source and Update Management

#### `source_type` (string, optional)
- **Purpose**: Specifies where your plugin is hosted
- **Database**: Stored in `plugin.source_type` column
- **Frontend Usage**: Used for update checking and plugin management
- **Common Values**: `"github"`, `"gitlab"`, `"npm"`, `"custom"`, `"local"`
- **Example**: `"github"`
- **Best Practices**:
  - Use `"github"` for GitHub-hosted plugins
  - Enables automatic update checking

#### `source_url` (string, optional)
- **Purpose**: URL to your plugin's source repository
- **Database**: Stored in `plugin.source_url` column
- **Frontend Usage**: Provides link to source code and enables updates
- **Example**: `"https://github.com/username/my-awesome-plugin"`
- **Best Practices**:
  - Use the main repository URL
  - Ensure the repository is public if you want others to access it
  - Keep the URL updated if you move repositories

#### `update_check_url` (string, optional)
- **Purpose**: API endpoint for checking plugin updates
- **Database**: Stored in `plugin.update_check_url` column
- **Frontend Usage**: Used by the update system to check for new versions
- **Example**: `"https://api.github.com/repos/username/my-awesome-plugin/releases/latest"`
- **Best Practices**:
  - Use GitHub releases API for GitHub-hosted plugins
  - Ensure the endpoint returns version information
  - Test the endpoint before publishing

#### `last_update_check` (datetime, system-managed)
- **Purpose**: Timestamp of the last update check
- **Database**: Stored in `plugin.last_update_check` column
- **Frontend Usage**: Shows when updates were last checked
- **Value**: Automatically managed by the system
- **Best Practices**: Don't modify this field manually

#### `update_available` (boolean, system-managed)
- **Purpose**: Cached flag indicating if an update is available
- **Database**: Stored in `plugin.update_available` column
- **Frontend Usage**: Shows update notifications and buttons
- **Value**: Automatically managed by the update system
- **Best Practices**: Don't modify this field manually

#### `latest_version` (string, system-managed)
- **Purpose**: Latest available version from the update source
- **Database**: Stored in `plugin.latest_version` column
- **Frontend Usage**: Shows available version in update notifications
- **Value**: Automatically managed by the update system
- **Best Practices**: Don't modify this field manually

#### `installation_type` (string, required)
- **Purpose**: How the plugin was installed
- **Database**: Stored in `plugin.installation_type` column
- **Frontend Usage**: Affects plugin management options
- **Common Values**: `"remote"`, `"local"`, `"manual"`
- **Example**: `"remote"`
- **Best Practices**:
  - Use `"remote"` for plugins installed from repositories
  - Use `"local"` for development installations

### Security and Permissions

#### `permissions` (array of strings, required)
- **Purpose**: List of permissions your plugin requires
- **Database**: Stored in `plugin.permissions` column as JSON
- **Frontend Usage**: Shown during installation and in security settings
- **Common Values**: `["storage.read", "storage.write", "api.access", "network.request"]`
- **Example**: `["storage.read", "storage.write", "api.access"]`
- **Best Practices**:
  - Only request permissions you actually need
  - Use standard permission names
  - Document why each permission is needed
  - Common permissions:
    - `"storage.read"` - Read user data
    - `"storage.write"` - Write user data
    - `"api.access"` - Access BrainDrive APIs
    - `"network.request"` - Make external network requests
    - `"file.access"` - Access file system
    - `"notification.send"` - Send notifications

## Field Validation and Requirements

### Required Fields
These fields must be present and non-empty:
- `name`
- `description`
- `version`
- `plugin_slug`
- `type`
- `official`
- `author`
- `compatibility`
- `scope`
- `bundle_method`
- `bundle_location`
- `is_local`
- `installation_type`
- `permissions`

### Optional Fields
These fields can be omitted or set to null:
- `icon`
- `category`
- `long_description`
- `source_type`
- `source_url`
- `update_check_url`

### System-Managed Fields
These fields are automatically managed by BrainDrive:
- `last_update_check`
- `update_available`
- `latest_version`

## Common Patterns and Examples

### Basic Plugin Configuration
```python
self.plugin_data = {
    "name": "Task Manager",
    "description": "Simple task management for productivity",
    "version": "1.0.0",
    "type": "frontend",
    "icon": "TaskAlt",
    "category": "productivity",
    "official": False,
    "author": "Your Name",
    "compatibility": "1.0.0",
    "scope": "TaskManager",
    "bundle_method": "webpack",
    "bundle_location": "dist/remoteEntry.js",
    "is_local": False,
    "long_description": "A comprehensive task management plugin...",
    "plugin_slug": "TaskManager",
    "source_type": "github",
    "source_url": "https://github.com/yourusername/task-manager",
    "update_check_url": "https://api.github.com/repos/yourusername/task-manager/releases/latest",
    "last_update_check": None,
    "update_available": False,
    "latest_version": None,
    "installation_type": "remote",
    "permissions": ["storage.read", "storage.write", "api.access"]
}
```

### GitHub-Hosted Plugin
```python
# For plugins hosted on GitHub
"source_type": "github",
"source_url": "https://github.com/username/plugin-name",
"update_check_url": "https://api.github.com/repos/username/plugin-name/releases/latest",
```

### Local Development Plugin
```python
# For local development
"is_local": True,
"installation_type": "local",
"source_type": "local",
"source_url": None,
"update_check_url": None,
```

## Troubleshooting Common Issues

### Plugin Not Loading
- Check that `bundle_location` points to an existing file
- Verify `scope` matches your webpack configuration
- Ensure `plugin_slug` is unique

### Update System Not Working
- Verify `source_url` is accessible
- Check that `update_check_url` returns valid JSON
- Ensure version format matches semantic versioning

### Permission Errors
- Review `permissions` array for required permissions
- Check that permissions are spelled correctly
- Ensure you're not requesting unnecessary permissions

### Display Issues
- Verify `icon` name matches available Material-UI icons
- Check that `category` is a recognized value
- Ensure `name` and `description` are appropriate lengths

## Best Practices Summary

1. **Be Descriptive**: Use clear, descriptive names and descriptions
2. **Follow Conventions**: Use established patterns for categories, icons, and permissions
3. **Version Properly**: Follow semantic versioning and keep versions in sync
4. **Secure by Default**: Only request necessary permissions
5. **Plan for Updates**: Set up proper source URLs for automatic updates
6. **Test Thoroughly**: Verify all fields work correctly in the BrainDrive interface
7. **Document Changes**: Update version and descriptions when making changes
8. **Stay Compatible**: Test with the specified BrainDrive compatibility version

## Related Documentation

- [Plugin Template Development Guide](./DEVELOPMENT.md)
- [BrainDrive Plugin Architecture](./Plugin-Template-Plan.md)
- [Module Data Field Reference](./Module-Data-Field-Reference.md) *(coming soon)*

---

This reference document helps ensure your plugin integrates properly with the BrainDrive ecosystem and provides the best experience for users.