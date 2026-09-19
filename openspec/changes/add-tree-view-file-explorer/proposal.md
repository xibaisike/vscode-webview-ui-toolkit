## Why

The toolkit does not provide an accessible hierarchical navigation primitive, so extension authors cannot compose VS Code-like trees or file explorers without rebuilding selection, expansion, keyboard navigation, and theming behavior. Adding a reusable tree foundation and a mock File Explorer demonstrates the intended composition while keeping filesystem concerns outside the component library.

## What Changes

-   Add `vscode-tree-view` and `vscode-tree-item` Web Components for accessible hierarchical content.
-   Support single and multiple selection, expansion, roving focus, standard tree keyboard navigation, type-ahead, and item invocation.
-   Add VS Code-aligned tree styling and design tokens, including selection, focus, hover, indentation, disclosure, and high-contrast states.
-   Export and register the components through the toolkit's standard JavaScript and React entry points.
-   Add component documentation and Storybook coverage.
-   Add an interactive File Explorer Storybook example backed by mock data, including workspace actions, nested files and folders, selection feedback, and mock mutations.

## Capabilities

### New Capabilities

-   `tree-view`: Accessible, themeable tree-view and tree-item primitives with selection, expansion, focus, and keyboard interaction.
-   `file-explorer-demo`: A VS Code-like File Explorer demonstration composed from toolkit primitives and mock data.

### Modified Capabilities

None.

## Impact

-   Adds new public custom elements, TypeScript classes and event types, component registrations, and React wrappers.
-   Extends the design-token surface with tree/list states mapped to VS Code theme variables.
-   Adds a new source module, README, and Storybook stories/styles.
-   Does not add runtime dependencies or integrate with the VS Code filesystem API.
