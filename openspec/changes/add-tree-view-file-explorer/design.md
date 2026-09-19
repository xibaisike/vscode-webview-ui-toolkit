## Context

The toolkit is built on FAST Element and FAST Foundation, but its installed FAST Foundation version has no tree primitive to compose. Existing components use separate source modules, FAST `compose` registrations, centralized custom-element and package exports, React wrappers, VS Code-backed design tokens, README documentation, and browser-focused Storybook examples.

VS Code's production Explorer layers filesystem services, an asynchronous compressible tree, rendering, filtering, sorting, commands, and view state. This change needs the observable tree interaction model without importing workbench-specific services or turning a component library into a file manager.

## Goals / Non-Goals

**Goals:**

-   Establish reusable, framework-neutral tree primitives suitable for file explorers, outlines, and navigation trees.
-   Follow the WAI-ARIA tree pattern and VS Code's 22-pixel interaction density.
-   Keep item content consumer-owned through slots while centralizing focus, selection, expansion, and keyboard behavior.
-   Preserve the toolkit's registration, React wrapping, theming, documentation, and Storybook conventions.
-   Make the mock Explorer exercise only public component APIs.

**Non-Goals:**

-   Virtualization or asynchronous child loading.
-   Filesystem access, editor integration, persistence, filtering, sorting, compact folders, decorations, context menus, inline rename, clipboard, or drag/drop.
-   Bundling a file-icon theme or codicon dependency.
-   Reproducing VS Code workbench internals or private APIs.

## Decisions

### Introduce a compound tree rather than a File Explorer component

Create sibling `TreeView` and `TreeItem` classes in one `src/tree-view/` module. Consumers author nested `vscode-tree-item` elements inside `vscode-tree-view`; the File Explorer exists only as a Storybook composition.

This keeps data ownership and domain actions outside the toolkit and makes the new API useful beyond files. A monolithic `vscode-file-explorer` was rejected because it would need opinions about resource models, loading, sorting, mutations, and VS Code APIs that do not belong in a base UI toolkit.

### Implement templates directly with FAST Element

Use FAST Element attributes, observables, templates, and styles rather than extending an unrelated FAST Foundation control. The tree owns coordination behavior; each item owns its row, disclosure, nested group, and reflected state.

Extending data-grid was rejected because grid semantics and navigation conflict with the ARIA tree pattern. Adding a new dependency was rejected because the required behavior is bounded and the repository already has the rendering/reactivity foundation.

### Keep the nested item model in light DOM

Consumer-provided tree items remain descendants in light DOM. Each item template exposes slots for row content and a child group, allowing authored nesting to stay queryable by the coordinating tree. Items identify direct child items by walking assigned elements rather than treating all descendants as siblings.

The public content contract provides `start`, default, `description`, and `actions` slots. Icons remain slotted content so consumers can use product icons, file themes, text, or custom SVG without a runtime icon package.

Flattened data passed through a single `items` property was rejected for the first release because it forces a data schema, complicates custom row content, and does not provide meaningful virtualization at this scope.

### Centralize interaction in the tree

`TreeView` maintains the ordered set of visible enabled items, active item, selection anchor, and type-ahead buffer. Event delegation on the host handles click, double-click, and keyboard input even when items are added dynamically.

`TreeItem` reflects `expanded`, `selected`, and `disabled` attributes and provides internal methods for disclosure and ARIA synchronization. It emits a bubbling expansion signal; the tree translates user-facing changes into stable typed custom events.

The tree uses roving `tabindex`: one visible enabled item has `tabindex=\"0\"`; all others have `-1`. When a mutation or collapse hides the active item, focus falls back to the nearest visible ancestor, then the first visible enabled item.

### Follow standard tree selection and activation

`selection-mode` accepts `single` or `multiple` and defaults to `single`.

-   Plain primary click selects and focuses an item.
-   Ctrl/Cmd-click toggles an item in multiple mode.
-   Shift-click selects the visible range from the anchor in multiple mode.
-   Space changes selection.
-   Enter invokes leaves; on parents it toggles expansion.
-   Double-click invokes leaves and toggles parents.
-   Disclosure activation only changes expansion.

Selection and invocation remain distinct so consumers can preview selection without opening a resource. Events are bubbling and composed so wrappers and host applications can observe them across shadow boundaries. Event details contain item element references and selected-item snapshots rather than an imposed resource model.

### Derive visibility and accessibility metadata from authored structure

On connection and relevant slot changes, the tree computes direct sibling sets and updates `aria-level`, `aria-posinset`, and `aria-setsize`. Descendants of collapsed parents are excluded from the visible navigation order and hidden by the item's group container.

Disabled items retain their position metadata but are skipped by focus and selection operations. An empty or all-disabled tree remains focusable at the tree container so it does not create an unreachable keyboard region.

A fully consumer-managed ARIA model was rejected because it would duplicate the hardest correctness work for every usage.

### Use public methods for aggregate operations

Expose `focusItem(item)`, `expandAll()`, and `collapseAll()` on `TreeView`. Methods validate that the target belongs to the tree and preserve a legal active item. No data mutation API is added; consumers mutate authored child elements and the tree responds to slot changes.

This is sufficient for the mock toolbar and leaves later asynchronous/virtualized APIs unconstrained.

### Extend VS Code-backed design tokens

Add tokens for inactive selection background/foreground, focused selection border, tree indent guide, and hover foreground where existing list tokens are insufficient. Styles use existing foreground, focus, active selection, hover, and contrast tokens first.

Rows remain 22 pixels high with an indentation step controlled by an internal CSS custom property. The component provides state styling and layout; consumers control icon color and resource-specific decoration.

### Integrate every supported package surface

The two registrations are added to the root exports, `allComponents`, rollup entry through existing exports, and React entry point. React wrappers map `selection-change`, `item-invoke`, and `expanded-change` to typed callback properties. The module README documents declarative markup, properties, events, methods, slots, keyboard behavior, and accessibility.

### Build the Explorer story from deterministic in-memory data

Story code owns a typed-in-document mock hierarchy and a renderer that creates nested tree items. Toolbar handlers mutate a fresh in-memory model and rerender, preserving selection by stable path where appropriate. Refresh recreates the original model rather than pretending to perform I/O.

Inline SVG icons are limited to the story. New resources use deterministic counters so interactions and screenshots remain reproducible.

## Risks / Trade-offs

-   **[Large authored trees render every item]** -> Document that the initial primitive targets moderate webview trees and keep the API open for a future virtualized component.
-   **[Shadow DOM and slotted nesting can make ownership ambiguous]** -> Resolve direct children explicitly and test nested, dynamically added, and removed items.
-   **[Keyboard behavior can drift from ARIA expectations]** -> Encode each navigation and selection rule as browser-level Storybook interaction coverage where existing infrastructure permits, plus manual accessibility checks.
-   **[Consumer interactive content in action slots can trigger row selection]** -> Stop row handling when an event originates from the actions slot while preserving native control activation.
-   **[React custom-event typing may be constrained by the older wrapper library]** -> Follow existing wrapper patterns and export event detail interfaces from the core module; avoid unsafe casts in the public API.
-   **[New tokens increase public API surface]** -> Add only states that cannot be represented by existing tokens and map every new token to an established VS Code theme variable.
-   **[Rerendering the mock story can obscure component-state bugs]** -> Exercise expand/collapse and selection directly through component state; rerender only for mock data mutations.

## Migration Plan

This is additive and requires no consumer migration. Registering `allComponents` will additionally define the two new custom elements. Rollback consists of removing the new module and its registrations, wrappers, tokens, docs, and stories; existing components and APIs are unaffected.
