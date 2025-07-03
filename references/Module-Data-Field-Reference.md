# BrainDrive Module Data Field Reference

This document provides comprehensive information about each field in the `module_data` array used in BrainDrive plugin lifecycle managers. This reference is designed for developers of all skill levels who are creating plugins for the BrainDrive platform.

## Overview

The `module_data` array in your `lifecycle_manager.py` file defines the individual modules (components) that your plugin provides. Each module represents a distinct piece of functionality that users can add to their BrainDrive pages. A single plugin can contain multiple modules.

## Module Data Structure

Each module in the `module_data` array is a dictionary containing the following fields:

## Field Reference

### Core Module Information

#### `name` (string, required)
- **Purpose**: Internal identifier for the module, used in code and database references
- **Database**: Stored in `plugin_module.name` column
- **Frontend Usage**: Used for component identification and loading
- **Example**: `"TaskManager"`, `"WeatherWidget"`
- **Best Practices**: 
  - Use PascalCase or camelCase
  - Should match your React component name
  - No spaces or special characters
  - Must be unique within the plugin

#### `display_name` (string, optional)
- **Purpose**: Human-readable name shown in the BrainDrive interface
- **Database**: Stored in `plugin_module.display_name` column
- **Frontend Usage**: Displayed in module cards, toolbars, and selection interfaces
- **Example**: `"Task Manager"`, `"Weather Widget"`
- **Best Practices**:
  - Use clear, descriptive names
  - Keep under 30 characters
  - Use proper capitalization and spacing
  - If omitted, `name` will be used for display

#### `description` (string, optional)
- **Purpose**: Brief description of what the module does
- **Database**: Stored in `plugin_module.description` column
- **Frontend Usage**: Shown in module cards, tooltips, and help text
- **Example**: `"Manage tasks and track project progress"`
- **Best Practices**:
  - Keep under 100 characters
  - Focus on the main functionality
  - Use clear, non-technical language
  - Explain the benefit to users

### Visual and Categorization

#### `icon` (string, optional)
- **Purpose**: Icon identifier for visual representation of the module
- **Database**: Stored in `plugin_module.icon` column
- **Frontend Usage**: Displayed in module cards, toolbars, and drag-and-drop interfaces
- **Example**: `"TaskAlt"`, `"Dashboard"`, `"Settings"`, `"CloudQueue"`
- **Best Practices**:
  - Use Material-UI icon names
  - Choose icons that represent the module's function
  - Test icon appearance in both light and dark themes
  - Consider how the icon looks at different sizes

#### `category` (string, optional)
- **Purpose**: Categorizes the module for organization and filtering
- **Database**: Stored in `plugin_module.category` column
- **Frontend Usage**: Used in module filters, grouping, and organization
- **Common Values**: `"productivity"`, `"communication"`, `"data"`, `"ai"`, `"utility"`, `"entertainment"`, `"visualization"`
- **Example**: `"productivity"`
- **Best Practices**:
  - Use lowercase, single words
  - Choose from established categories when possible
  - Consider how users would search for your module
  - Be consistent across modules in the same plugin

#### `tags` (array of strings, optional)
- **Purpose**: Keywords for search and discovery
- **Database**: Stored in `plugin_module.tags` column as JSON
- **Frontend Usage**: Used in search, filtering, and module discovery
- **Example**: `["task", "todo", "project", "management"]`
- **Best Practices**:
  - Use 3-8 relevant tags
  - Include synonyms and related terms
  - Use lowercase
  - Think about how users might search for your module

### Module Behavior

#### `priority` (integer, optional)
- **Purpose**: Determines the order of modules in lists and toolbars
- **Database**: Stored in `plugin_module.priority` column
- **Frontend Usage**: Used for sorting modules in interfaces
- **Example**: `1`, `5`, `10`
- **Default**: `0`
- **Best Practices**:
  - Higher numbers appear first
  - Use increments of 5 or 10 for easy reordering
  - Consider the importance and frequency of use
  - Primary modules should have higher priority

