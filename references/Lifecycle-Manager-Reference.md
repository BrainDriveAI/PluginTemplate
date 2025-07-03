# BrainDrive Plugin Lifecycle Manager Reference

This document provides a comprehensive reference for the `lifecycle_manager.py` script used in BrainDrive plugins. It describes what the lifecycle manager does and provides clear descriptions of each function to help new and experienced developers understand and work with the BrainDrive plugin system.

## Overview

The **lifecycle manager** is the core component responsible for managing the complete lifecycle of a BrainDrive plugin. It handles installation, updates, deletion, validation, and health monitoring for plugins in the BrainDrive system.

### What the Lifecycle Manager Does

- **Plugin Installation**: Sets up plugins for individual users with proper file management and database records
- **Plugin Updates**: Migrates plugins to new versions while preserving user data and configurations
- **Plugin Deletion**: Cleanly removes plugins and their associated data from the system
- **Validation**: Ensures plugins are properly configured and all required files are present
- **Health Monitoring**: Checks plugin status and integrity for troubleshooting

### Architecture

The lifecycle manager uses a **multi-user architecture** where:
- Plugin files are stored once in shared storage (`backend/plugins/shared/`)
- Each user gets their own database records and configurations
- Users can independently install/uninstall plugins
- Updates benefit all users automatically

---

## Function Reference

### Class: PluginTemplateLifecycleManager

#### Initialization and Configuration

##### `__init__(plugins_base_dir: str = None)`
**Purpose**: Initializes the lifecycle manager with plugin configuration and sets up shared storage paths.
- Sets up plugin metadata (`self.plugin_data`) and module definitions (`self.module_data`)
- Resolves the correct shared storage path for different deployment scenarios
- Initializes the base class with required parameters

##### `get_plugin_metadata() -> Dict[str, Any]`
**Purpose**: Returns the complete plugin metadata configuration.
- Provides all plugin information needed for registration and management
- Used by the BrainDrive system during plugin discovery and installation
- Returns the `self.plugin_data` dictionary with all plugin details

##### `get_module_metadata() -> List[Dict[str, Any]]`
**Purpose**: Returns the list of module definitions provided by this plugin.
- Provides information about all components/modules the plugin offers
- Used during installation to register available modules with the system
- Returns the `self.module_data` array with module configurations

##### `get_plugin_info() -> Dict[str, Any]`
**Purpose**: Legacy compatibility method that returns plugin information.
- Provides backward compatibility with older plugin interfaces
- Simply returns the plugin metadata for compatibility

---

#### Core Lifecycle Operations

##### `install_plugin(user_id: str, db: AsyncSession) -> Dict[str, Any]`
**Purpose**: Installs the plugin for a specific user, including file copying and database record creation.
- Checks if plugin already exists for the user
- Creates shared storage directory and copies plugin files
- Creates database records for both plugin and modules
- Verifies installation success and provides detailed results
- Returns success/failure status with plugin ID and created modules

##### `delete_plugin(user_id: str, db: AsyncSession) -> Dict[str, Any]`
**Purpose**: Removes the plugin installation for a specific user.
- Verifies plugin exists for the user before deletion
- Removes module records first (due to foreign key constraints)
- Removes plugin record from database
- Provides cleanup verification and detailed results
- Returns success/failure status with deletion details

##### `get_plugin_status(user_id: str, db: AsyncSession) -> Dict[str, Any]`
**Purpose**: Checks the current installation status and health of the plugin for a user.
- Verifies if plugin exists in database for the user
- Performs health checks on plugin files and configuration
- Checks bundle file existence, package.json validity, and assets
- Returns comprehensive status including health details
- Used for plugin management interfaces and troubleshooting

##### `update_plugin(user_id: str, db: AsyncSession, new_version_manager) -> Dict[str, Any]`
**Purpose**: Updates the plugin to a new version while preserving user data and configurations.
- Exports current user data and configurations before update
- Uninstalls current version cleanly
- Installs new version using the new version manager
- Imports preserved user data to maintain settings
- Provides migration results with version information

---

#### Internal Implementation Functions

##### `_perform_user_installation(user_id: str, db: AsyncSession, shared_plugin_path: Path) -> Dict[str, Any]`
**Purpose**: Core installation logic called by the base class framework.
- Creates database records for the specific user
- Handles transaction management and error reporting
- Called internally during the installation process
- Provides detailed success/failure information

##### `_perform_user_uninstallation(user_id: str, db: AsyncSession) -> Dict[str, Any]`
**Purpose**: Core uninstallation logic called by the base class framework.
- Verifies plugin existence before attempting deletion
- Handles cascading deletion of modules and plugin records
- Called internally during the deletion process
- Provides cleanup verification and error handling

##### `_check_existing_plugin(user_id: str, db: AsyncSession) -> Dict[str, Any]`
**Purpose**: Checks if a plugin is already installed for a specific user.
- Performs database connectivity testing
- Queries for existing plugin records for the user
- Provides detailed plugin information if found
- Includes debugging information for troubleshooting
- Used before installation and during status checks

---

#### File Management Functions

