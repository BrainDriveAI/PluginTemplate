# Lifecycle Manager Customization Guide

This guide walks you through customizing the `lifecycle_manager.py` file when creating a new BrainDrive plugin from the PluginTemplate. We'll use the transformation from `PluginTemplate` to `ServiceExample_Events` as a practical example.

## Table of Contents

1. [Overview](#overview)
2. [Class Name Changes](#class-name-changes)
3. [Plugin Data Customization](#plugin-data-customization)
4. [Module Data Configuration](#module-data-configuration)
5. [Service Requirements](#service-requirements)
6. [Step-by-Step Walkthrough](#step-by-step-walkthrough)
7. [Validation and Testing](#validation-and-testing)
8. [Common Patterns](#common-patterns)
9. [Troubleshooting](#troubleshooting)

## Overview

The `lifecycle_manager.py` file is the core component that defines how your plugin integrates with the BrainDrive system. It handles:

- Plugin metadata and configuration
- Module definitions and their properties
- Installation and uninstallation processes
- Service requirements and permissions
- Database record management

When creating a new plugin, you need to customize this file to reflect your plugin's specific requirements and functionality.

## Class Name Changes

### 1. Main Class Name

**Template:**
```python
class PluginTemplateLifecycleManager(BaseLifecycleManager):
    """Lifecycle manager for PluginTemplate plugin using new architecture"""
```

**ServiceExample_Events:**
```python
class ServiceExampleEventsLifecycleManager(BaseLifecycleManager):
    """Lifecycle manager for ServiceExample_Events plugin using new architecture"""
```

**Pattern:**
- Replace `PluginTemplate` with your plugin name in PascalCase
- Remove underscores and convert to PascalCase (e.g., `Service_Example_Events` → `ServiceExampleEvents`)
- Keep the `LifecycleManager` suffix

### 2. Logging References

Update all logging messages that reference the plugin name:

**Template:**
```python
logger.info(f"PluginTemplate: User installation completed for {user_id}")
```

**ServiceExample_Events:**
```python
logger.info(f"ServiceExample_Events: User installation completed for {user_id}")
```

**Note:** The ServiceExample_Events file still has some "PluginTemplate" references in logging - these should be updated to maintain consistency.

## Plugin Data Customization

The `plugin_data` dictionary contains all the metadata about your plugin. Here are the key fields to customize:

### Essential Fields

| Field | Template Value | ServiceExample_Events Value | Description |
|-------|---------------|----------------------------|-------------|
| `name` | `"PluginTemplate"` | `"ServiceExample_Events"` | Plugin display name |
| `description` | `"A template for creating BrainDrive plugins"` | `"Simple example demonstrating Event Service usage for inter-module communication"` | Brief description |
| `plugin_slug` | `"PluginTemplate"` | `"ServiceExample_Events"` | Unique identifier |
| `scope` | `"PluginTemplate"` | `"ServiceExampleEvents"` | Module Federation scope |

### Customization Fields

| Field | Template Value | ServiceExample_Events Value | Notes |
|-------|---------------|----------------------------|-------|
| `icon` | `"Puzzle"` | `"MessageSquare"` | Choose appropriate Lucide icon |
| `category` | `"template"` | `"examples"` | Plugin category for organization |
| `official` | `False` | `True` | Set to `True` for official plugins |
| `author` | `"BrainDrive"` | `"BrainDrive Team"` | Your name or organization |
| `long_description` | Template description | Event service description | Detailed description |

### Source and Update Fields

```python
# Template
"source_url": "https://github.com/YourUsername/PluginTemplate",
"update_check_url": "https://api.github.com/repos/YourUsername/PluginTemplate/releases/latest",

# ServiceExample_Events
"source_url": "https://github.com/DJJones66/ServiceExample_Events",
"update_check_url": "https://api.github.com/repos/DJJones66/ServiceExample_Events/releases/latest",
```

### Permissions

Customize based on your plugin's needs:

```python
# Template (comprehensive)
"permissions": ["storage.read", "storage.write", "api.access"]

# ServiceExample_Events (minimal)
"permissions": ["event.send", "event.subscribe"]
```

## Module Data Configuration

The `module_data` array defines the individual components/modules your plugin provides.

### Template Structure (2 modules)

1. **Main Plugin Module** - The primary functionality
2. **Settings Module** - Configuration interface

### ServiceExample_Events Structure (3 modules)

1. **EventSender** - Sends events to other modules
2. **EventReceiver** - Receives and displays events
3. **EventDisplay** - Shows event history and monitoring

### Module Definition Pattern

Each module requires these fields:

```python
{
    "name": "ModuleName",                    # Component name (matches React component)
    "display_name": "Human Readable Name",   # Display name in UI
    "description": "Module description",     # What this module does
    "icon": "LucideIconName",               # Icon for the module
    "category": "category_name",            # Grouping category
    "priority": 1,                          # Display order
    "props": {                              # Default props passed to component
        "title": "Module Title",
        "description": "Module description"
    },
    "config_fields": {                      # User-configurable settings
        "field_name": {
            "type": "text|number|boolean|select",
            "description": "Field description",
            "default": "default_value"
        }
    },
    "required_services": {                  # BrainDrive services needed
        "service_name": {
            "methods": ["method1", "method2"],
            "version": "1.0.0"
        }
    },
    "layout": {                            # Grid layout constraints
        "minWidth": 3,
        "minHeight": 3,
        "defaultWidth": 4,
        "defaultHeight": 4
    },
    "tags": ["tag1", "tag2"]               # Search/filter tags
}
```

## Service Requirements

Define which BrainDrive services your modules need:

### Common Services

BrainDrive provides several service bridges that plugins can use to interact with the system. Here's a comprehensive list based on the official ServiceExample plugins:

| Service | Available Methods | Use Case | Example Plugin |
|---------|------------------|----------|----------------|
| `api` | `["get", "post", "put", "delete"]` | HTTP requests and external API connectivity | [ServiceExample_API](https://github.com/DJJones66/ServiceExample_API) |
| `theme` | `["getCurrentTheme", "setTheme", "toggleTheme", "addThemeChangeListener", "removeThemeChangeListener"]` | Theme management and integration | [ServiceExample_Theme](https://github.com/DJJones66/ServiceExample_Theme) |
| `settings` | `["getSetting", "setSetting", "getSettingDefinitions"]` | User preferences and configuration | [ServiceExample_Settings](https://github.com/DJJones66/ServiceExample_Settings) |
| `event` | `["sendMessage", "subscribeToMessages", "unsubscribeFromMessages"]` | Inter-module communication | [ServiceExample_Events](https://github.com/DJJones66/ServiceExample_Events) |
| `pageContext` | `["getCurrentPageContext", "onPageContextChange"]` | Page awareness and navigation context | [ServiceExample_PageContext](https://github.com/DJJones66/ServiceExample_PageContext) |
| `pluginState` | `["configure", "saveState", "getState", "clearState", "validateState", "sanitizeState", "onSave", "onRestore", "onClear"]` | Plugin state management and persistence | [ServiceExample_PluginState](https://github.com/DJJones66/ServiceExample_PluginState) |

### Service Bridge Examples

Each service has a dedicated example plugin that demonstrates its usage patterns:

- **[ServiceExample_API](https://github.com/DJJones66/ServiceExample_API)** - CRUD operations and external API connectivity
- **[ServiceExample_Theme](https://github.com/DJJones66/ServiceExample_Theme)** - Theme switching, monitoring, and integration
- **[ServiceExample_Settings](https://github.com/DJJones66/ServiceExample_Settings)** - User preference management
- **[ServiceExample_Events](https://github.com/DJJones66/ServiceExample_Events)** - Inter-module communication patterns
- **[ServiceExample_PageContext](https://github.com/DJJones66/ServiceExample_PageContext)** - Page context awareness and navigation
- **[ServiceExample_PluginState](https://github.com/DJJones66/ServiceExample_PluginState)** - State persistence and management

### Example Configurations

**Template (comprehensive - includes all services):**
```python
"required_services": {
    "api": {"methods": ["get", "post", "put", "delete"], "version": "1.0.0"},
    "theme": {"methods": ["getCurrentTheme", "addThemeChangeListener", "removeThemeChangeListener"], "version": "1.0.0"},
    "settings": {"methods": ["getSetting", "setSetting", "getSettingDefinitions"], "version": "1.0.0"},
    "event": {"methods": ["sendMessage", "subscribeToMessages", "unsubscribeFromMessages"], "version": "1.0.0"},
    "pageContext": {"methods": ["getCurrentPageContext", "onPageContextChange"], "version": "1.0.0"},
    "pluginState": {"methods": ["configure", "saveState", "getState", "clearState"], "version": "1.0.0"}
}
```

**ServiceExample_API (API-focused):**
```python
"required_services": {
    "api": {"methods": ["get", "post", "put", "delete"], "version": "1.0.0"}
}
```

**ServiceExample_Theme (theme management):**
```python
"required_services": {
    "theme": {"methods": ["getCurrentTheme", "setTheme", "toggleTheme", "addThemeChangeListener", "removeThemeChangeListener"], "version": "1.0.0"}
}
```

**ServiceExample_Settings (user preferences):**
```python
"required_services": {
    "settings": {"methods": ["getSetting", "setSetting"], "version": "1.0.0"}
}
```

**ServiceExample_Events (inter-module communication):**
```python
"required_services": {
    "event": {"methods": ["sendMessage", "subscribeToMessages", "unsubscribeFromMessages"], "version": "1.0.0"}
}
```

**ServiceExample_PageContext (page awareness):**
```python
"required_services": {
    "pageContext": {"methods": ["getCurrentPageContext", "onPageContextChange"], "version": "1.0.0"},
    "theme": {"methods": ["getCurrentTheme"], "version": "1.0.0"}  # Often used together
}
```

**ServiceExample_PluginState (state management):**
```python
"required_services": {
    "pluginState": {"methods": ["configure", "saveState", "getState", "clearState", "validateState", "sanitizeState", "onSave", "onRestore", "onClear"], "version": "1.0.0"}
}
```

## Step-by-Step Walkthrough

### Step 1: Copy and Rename

1. Copy `PluginBuild/PluginTemplate/lifecycle_manager.py` to your new plugin directory
2. Open the file in your editor

### Step 2: Update Class Name

```python
# Change this:
class PluginTemplateLifecycleManager(BaseLifecycleManager):

# To this (example):
class MyAwesomePluginLifecycleManager(BaseLifecycleManager):
```

### Step 3: Customize Plugin Data

Update the `plugin_data` dictionary in the `__init__` method:

```python
self.plugin_data = {
    "name": "MyAwesomePlugin",                                    # Your plugin name
    "description": "An awesome plugin that does amazing things", # Brief description
    "version": "1.0.0",                                          # Your version
    "type": "frontend",                                          # Usually "frontend"
    "icon": "Star",                                              # Choose Lucide icon
    "category": "productivity",                                  # Choose category
    "official": False,                                           # True if official
    "author": "Your Name",                                       # Your name
    "compatibility": "1.0.0",                                   # BrainDrive version
    "scope": "MyAwesomePlugin",                                  # Module Federation scope
    "bundle_method": "webpack",                                  # Build method
    "bundle_location": "dist/remoteEntry.js",                   # Bundle path
    "is_local": False,                                          # Usually False
    "long_description": "A detailed description of what your plugin does and how it helps users.",
    "plugin_slug": "MyAwesomePlugin",                           # Unique identifier
    "source_type": "github",                                    # Source type
    "source_url": "https://github.com/YourUsername/MyAwesomePlugin",
    "update_check_url": "https://api.github.com/repos/YourUsername/MyAwesomePlugin/releases/latest",
    "last_update_check": None,
    "update_available": False,
    "latest_version": None,
    "installation_type": "remote",
    "permissions": ["api.access", "storage.read"]               # Required permissions
}
```

### Step 4: Define Your Modules

Replace the `module_data` array with your plugin's modules:

```python
self.module_data = [
    {
        "name": "MainComponent",                    # Must match your React component name
        "display_name": "My Awesome Component",     # Display name
        "description": "The main component of my awesome plugin",
        "icon": "Star",                            # Lucide icon name
        "category": "productivity",                # Category
        "priority": 1,                             # Display order
        "props": {                                 # Default props
            "title": "My Awesome Component",
            "config": {
                "refreshInterval": 30000,
                "showAdvanced": False
            }
        },
        "config_fields": {                         # User settings
            "refresh_interval": {
                "type": "number",
                "description": "Refresh interval in milliseconds",
                "default": 30000
            },
            "show_advanced": {
                "type": "boolean",
                "description": "Show advanced options",
                "default": False
            }
        },
        "messages": {},                            # Inter-module messages
        "required_services": {                     # Required services
            "api": {"methods": ["get", "post"], "version": "1.0.0"}
        },
        "dependencies": [],                        # Module dependencies
        "layout": {                               # Grid layout
            "minWidth": 4,
            "minHeight": 3,
            "defaultWidth": 6,
            "defaultHeight": 4
        },
        "tags": ["productivity", "awesome"]       # Search tags
    }
    # Add more modules as needed
]
```

### Step 5: Update Logging Messages

Find and replace all logging messages:

```python
# Change all instances like this:
logger.info(f"PluginTemplate: User installation completed for {user_id}")

# To this:
logger.info(f"MyAwesomePlugin: User installation completed for {user_id}")
```

### Step 6: Update Error Messages

Update error messages in validation methods:

```python
# In _validate_installation_impl method:
return {
    'valid': False,
    'error': f"MyAwesomePlugin: Missing required files: {', '.join(missing_files)}"
}
```

## Validation and Testing

### Required Files Check

Ensure your plugin has the required files:

```python
required_files = ["package.json", "dist/remoteEntry.js"]
```

### Package.json Validation

The lifecycle manager validates your `package.json`:

```json
{
  "name": "my-awesome-plugin",
  "version": "1.0.0",
  "main": "dist/remoteEntry.js"
}
```

### Bundle Validation

Ensure your webpack build creates `dist/remoteEntry.js` and it's not empty.

## Common Patterns

### Settings Module Pattern

If your plugin needs user configuration, include a settings module:

```python
{
    "name": "MyAwesomePluginSettings",
    "display_name": "My Awesome Plugin Settings",
    "description": "Configure My Awesome Plugin",
    "icon": "Settings",
    "category": "Configuration",
    "priority": 2,
    "tags": ["settings", "my_awesome_plugin_settings"]  # "settings" tag is special
}
```

### Multi-Component Plugin Pattern

For plugins with multiple related components:

```python
self.module_data = [
    {
        "name": "DataViewer",
        "display_name": "Data Viewer",
        "priority": 1,
        # ... configuration
    },
    {
        "name": "DataEditor", 
        "display_name": "Data Editor",
        "priority": 2,
        # ... configuration
    },
    {
        "name": "DataAnalyzer",
        "display_name": "Data Analyzer", 
        "priority": 3,
        # ... configuration
    }
]
```

### Service-Focused Plugin Pattern

For plugins that primarily use specific services:

```python
# Event-focused plugin
"required_services": {
    "event": {"methods": ["sendMessage", "subscribeToMessages", "unsubscribeFromMessages"], "version": "1.0.0"}
}

# API-focused plugin  
"required_services": {
    "api": {"methods": ["get", "post", "put", "delete"], "version": "1.0.0"}
}

# Settings-focused plugin
"required_services": {
    "settings": {"methods": ["getSetting", "setSetting", "getSettingDefinitions"], "version": "1.0.0"}
}
```

## Troubleshooting

### Common Issues

1. **Class Name Mismatch**
   - Ensure class name matches your plugin name
   - Use PascalCase without underscores

2. **Plugin Slug Conflicts**
   - Plugin slug must be unique across all plugins
   - Use descriptive, specific names

3. **Module Name Mismatch**
   - Module `name` field must exactly match your React component name
   - Case-sensitive matching

4. **Service Requirements**
   - Only include services your plugin actually uses
   - Verify method names match BrainDrive service APIs

5. **Bundle Path Issues**
   - Ensure `bundle_location` points to actual webpack output
   - Verify `dist/remoteEntry.js` exists and is not empty

### Validation Errors

If installation fails, check:

1. **Missing Files**: Ensure all files in `required_files` exist
2. **Invalid JSON**: Validate your `package.json` syntax
3. **Empty Bundle**: Check that webpack build completed successfully
4. **Database Errors**: Verify plugin slug uniqueness

### Debugging Tips

1. **Enable Debug Logging**: Set log level to DEBUG to see detailed information
2. **Check Database**: Verify plugin and module records are created correctly
3. **Test Installation**: Use the plugin installer to test your lifecycle manager
4. **Validate Metadata**: Ensure all required fields are present and correctly formatted

## Best Practices

1. **Descriptive Names**: Use clear, descriptive names for plugins and modules
2. **Appropriate Icons**: Choose icons that represent your plugin's functionality
3. **Minimal Permissions**: Only request permissions your plugin actually needs
4. **Proper Categories**: Use existing categories when possible
5. **Comprehensive Descriptions**: Provide helpful descriptions for users
6. **Version Management**: Follow semantic versioning for your plugin
7. **Service Efficiency**: Only include required services to minimize overhead
8. **Layout Considerations**: Set reasonable default sizes for your modules

## Example: Complete Transformation

Here's a complete example showing the transformation from PluginTemplate to a hypothetical "TaskManager" plugin:

```python
class TaskManagerLifecycleManager(BaseLifecycleManager):
    """Lifecycle manager for TaskManager plugin using new architecture"""
    
    def __init__(self, plugins_base_dir: str = None):
        """Initialize the lifecycle manager"""
        self.plugin_data = {
            "name": "TaskManager",
            "description": "A comprehensive task management plugin for BrainDrive",
            "version": "1.0.0",
            "type": "frontend",
            "icon": "CheckSquare",
            "category": "productivity",
            "official": False,
            "author": "Your Name",
            "compatibility": "1.0.0",
            "scope": "TaskManager",
            "bundle_method": "webpack",
            "bundle_location": "dist/remoteEntry.js",
            "is_local": False,
            "long_description": "A full-featured task management system with project organization, due dates, priorities, and team collaboration features.",
            "plugin_slug": "TaskManager",
            "source_type": "github",
            "source_url": "https://github.com/YourUsername/TaskManager",
            "update_check_url": "https://api.github.com/repos/YourUsername/TaskManager/releases/latest",
            "last_update_check": None,
            "update_available": False,
            "latest_version": None,
            "installation_type": "remote",
            "permissions": ["storage.read", "storage.write", "api.access", "event.send"]
        }
        
        self.module_data = [
            {
                "name": "TaskList",
                "display_name": "Task List",
                "description": "View and manage your tasks",
                "icon": "List",
                "category": "productivity",
                "priority": 1,
                "props": {
                    "title": "My Tasks",
                    "config": {
                        "showCompleted": False,
                        "sortBy": "dueDate",
                        "groupBy": "project"
                    }
                },
                "config_fields": {
                    "show_completed": {
                        "type": "boolean",
                        "description": "Show completed tasks",
                        "default": False
                    },
                    "sort_by": {
                        "type": "select",
                        "description": "Sort tasks by",
                        "default": "dueDate",
                        "options": ["dueDate", "priority", "created", "alphabetical"]
                    }
                },
                "required_services": {
                    "api": {"methods": ["get", "post", "put", "delete"], "version": "1.0.0"},
                    "storage": {"methods": ["get", "set"], "version": "1.0.0"}
                },
                "layout": {
                    "minWidth": 4,
                    "minHeight": 4,
                    "defaultWidth": 6,
                    "defaultHeight": 6
                },
                "tags": ["tasks", "productivity", "list"]
            },
            {
                "name": "TaskCalendar",
                "display_name": "Task Calendar",
                "description": "Calendar view of your tasks and deadlines",
                "icon": "Calendar",
                "category": "productivity",
                "priority": 2,
                "props": {
                    "title": "Task Calendar",
                    "config": {
                        "view": "month",
                        "showWeekends": True
                    }
                },
                "config_fields": {
                    "default_view": {
                        "type": "select",
                        "description": "Default calendar view",
                        "default": "month",
                        "options": ["week", "month", "year"]
                    }
                },
                "required_services": {
                    "api": {"methods": ["get"], "version": "1.0.0"}
                },
                "layout": {
                    "minWidth": 6,
                    "minHeight": 4,
                    "defaultWidth": 8,
                    "defaultHeight": 6
                },
                "tags": ["tasks", "calendar", "schedule"]
            }
        ]
        
        # Initialize base class...
```

This guide provides a comprehensive walkthrough for customizing the lifecycle manager. Remember to test your changes thoroughly and validate that all required files and configurations are in place before deploying your plugin.