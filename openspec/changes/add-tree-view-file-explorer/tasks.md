## 1. Tree Component Foundation

- [x] 1.1 Create the `src/tree-view/` module with typed `TreeView` and `TreeItem` public APIs, FAST registrations, event detail interfaces, and declarative templates; verify TypeScript accepts representative nested markup and public declarations are emitted by `npm run build`.
- [x] 1.2 Implement direct-child discovery, parent relationships, expansion state, descendant visibility, and synchronized tree/treeitem/group ARIA metadata; verify nested, leaf, collapsed, dynamically added, and dynamically removed items expose the states required by the tree-view spec.
- [x] 1.3 Implement roving focus and Arrow Up, Arrow Down, Arrow Left, Arrow Right, Home, End, and printable-character type-ahead navigation; verify each keyboard scenario in the tree-view spec manually in Storybook with disabled items skipped.
- [x] 1.4 Implement single selection, modifier and range multiple selection, Space handling, leaf invocation, parent toggling, and composed typed custom events; verify pointer, keyboard, disabled-item, disclosure-only, and action-slot interactions produce exactly the expected state and events.
- [x] 1.5 Implement `focusItem()`, `expandAll()`, and `collapseAll()` with containment validation and focus fallback; verify collapsing an ancestor of the focused item leaves focus on a visible valid item.

## 2. Visual Design and Accessibility

- [x] 2.1 Add only the required VS Code-backed tree/list design tokens to `src/design-tokens.ts`; verify each token maps to an existing VS Code theme variable and has a usable fallback.
- [x] 2.2 Add tree-view and tree-item styles for 22-pixel rows, indentation, disclosure, content slots, truncation, hover, active/inactive selection, focus, disabled state, and high contrast; verify the component remains readable with the Storybook dark, light, and high-contrast theme data.
- [x] 2.3 Audit the rendered accessibility tree and keyboard tab order for empty, single-select, multi-select, nested, collapsed, and all-disabled trees; verify there is one roving tab stop when items are available and the tree container remains reachable otherwise.

## 3. Toolkit Integration and Documentation

- [x] 3.1 Export both component classes, registrations, selection mode, and event detail types from `src/index.ts`; verify imports resolve from the package root during `npm run build`.
- [x] 3.2 Register both components in `src/custom-elements.ts` and `allComponents`; verify the rollup bundle defines `vscode-tree-view` and `vscode-tree-item` when all components are registered.
- [x] 3.3 Add typed `VSCodeTreeView` and `VSCodeTreeItem` wrappers and custom-event mappings to `src/react/index.ts`; verify the React declaration build exposes the wrappers and event callback types without unsafe public casts.
- [x] 3.4 Add `src/tree-view/README.md` documenting markup, attributes, properties, slots, methods, events, selection modes, keyboard behavior, accessibility, and the moderate-tree-size limitation; verify examples use only public APIs.

## 4. Mock File Explorer

- [x] 4.1 Add a deterministic in-memory workspace model and recursive story renderer in `stories/FileExplorer.stories.js`; verify the initial story shows nested files and folders, initial expansion, icons, selection, and selected-path feedback without VS Code APIs.
- [x] 4.2 Add accessible New File, New Folder, Refresh, and Collapse All icon-button actions; verify creations use unique deterministic names, target the selected folder or root, reveal/select the new item, Refresh restores the initial model, and Collapse All preserves valid focus.
- [x] 4.3 Add a multiple-selection/read-only story and narrowly scoped File Explorer styles in `stories/storybook.css`; verify modifier selection, range selection, disabled resources, long-name truncation, and narrow explorer widths.
- [x] 4.4 Exercise the File Explorer entirely through tree public APIs and events; verify no story code reaches into either component's shadow root or imports filesystem, workspace, or extension-host APIs.

## 5. Validation

- [x] 5.1 Run `npm run fmt`, `npm run lint`, and `npm run build`; fix change-related failures and verify API Extractor accepts the new public surface.
- [x] 5.2 Run `npm run build-storybook` and manually exercise every tree-view and file-explorer spec scenario in the built Storybook, including keyboard-only and high-contrast checks.
- [x] 5.3 Review the final diff to confirm existing component behavior and unrelated in-progress code-editor changes remain untouched, then run `openspec validate add-tree-view-file-explorer --strict`.