#### `dependencies` (array of strings, optional)
- **Purpose**: List of other modules this module depends on
- **Database**: Stored in `plugin_module.dependencies` column as JSON
- **Frontend Usage**: Used for dependency checking and loading order
- **Example**: `["BaseModule", "UtilityModule"]`
- **Best Practices**:
  - Only include direct dependencies
  - Use module names, not display names
  - Keep dependencies minimal
  - Document why dependencies are needed

### Configuration and Props

#### `props` (object, optional)
- **Purpose**: Default properties passed to the React component
- **Database**: Stored in `plugin_module.props` column as JSON
- **Frontend Usage**: Passed as props to your React component when instantiated
- **Example**: 
```python
"props": {
    "title": "My Module",
    "theme": "default",
    "config": {
        "autoRefresh": True,
        "refreshInterval": 30000
    }
}
```
- **Best Practices**:
  - Provide sensible defaults
  - Keep the structure flat when possible
  - Use camelCase for property names
  - Document complex nested structures

#### `config_fields` (object, optional)
- **Purpose**: Defines user-configurable settings for the module
- **Database**: Stored in `plugin_module.config_fields` column as JSON
- **Frontend Usage**: Used to generate configuration forms and validate settings
- **Structure**: Each field is defined with type, description, and default value
- **Example**:
```python
"config_fields": {
    "title": {
        "type": "text",
        "description": "Module title",
        "default": "My Module"
    },
    "refresh_interval": {
        "type": "number",
        "description": "Refresh interval in seconds",
        "default": 30,
        "min": 5,
        "max": 300
    },
    "enable_notifications": {
        "type": "boolean",
        "description": "Enable notifications",
        "default": True
    },
    "theme_color": {
        "type": "select",
        "description": "Theme color",
        "default": "blue",
        "options": [
            {"label": "Blue", "value": "blue"},
            {"label": "Green", "value": "green"},
            {"label": "Red", "value": "red"}
        ]
    }
}
```

##### Config Field Types:
- **`text`**: Text input field
  - Additional properties: `placeholder`, `maxLength`
- **`number`**: Numeric input field
  - Additional properties: `min`, `max`, `step`
- **`boolean`**: Checkbox or toggle
- **`select`**: Dropdown selection
  - Required property: `options` (array of {label, value} objects)
- **`textarea`**: Multi-line text input
  - Additional properties: `rows`, `maxLength`
- **`color`**: Color picker
- **`date`**: Date picker
- **`time`**: Time picker

### Service Integration

