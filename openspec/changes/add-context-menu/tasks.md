## 1. Context Menu Foundation

-   [x] 1.1 Create `src/context-menu/` with typed `ContextMenu` and `ContextMenuItem` classes, FAST templates and registrations, command values, reflected open/disabled state, item slots, and menu/menuitem semantics; verify `npm run build` emits the public declarations and representative authored markup compiles.
-   [x] 1.2 Implement direct menu-item discovery, disabled-state synchronization, dynamic-content refresh, separator compatibility with `vscode-divider`, and legal tab stops for empty and populated menus; verify enabled, disabled, added, and removed items expose the required roles and ARIA state.

## 2. Popup Lifecycle and Interaction

-   [x] 2.1 Implement `showAt()`, `showFor()`, and `hide()` with invoker tracking, return-value validation, reflected open state, and the single-open-menu invariant; verify pointer coordinates, element anchors, invalid invokers, repeated opens, and switching between two menus produce the specified state.
-   [x] 2.2 Implement fixed viewport placement with deferred measurement, preferred right/down positioning, axis flipping, final clamping, viewport margins, and constrained overflow; verify menus opened at every viewport corner and beside a keyboard invoker remain visible at narrow dimensions.
-   [x] 2.3 Implement initial focus and roving Arrow Up, Arrow Down, Home, and End navigation with wrapping and disabled-item skipping; verify keyboard focus order for mixed, all-disabled, and dynamically changed item sets.
-   [x] 2.4 Implement Enter, Space, and primary-click command activation plus bubbling composed `menu-select` and `open-change` events; verify each activation emits exactly one event containing the item, value, and invoker before the menu closes.
-   [x] 2.5 Implement Escape, Tab, outside-pointer, blur, resize, and capture-phase scroll dismissal with reliable listener cleanup and optional focus restoration; verify every close path restores a connected invoker by default, tolerates a removed invoker, and leaves no active dismissal listener after disconnect.

## 3. Visual Design and Accessibility

-   [x] 3.1 Add the required VS Code-backed menu design tokens with fallbacks to existing toolkit colors; verify each token maps to the intended `--vscode-menu-*` variable and renders a usable fallback when the host variable is absent.
-   [x] 3.2 Add compact menu and item styles for surface, border, shadow, leading content, labels, shortcuts, selection, focus, disabled state, separators, constrained overflow, and forced colors; verify the menu remains readable and focus remains visible with Storybook dark, light, and high-contrast theme data.
-   [x] 3.3 Audit keyboard and accessibility behavior for pointer-opened, keyboard-opened, empty, all-disabled, and grouped menus; verify the rendered accessibility tree, focus entry, navigation, activation, dismissal, and focus restoration match the context-menu spec.

## 4. Toolkit Integration and Documentation

-   [x] 4.1 Export both component classes, registrations, option types, and event detail types from the context-menu module and package root; verify package-root imports resolve during `npm run build`.
-   [x] 4.2 Register both components in `src/custom-elements.ts` and `allComponents`; verify the rollup bundle defines `vscode-context-menu` and `vscode-context-menu-item` when the complete collection is registered.
-   [x] 4.3 Add typed `VSCodeContextMenu` and `VSCodeContextMenuItem` wrappers with public event mappings to `src/react/index.ts`; verify generated React declarations expose wrappers and event callback details without unsafe public casts.
-   [x] 4.4 Add `src/context-menu/README.md` documenting markup, root-level placement, attributes, properties, slots, methods, events, pointer and keyboard trigger handling, keyboard behavior, accessibility, and initial non-goals; verify examples use only public APIs and include focus-restoration guidance.

## 5. Storybook Integrations

-   [x] 5.1 Add a dedicated context-menu example to `stories/TreeView.stories.js` with delegated item resolution and Copy, Move, and Delete commands; verify right-clicking an unselected item establishes a single contextual selection while right-clicking an item in an existing multiple selection preserves that set.
-   [x] 5.2 Refactor File Explorer resource creation to accept an explicit stable folder path without changing toolbar behavior; verify toolbar-created resources still target the selected folder or file parent and retain deterministic names and focus.
-   [x] 5.3 Integrate a root-mounted context menu into `stories/FileExplorer.stories.js` with New File, New Folder, and Find in Folder; verify folders target themselves, files target their parents, whitespace targets the workspace root, rerenders preserve the path context, and read-only mode disables only mutation commands.
-   [x] 5.4 Add narrowly scoped story styles and accessible status feedback for context-menu demonstrations; verify the menu is not clipped by the Explorer shell, command outcomes are announced, and no story reaches into component shadow roots or invokes real clipboard, filesystem, move, delete, or search services.

## 6. Validation

-   [x] 6.1 Run `npm run fmt`, `npm run lint`, and `npm run build`; fix change-related failures and verify TypeScript and API Extractor accept the complete public surface.
-   [x] 6.2 Run `npm run build-storybook` and manually exercise every context-menu, Tree View, and File Explorer scenario in the built Storybook, including keyboard-only, viewport-edge, read-only, and high-contrast behavior.
-   [x] 6.3 Review the final diff for unrelated changes and backward compatibility, then run `openspec validate add-context-menu --strict` and verify the change passes strict validation.
