## Purpose

Demonstrates how toolkit primitives can compose a VS Code-like File Explorer with realistic interactions while remaining independent of filesystem and extension-host APIs.

## ADDED Requirements

### Requirement: Mock workspace hierarchy

Storybook SHALL include a File Explorer story that renders deterministic mock workspace data as nested folders and files using the tree components.

#### Scenario: Explorer opens

-   **WHEN** the File Explorer story is loaded
-   **THEN** it shows a named workspace with expanded and collapsed folders, files, file/folder icons, and a selected-path status area

### Requirement: Explorer interaction

The mock Explorer SHALL demonstrate pointer and keyboard expansion, focus, selection, and file invocation through the tree component's public API and events.

#### Scenario: File is invoked

-   **WHEN** a user invokes a mock file
-   **THEN** the selected-path status identifies that file without accessing a filesystem

#### Scenario: Folder is expanded

-   **WHEN** a user expands a mock folder
-   **THEN** its immediate children become visible and keyboard navigable

### Requirement: Explorer toolbar actions

The story SHALL provide New File, New Folder, Refresh, and Collapse All actions using existing toolkit icon buttons, each with an accessible label.

#### Scenario: Create mock file

-   **WHEN** a user activates New File with a folder selected
-   **THEN** a uniquely named mock file is added beneath that folder, the folder expands, and the new item becomes selected

#### Scenario: Create mock folder

-   **WHEN** a user activates New Folder
-   **THEN** a uniquely named mock folder is added beneath the selected folder or workspace root and becomes selected

#### Scenario: Refresh mock data

-   **WHEN** a user activates Refresh
-   **THEN** the original deterministic mock hierarchy and initial selection are restored

#### Scenario: Collapse the explorer

-   **WHEN** a user activates Collapse All
-   **THEN** all folders collapse while the tree retains valid visible focus

### Requirement: Selection variants

Storybook SHALL include coverage for both the default single-selection Explorer and a multiple-selection/read-only variant.

#### Scenario: Multiple-selection story

-   **WHEN** the multiple-selection story is loaded
-   **THEN** users can select non-contiguous and ranged sets of mock resources

#### Scenario: Read-only item

-   **WHEN** the selection variant includes a disabled mock resource
-   **THEN** its disabled state is visually and semantically apparent and it cannot be selected or invoked

### Requirement: Demonstration boundary

The File Explorer stories SHALL operate entirely on in-memory mock data and SHALL not import or call VS Code filesystem, workspace, or extension-host APIs.

#### Scenario: Story runs outside VS Code

-   **WHEN** Storybook runs in a standard browser
-   **THEN** all documented Explorer interactions function without a VS Code host
