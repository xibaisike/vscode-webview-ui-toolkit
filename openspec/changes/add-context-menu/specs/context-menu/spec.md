## Purpose

Provides accessible, themeable popup command menus that webview authors can open for a contextual target without coupling presentation to application-specific actions.

## ADDED Requirements

### Requirement: Composable menu content

The toolkit SHALL provide context-menu and context-menu-item custom elements that expose menu and menuitem semantics for consumer-provided commands. Menu items SHALL support a command value, disabled state, visible label, optional leading content, and optional shortcut text, and the menu SHALL permit separators between command groups.

#### Scenario: Consumer defines grouped commands

- **WHEN** a consumer places enabled and disabled context-menu items with a separator in a context menu
- **THEN** the commands and separator expose their corresponding menu, menuitem, disabled, and separator semantics

#### Scenario: Consumer provides item adornments

- **WHEN** a context-menu item contains leading content or shortcut text
- **THEN** the item displays those adornments without changing its accessible command label

### Requirement: Programmatic contextual opening

The context menu SHALL support opening at viewport coordinates for pointer invocation and opening relative to an invoker element for keyboard invocation. Opening SHALL retain the invoker as command context and SHALL replace any previously open context menu.

#### Scenario: Pointer opens a menu

- **WHEN** a consumer requests the menu to open at pointer coordinates for an invoker
- **THEN** the menu opens near those coordinates and records the invoker as its command context

#### Scenario: Keyboard opens a menu

- **WHEN** a consumer requests the menu to open for a focused invoker without pointer coordinates
- **THEN** the menu opens adjacent to the invoker and records it as its command context

#### Scenario: Another context menu is open

- **WHEN** a context menu opens while another toolkit context menu is open
- **THEN** the previously open menu closes before the requested menu becomes active

### Requirement: Viewport-aware placement

The context menu SHALL remain within the visible viewport when its dimensions fit in the viewport, preferring placement below and to the right of its requested anchor and flipping or clamping when necessary.

#### Scenario: Space is available at the preferred position

- **WHEN** a menu opens with enough space below and to the right of its anchor
- **THEN** the menu is positioned below and to the right without touching the viewport edge

#### Scenario: Preferred position would overflow

- **WHEN** the preferred menu position would cross a viewport edge
- **THEN** the menu flips or shifts on the affected axis so its visible bounds remain inside the viewport

### Requirement: Menu keyboard interaction

An open context menu SHALL move focus among enabled menu items using Arrow Up, Arrow Down, Home, and End; SHALL invoke the focused item with Enter or Space; and SHALL close on Escape or Tab. Disabled items and separators SHALL not receive focus or be invoked.

#### Scenario: Menu receives initial focus

- **WHEN** a menu containing at least one enabled item opens
- **THEN** focus moves to its first enabled item

#### Scenario: User navigates commands

- **WHEN** the user presses Arrow Up, Arrow Down, Home, or End in an open menu
- **THEN** focus moves according to the command order, wraps for arrow navigation, and skips disabled items and separators

#### Scenario: User invokes a focused command

- **WHEN** the user presses Enter or Space on an enabled focused item
- **THEN** the menu emits one command-selection event and closes

#### Scenario: User leaves or cancels the menu

- **WHEN** the user presses Escape or Tab in an open menu
- **THEN** the menu closes without selecting a command

### Requirement: Pointer interaction and dismissal

The context menu SHALL invoke enabled items on primary activation and SHALL dismiss without invocation when the user interacts outside it, the window loses focus, the viewport changes size, or a containing document scroll occurs.

#### Scenario: User clicks a command

- **WHEN** the user primary-clicks an enabled context-menu item
- **THEN** the menu emits one command-selection event for that item and closes

#### Scenario: User clicks a disabled command

- **WHEN** the user primary-clicks a disabled context-menu item
- **THEN** the menu remains open and emits no command-selection event

#### Scenario: External interaction dismisses the menu

- **WHEN** an open menu observes an outside pointer interaction, window blur, viewport resize, or document scroll
- **THEN** the menu closes without selecting a command

### Requirement: Command and lifecycle events

Selecting a command SHALL emit a bubbling, composed event containing the selected item, its command value, and the invoker. Opening and closing SHALL emit a bubbling, composed state-change event that identifies the resulting open state.

#### Scenario: Consumer handles a command

- **WHEN** an enabled menu item is selected
- **THEN** the consumer receives the selected item, command value, and original invoker across component shadow boundaries

#### Scenario: Menu visibility changes

- **WHEN** the menu opens or closes
- **THEN** the consumer receives the resulting open state after the visible state has changed

### Requirement: Focus restoration

Closing by command selection, cancellation, or dismissal SHALL restore focus to the invoker when it remains connected and focus restoration was not explicitly suppressed.

#### Scenario: Menu closes normally

- **WHEN** an open menu closes and its invoker remains connected
- **THEN** focus returns to the invoker

#### Scenario: Invoker is unavailable

- **WHEN** an open menu closes after its invoker was removed
- **THEN** the menu closes without throwing and does not move focus to a disconnected element

### Requirement: VS Code visual integration

The context menu SHALL use VS Code theme variables through toolkit design tokens and SHALL provide compact command rows, menu borders and shadows, hover, focus, disabled, separator, and high-contrast states without requiring consumer CSS.

#### Scenario: Host theme variables change

- **WHEN** the host supplies supported VS Code menu theme variables
- **THEN** the menu surface, command states, border, foreground, and separator reflect those values

#### Scenario: High-contrast theme is active

- **WHEN** forced-colors mode or a supported high-contrast theme is active
- **THEN** the menu boundary and focused command remain visibly distinguishable

### Requirement: Tree View context actions

The Tree View example SHALL demonstrate right-click context commands for Copy, Move, and Delete while preserving the distinction between selection, expansion, invocation, and command execution.

#### Scenario: Unselected item is targeted

- **WHEN** a user opens the context menu on an enabled unselected tree item
- **THEN** that item becomes the contextual selection and the menu offers Copy, Move, and Delete

#### Scenario: Existing multiple selection is targeted

- **WHEN** a user opens the context menu on an item already included in a multiple selection
- **THEN** the existing selection is preserved so the contextual command can apply to the selected set

### Requirement: File Explorer context actions

The File Explorer example SHALL offer New File, New Folder, and Find in Folder for the resolved folder context. A folder SHALL target itself, a file SHALL target its parent folder, and Explorer whitespace SHALL target the workspace root.

#### Scenario: Folder is targeted

- **WHEN** a user opens the context menu on a folder
- **THEN** creation and find commands target that folder

#### Scenario: File is targeted

- **WHEN** a user opens the context menu on a file
- **THEN** creation and find commands target the file's parent folder

#### Scenario: Explorer whitespace is targeted

- **WHEN** a user opens the context menu on Explorer whitespace
- **THEN** creation and find commands target the workspace root

#### Scenario: Explorer is read-only

- **WHEN** the read-only Explorer example opens its context menu
- **THEN** New File and New Folder are disabled while Find in Folder remains available

### Requirement: Toolkit distribution integration

Context-menu components SHALL be available through the toolkit's standard module exports, complete custom-element registration collection, and React wrapper package with typed public events.

#### Scenario: Register all components

- **WHEN** a consumer registers the toolkit's complete component collection
- **THEN** the context-menu and context-menu-item custom elements are registered

#### Scenario: Use React wrappers

- **WHEN** a React consumer imports the toolkit React entry point
- **THEN** typed wrappers for both context-menu components and their public events are available
