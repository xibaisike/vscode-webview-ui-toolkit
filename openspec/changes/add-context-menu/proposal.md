## Why

Webview authors currently have no toolkit primitive for presenting VS Code-styled commands at the pointer or focused element, forcing each integration to recreate popup positioning, dismissal, focus, and accessibility behavior. A reusable context menu is needed so hierarchical interfaces such as the Tree View and File Explorer stories can offer familiar right-click actions without coupling the toolkit to filesystem operations.

## What Changes

- Add composable context-menu and context-menu-item custom elements with VS Code visual styling.
- Support pointer and keyboard opening, viewport-aware positioning, roving keyboard focus, command selection, and standard dismissal behavior.
- Keep trigger resolution and command execution consumer-owned through a programmatic menu API and typed events.
- Expose the components through standard custom-element registration, package exports, and React wrappers.
- Add documentation and Storybook examples, including Tree View actions for Copy, Move, and Delete.
- Extend the File Explorer story with contextual New File, New Folder, and Find in Folder actions for folders, files, and Explorer whitespace.
- Exclude nested submenus, checkbox/radio menu items, command keybinding resolution, and real filesystem or search integration from the initial capability.

## Capabilities

### New Capabilities

- `context-menu`: Accessible, themeable context menu primitives, popup lifecycle, placement, command events, and integration behavior.

### Modified Capabilities

None.

## Impact

- Adds a new `src/context-menu/` component module, public API, styles, and documentation.
- Updates root exports, complete component registration, React wrappers, design tokens, and generated API/build surfaces.
- Updates Tree View and File Explorer Storybook examples and shared story styling.
- Introduces no new runtime dependency and no breaking changes to existing component APIs.