##### `_copy_plugin_files_impl(user_id: str, target_dir: Path, update: bool = False) -> Dict[str, Any]`
**Purpose**: Copies plugin files from source to target directory with intelligent filtering.
- Recursively copies all plugin files to shared storage
- Excludes development files (node_modules, .git, etc.) using predefined patterns
- Handles directory creation automatically
- Supports update mode (removes existing files first)
- Provides detailed logging and file list of copied items

##### `_validate_installation_impl(user_id: str, plugin_dir: Path) -> Dict[str, Any]`
**Purpose**: Validates that a plugin installation is complete and correct.
- Checks for required files (package.json, dist/remoteEntry.js)
- Validates package.json structure and required fields
- Ensures bundle file exists and is not empty
- Verifies file permissions and accessibility
- Called after file copying to ensure installation integrity

##### `_get_plugin_health_impl(user_id: str, plugin_dir: Path) -> Dict[str, Any]`
**Purpose**: Performs comprehensive health checks on an installed plugin.
- Checks bundle file existence and size
- Validates package.json format and content
- Verifies assets directory presence
- Determines overall plugin health status
- Used for status monitoring and troubleshooting

---

#### Database Management Functions

##### `_create_database_records(user_id: str, db: AsyncSession) -> Dict[str, Any]`
**Purpose**: Creates plugin and module records in the database for a specific user.
- Inserts main plugin record with all metadata fields
- Creates individual module records for each defined module
- Handles transaction management to ensure atomicity
- Provides verification of successful record creation
- Returns plugin ID and list of created module IDs

##### `_delete_database_records(user_id: str, plugin_id: str, db: AsyncSession) -> Dict[str, Any]`
**Purpose**: Removes plugin and module records from the database.
- Deletes module records first (foreign key constraint requirement)
- Removes main plugin record after modules are deleted
- Handles transaction rollback on errors
- Verifies successful deletion of records
- Returns count of deleted modules and success status

##### `_export_user_data(user_id: str, db: AsyncSession) -> Dict[str, Any]`
**Purpose**: Exports user-specific configuration data for migration during updates.
- Retrieves current plugin configuration and settings
- Exports module-specific configurations and priorities
- Preserves user customizations and enabled states
- Creates timestamped export for migration tracking
- Used before plugin updates to preserve user data

##### `_import_user_data(user_id: str, db: AsyncSession, user_data: Dict[str, Any])`
**Purpose**: Imports previously exported user data after plugin update.
- Restores plugin-level configuration settings
- Applies module-specific configurations and priorities
- Handles missing or invalid data gracefully
- Updates database records with preserved settings
- Called after new version installation during updates

---

## Standalone Compatibility Functions

These functions provide compatibility with remote installers and legacy interfaces:

##### `install_plugin(user_id: str, db: AsyncSession, plugins_base_dir: str = None) -> Dict[str, Any]`
**Purpose**: Standalone function for plugin installation.
- Creates a lifecycle manager instance and calls the install method
- Provides compatibility with remote installation systems

##### `delete_plugin(user_id: str, db: AsyncSession, plugins_base_dir: str = None) -> Dict[str, Any]`
**Purpose**: Standalone function for plugin deletion.
- Creates a lifecycle manager instance and calls the delete method
- Provides compatibility with remote installation systems

##### `get_plugin_status(user_id: str, db: AsyncSession, plugins_base_dir: str = None) -> Dict[str, Any]`
**Purpose**: Standalone function for plugin status checking.
- Creates a lifecycle manager instance and calls the status method
- Provides compatibility with remote installation systems

##### `update_plugin(user_id: str, db: AsyncSession, new_version_manager, plugins_base_dir: str = None) -> Dict[str, Any]`
**Purpose**: Standalone function for plugin updates.
- Creates lifecycle manager instances for old and new versions
- Handles the complete update process with data migration

---

## Key Data Structures

### Plugin Data (`self.plugin_data`)
Contains all plugin metadata including name, version, description, author, permissions, and technical configuration. See [Plugin Data Field Reference](./Plugin-Data-Field-Reference.md) for detailed field descriptions.

### Module Data (`self.module_data`)
Array of module definitions that describe the components your plugin provides. Each module includes display information, configuration options, service requirements, and layout constraints. See [Module Data Field Reference](./Module-Data-Field-Reference.md) for detailed field descriptions.

---

## Customization for Your Plugin

When creating your own plugin, you need to customize:

1. **Plugin Metadata** (lines 101-126): Update name, description, author, URLs, and permissions
2. **Module Definitions** (lines 129-249): Define your plugin's components and their configurations
3. **Source Information**: Update GitHub URLs for automatic updates
4. **Permissions**: Specify only the permissions your plugin actually needs

---

## Error Handling

All functions return standardized responses:
- **Success**: `{'success': True, ...additional data}`
- **Failure**: `{'success': False, 'error': 'descriptive message'}`

Common error scenarios include database connection issues, file permission problems, and duplicate installations. The lifecycle manager provides detailed error messages and logging for troubleshooting.

---

## Related Documentation

- [Plugin Data Field Reference](./Plugin-Data-Field-Reference.md) - Detailed plugin metadata field descriptions
- [Module Data Field Reference](./Module-Data-Field-Reference.md) - Detailed module configuration field descriptions

This reference provides the essential information needed to understand and work with the BrainDrive plugin lifecycle management system.