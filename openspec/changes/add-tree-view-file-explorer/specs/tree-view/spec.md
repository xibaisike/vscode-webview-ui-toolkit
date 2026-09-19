## Purpose

Provides accessible and themeable hierarchical navigation primitives that extension authors can compose for file trees, outlines, and similar VS Code webview interfaces.

## ADDED Requirements

### Requirement: Tree structure and semantics

The toolkit SHALL provide tree-view and tree-item custom elements that expose WAI-ARIA tree semantics for nested consumer-provided content. The tree SHALL identify each visible item as a tree item, identify nested item containers as groups, and expose item level, position, set size, expansion, selection, and disabled state where applicable.

#### Scenario: Nested tree is rendered

-   **WHEN** a consumer nests tree items inside a parent tree item
-   **THEN** the tree exposes the parent and descendants with the correct tree, treeitem, group, level, position, and set-size semantics

#### Scenario: Leaf item is rendered

-   **WHEN** a tree item contains no child tree items
-   **THEN** the item is exposed as a leaf and does not expose an expandable state

### Requirement: Item expansion

A parent tree item SHALL support collapsed and expanded states. Activating its disclosure control or using the applicable keyboard command SHALL toggle its state without invoking the item. Collapsed descendants SHALL be hidden from navigation and accessibility APIs.

#### Scenario: Disclosure toggles a folder

-   **WHEN** a user activates the disclosure control of a collapsed parent item
-   **THEN** the parent becomes expanded, its direct children become available, and an expansion-change event identifies the item and new state

#### Scenario: Leaf disclosure is unavailable

-   **WHEN** a tree item has no children
-   **THEN** no interactive disclosure control is presented

### Requirement: Roving keyboard focus

The tree SHALL maintain one keyboard-focusable visible item at a time and SHALL support standard tree navigation with Arrow Up, Arrow Down, Arrow Left, Arrow Right, Home, and End.

#### Scenario: Vertical navigation

-   **WHEN** focus is on a visible item and the user presses Arrow Down or Arrow Up
-   **THEN** focus moves to the next or previous visible enabled item without leaving the tree

#### Scenario: Right arrow navigation

-   **WHEN** focus is on a collapsed parent and the user presses Arrow Right
-   **THEN** the item expands
-   **WHEN** the same item is already expanded and the user presses Arrow Right
-   **THEN** focus moves to its first visible child

#### Scenario: Left arrow navigation

-   **WHEN** focus is on an expanded parent and the user presses Arrow Left
-   **THEN** the item collapses
-   **WHEN** focus is on a collapsed item or leaf and the user presses Arrow Left
-   **THEN** focus moves to its parent item when one exists

#### Scenario: Boundary navigation

-   **WHEN** the user presses Home or End
-   **THEN** focus moves to the first or last visible enabled item

### Requirement: Type-ahead navigation

The tree SHALL support printable-character type-ahead using item text labels and SHALL clear the accumulated search after a short idle interval.

#### Scenario: Matching item is focused

-   **WHEN** the focused user types characters that prefix a visible enabled item's label
-   **THEN** focus moves to the next matching item, wrapping after the last visible item

### Requirement: Selection modes

The tree SHALL support `single` and `multiple` selection modes, defaulting to single selection. Selection changes SHALL update item semantics and emit a selection-change event containing the selected items.

#### Scenario: Single selection

-   **WHEN** a user selects an enabled item in single-selection mode
-   **THEN** that item becomes the sole selected item and the tree emits one selection-change event

#### Scenario: Toggle multiple selection

-   **WHEN** a user uses the platform modifier to select an enabled item in multiple-selection mode
-   **THEN** that item's selection is toggled without clearing the other selected items

#### Scenario: Range selection

-   **WHEN** a user extends selection with Shift in multiple-selection mode
-   **THEN** all visible enabled items from the selection anchor through the target are selected

### Requirement: Item invocation

The tree SHALL distinguish item invocation from selection and expansion. Enter or a primary double-click on an enabled leaf SHALL emit an item-invoke event that identifies the item.

#### Scenario: Invoke a file-like item

-   **WHEN** an enabled leaf has focus and the user presses Enter
-   **THEN** the tree emits an item-invoke event for that item

#### Scenario: Disabled item

-   **WHEN** an item is disabled
-   **THEN** it cannot be focused through tree navigation, selected, expanded by user interaction, or invoked

### Requirement: Programmatic tree control

The tree SHALL expose public operations to focus a contained item, expand all parent items, and collapse all parent items while preserving valid focus and selection state.

#### Scenario: Collapse all

-   **WHEN** a consumer requests collapse-all
-   **THEN** every parent item collapses and focus moves to a visible ancestor if the previously focused item is hidden

### Requirement: VS Code visual integration

Tree components SHALL use VS Code theme variables through toolkit design tokens and SHALL provide visible hover, selected, focused, disabled, disclosure, and high-contrast states without requiring consumer CSS.

#### Scenario: Theme variables change

-   **WHEN** the host supplies supported VS Code list and tree theme variables
-   **THEN** the tree states and indentation guides render using those values

#### Scenario: Consumer supplies item content

-   **WHEN** a consumer provides leading icon, label, description, or trailing action content
-   **THEN** the row lays out that content within a 22-pixel VS Code-style row and truncates overflowing label content

### Requirement: Toolkit distribution integration

Tree components SHALL be available through the toolkit's standard module exports, custom-element registration collection, and React wrapper package.

#### Scenario: Register all components

-   **WHEN** a consumer registers the toolkit's complete component collection
-   **THEN** the tree-view and tree-item custom elements are registered

#### Scenario: Use React wrappers

-   **WHEN** a React consumer imports the toolkit React entry point
-   **THEN** typed wrappers for both tree components and their public events are available