#### `required_services` (object, optional)
- **Purpose**: Defines which BrainDrive services the module needs
- **Database**: Stored in `plugin_module.required_services` column as JSON
- **Frontend Usage**: Used for service injection and capability checking
- **Example**:
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
    "event": {
        "methods": ["sendMessage", "subscribeToMessages"],
        "version": "1.0.0"
    },
    "pageContext": {
        "methods": ["getCurrentPageContext", "onPageContextChange"],
        "version": "1.0.0"
    }
}
```

##### Available Services:
- **`api`**: HTTP API service for backend communication
  - Methods: `get`, `post`, `put`, `delete`, `postStreaming`
- **`theme`**: Theme management service
  - Methods: `getCurrentTheme`, `addThemeChangeListener`, `removeThemeChangeListener`
- **`settings`**: User settings service
  - Methods: `getSetting`, `setSetting`, `getSettingDefinitions`
- **`event`**: Inter-module communication service
  - Methods: `sendMessage`, `subscribeToMessages`, `unsubscribeFromMessages`
- **`pageContext`**: Page context information service
  - Methods: `getCurrentPageContext`, `onPageContextChange`

### Layout and Grid System

#### `layout` (object, optional)
- **Purpose**: Defines how the module behaves in the BrainDrive grid system
- **Database**: Stored in `plugin_module.layout` column as JSON
- **Frontend Usage**: Used by the grid layout system for sizing and constraints
- **Example**:
```python
"layout": {
    "minWidth": 4,
    "minHeight": 3,
    "defaultWidth": 6,
    "defaultHeight": 4,
    "maxWidth": 12,
    "maxHeight": 8
}
```

##### Layout Properties:
- **`minWidth`** (integer): Minimum grid columns (1-12)
- **`minHeight`** (integer): Minimum grid rows
- **`defaultWidth`** (integer): Default grid columns when added to page
- **`defaultHeight`** (integer): Default grid rows when added to page
- **`maxWidth`** (integer): Maximum grid columns (optional)
- **`maxHeight`** (integer): Maximum grid rows (optional)

##### Grid System Notes:
- BrainDrive uses a 12-column grid system
- Each grid unit represents a responsive column
- Height units are relative to the row height setting
- Mobile layouts may use fewer columns automatically

### Communication and Messaging

#### `messages` (object, optional)
- **Purpose**: Defines message schemas for inter-module communication
- **Database**: Stored in `plugin_module.messages` column as JSON
- **Frontend Usage**: Used for message validation and documentation
- **Example**:
```python
"messages": {
    "sends": [
        {
            "type": "task_created",
            "description": "Sent when a new task is created",
            "contentSchema": {
                "type": "object",
                "properties": {
                    "taskId": {"type": "string", "description": "Unique task identifier"},
                    "title": {"type": "string", "description": "Task title"},
                    "priority": {"type": "string", "description": "Task priority level"}
                }
            }
        }
    ],
    "receives": [
        {
            "type": "task_update",
            "description": "Receives task update notifications",
            "contentSchema": {
                "type": "object",
                "properties": {
                    "taskId": {"type": "string", "description": "Task identifier"},
                    "status": {"type": "string", "description": "New task status"}
                }
            }
        }
    ]
}
```

## Complete Module Example

Here's a comprehensive example of a module definition:

```python
{
    "name": "TaskManager",
    "display_name": "Task Manager",
    "description": "Manage tasks and track project progress",
    "icon": "TaskAlt",
    "category": "productivity",
    "priority": 10,
    "props": {
        "title": "My Tasks",
        "showCompleted": False,
        "maxTasks": 50
    },
    "config_fields": {
        "title": {
            "type": "text",
            "description": "Widget title",
            "default": "My Tasks"
        },
        "show_completed": {
            "type": "boolean",
            "description": "Show completed tasks",
            "default": False
        },
        "max_tasks": {
            "type": "number",
            "description": "Maximum number of tasks to display",
            "default": 50,
            "min": 10,
            "max": 200
        },
        "priority_filter": {
            "type": "select",
            "description": "Filter by priority",
            "default": "all",
            "options": [
                {"label": "All", "value": "all"},
                {"label": "High", "value": "high"},
                {"label": "Medium", "value": "medium"},
                {"label": "Low", "value": "low"}
            ]
        }
    },
    "messages": {
        "sends": [
            {
                "type": "task_created",
                "description": "Sent when a new task is created",
                "contentSchema": {
                    "type": "object",
                    "properties": {
                        "taskId": {"type": "string"},
                        "title": {"type": "string"},
                        "priority": {"type": "string"}
                    }
                }
            }
        ],
        "receives": []
    },
    "required_services": {
        "api": {"methods": ["get", "post", "put", "delete"], "version": "1.0.0"},
        "theme": {"methods": ["getCurrentTheme", "addThemeChangeListener"], "version": "1.0.0"},
        "settings": {"methods": ["getSetting", "setSetting"], "version": "1.0.0"},
        "event": {"methods": ["sendMessage", "subscribeToMessages"], "version": "1.0.0"}
    },
    "dependencies": [],
    "layout": {
        "minWidth": 4,
        "minHeight": 4,
        "defaultWidth": 6,
        "defaultHeight": 6,
        "maxWidth": 12
    },
    "tags": ["task", "todo", "productivity", "project", "management"]
}
```

## Multiple Modules in One Plugin

A plugin can contain multiple modules. Here's an example:

```python
self.module_data = [
    {
        "name": "TaskList",
        "display_name": "Task List",
        "description": "Display and manage tasks",
        "icon": "List",
        "category": "productivity",
        "priority": 10,
        # ... other fields
    },
    {
        "name": "TaskCalendar",
        "display_name": "Task Calendar",
        "description": "View tasks in calendar format",
        "icon": "CalendarToday",
        "category": "productivity",
        "priority": 8,
        # ... other fields
    },
    {
        "name": "TaskStats",
        "display_name": "Task Statistics",
        "description": "View task completion statistics",
        "icon": "BarChart",
        "category": "analytics",
        "priority": 5,
        # ... other fields
    }
]
```

## Field Validation and Requirements

### Required Fields
- `name` - Must be unique within the plugin

### Optional Fields
All other fields are optional, but recommended for better user experience:
- `display_name` - Improves user interface
- `description` - Helps users understand the module
- `icon` - Provides visual identification
- `category` - Enables filtering and organization
- `layout` - Ensures proper grid behavior

### Best Practices for Field Combinations

1. **Always provide display_name and description** for user-facing modules
2. **Include layout constraints** to ensure proper grid behavior
3. **Define config_fields** for any user-customizable behavior
4. **Specify required_services** for any BrainDrive service usage
5. **Use appropriate icons and categories** for discoverability

## Common Patterns

### Simple Widget Module
```python
{
    "name": "SimpleWidget",
    "display_name": "Simple Widget",
    "description": "A basic widget example",
    "icon": "Widgets",
    "category": "utility",
    "layout": {
        "minWidth": 2,
        "minHeight": 2,
        "defaultWidth": 4,
        "defaultHeight": 3
    }
}
```

### Data Visualization Module
```python
{
    "name": "ChartWidget",
    "display_name": "Data Chart",
    "description": "Display data in chart format",
    "icon": "BarChart",
    "category": "visualization",
    "required_services": {
        "api": {"methods": ["get"], "version": "1.0.0"},
        "theme": {"methods": ["getCurrentTheme"], "version": "1.0.0"}
    },
    "layout": {
        "minWidth": 6,
        "minHeight": 4,
        "defaultWidth": 8,
        "defaultHeight": 6
    }
}
```

### Communication Module
```python
{
    "name": "ChatWidget",
    "display_name": "Chat",
    "description": "Real-time chat interface",
    "icon": "Chat",
    "category": "communication",
    "required_services": {
        "api": {"methods": ["get", "post"], "version": "1.0.0"},
        "event": {"methods": ["sendMessage", "subscribeToMessages"], "version": "1.0.0"}
    },
    "messages": {
        "sends": [
            {
                "type": "message_sent",
                "description": "Sent when user sends a message"
            }
        ],
        "receives": [
            {
                "type": "message_received",
                "description": "Receives incoming messages"
            }
        ]
    }
}
```

## Troubleshooting Common Issues

### Module Not Appearing in Interface
- Check that `name` is unique within the plugin
- Verify `display_name` is set for user-facing modules
- Ensure the module is properly added to `module_data` array

### Layout Issues
- Verify `layout` constraints are reasonable
- Check that `minWidth` and `minHeight` are not too large
- Ensure `defaultWidth` and `defaultHeight` fit within grid

### Configuration Not Working
- Verify `config_fields` syntax is correct
- Check that field types are supported
- Ensure default values match the field type

### Service Integration Problems
- Check that `required_services` lists only needed services
- Verify service method names are correct
- Ensure version requirements are compatible

## Related Documentation

- [Plugin Data Field Reference](./Plugin-Data-Field-Reference.md)
- [Plugin Template Development Guide](../PluginBuild/PluginTemplate/DEVELOPMENT.md)
- [BrainDrive Service Integration Guide](./Service-Integration-Guide.md) *(coming soon)*

---

This reference document helps ensure your plugin modules integrate properly with the BrainDrive ecosystem and provide the best experience for users.