## Context

The toolkit uses FAST Element and FAST Foundation composition, centralized custom-element registration, React wrappers, VS Code-backed design tokens, component READMEs, and browser-focused Storybook examples. FAST Foundation in the installed version does not provide a context-menu primitive suitable for reuse.

Tree View owns hierarchical focus and selection through direct light-DOM `vscode-tree-item` descendants. Wrapping tree items with trigger elements would invalidate that ownership model. The File Explorer is a Storybook composition backed by an in-memory resource model, not a toolkit filesystem component, and its shell clips overflowing descendants.

## Goals / Non-Goals

**Goals:**

- Provide reusable popup and command-item primitives independent of Tree View and filesystem concepts.
- Centralize menu semantics, focus, placement, dismissal, and event behavior while leaving trigger resolution and commands to consumers.
- Work with pointer and keyboard context-menu triggers.
- Preserve the toolkit's existing registration, React, theming, documentation, and story conventions.
- Keep story integrations deterministic and based only on public component APIs.

**Non-Goals:**

- Nested submenus or menu bars.
- Checkbox, radio, or dynamically resolved command types.
- A declarative trigger wrapper or selector-based trigger binding.
- Keybinding lookup, command registry integration, or VS Code extension command execution.
- Filesystem, clipboard, move-dialog, delete-confirmation, or search implementation.
- Automatic portal ownership or arbitrary cross-document positioning.

## Decisions

### Add a compound context-menu component family

Create sibling `ContextMenu` and `ContextMenuItem` classes in `src/context-menu/`. Consumers author items inside one reusable menu and may place `vscode-divider` elements with separator semantics between groups.

The menu host owns popup behavior and coordinated focus. Each item owns reflected command metadata and its row presentation. This follows the compound pattern used by Tree View without imposing an application command model.

A single component receiving an array of command objects was rejected because it would constrain item rendering and make framework-neutral slots, icons, shortcuts, and dynamic disabled states less natural.

### Use direct FAST Element composition

Implement both classes with FAST Element/FoundationElement attributes, observables, templates, and styles rather than adapting Dropdown or Option. Dropdown exposes listbox and option semantics for choosing a value in a form; context menus require transient menu semantics, focus restoration, coordinate placement, and command activation.

No runtime dependency is added. The installed platform and FAST utilities are sufficient for event delegation, lifecycle, and reactive rendering.

### Keep trigger resolution consumer-owned

Expose `showAt(x, y, options)` for pointer coordinates and `showFor(invoker, options)` for keyboard invocation. Both record an `HTMLElement` invoker; `showFor` derives its anchor from the invoker's bounding rectangle. Expose `hide(options)` for explicit closure and an `open` reflected state for observation.

The menu does not wrap, query, or subscribe to a trigger. Consumers handle `contextmenu`, Shift+F10, or the ContextMenu key and resolve the relevant domain target. This avoids breaking Tree View's direct-child structure and supports event-delegated integrations where item elements are rerendered.

The options shape allows focus restoration to be suppressed for transitions where the consumer immediately moves focus elsewhere. Invalid or disconnected invokers are rejected by returning `false`; opening methods otherwise return `true` after scheduling placement.

### Position a document-level fixed popup

The menu uses `position: fixed` and viewport coordinates. It is visually hidden while opening, measured after layout, then placed with a small viewport margin. It prefers right/down placement, flips left/up when the opposite side has more room, and finally clamps each axis. Its maximum dimensions fit the viewport and overflow scrolls within the menu.

Consumers place the menu outside clipping containers, normally as a sibling near the document or story root. The File Explorer story follows this rule because its shell uses `overflow: hidden`.

The Popover API was not chosen for the initial version because toolkit consumers can run across VS Code/Electron versions with differing support and the repository's TypeScript DOM library version may not model it. Automatic reparenting was rejected because moving a custom element can disrupt framework ownership and styling context.

### Coordinate a single open menu

Maintain the currently open toolkit menu in module scope. Opening one menu closes the previous menu before activating the new one. The reference is cleared on close or disconnect.

This matches native context-menu expectations and prevents overlapping focus scopes. A document-wide registry was rejected as unnecessary for a single-active-instance invariant.

### Use delegated item discovery and roving focus

The context menu discovers direct `vscode-context-menu-item` children in authored order, excluding nested menus if they are introduced later. Enabled items participate in a roving `tabindex`; disabled items expose `aria-disabled`, remain visible, and are skipped.

On open, focus moves to the first enabled item. Arrow Up and Arrow Down wrap through enabled items; Home and End move to boundaries; Enter and Space invoke. The menu remains focusable when it has no enabled items so Escape and Tab can still dismiss it.

Type-ahead is omitted initially because command labels are short and the requested VS Code interaction is covered by directional navigation. It can be added compatibly later.

### Emit command and lifecycle events

Activating an enabled item dispatches a bubbling, composed `menu-select` custom event with `{ item, value, invoker }`, then closes the menu. Opening and closing dispatch `open-change` with `{ open }`.

Event details contain element references and a string value rather than application payloads. Consumers can map values to commands while retaining the invoker for contextual data. The menu does not catch consumer exceptions or synthesize success; execution occurs after the event leaves the component.

### Dismiss predictably and restore focus

While open, the menu listens for outside pointer activation, capture-phase scroll, window blur, and viewport resize. Escape closes and restores focus. Tab closes and allows normal focus traversal rather than trapping focus. Command selection and pointer dismissal restore focus by default when the invoker remains connected; consumers may suppress restoration through `hide`.

Listeners are attached only while open and removed on close or disconnect. Opening interaction is protected from immediately triggering outside dismissal by installing global listeners after the current event turn.

### Use VS Code menu tokens with resilient fallbacks

Add design tokens backed by `--vscode-menu-background`, `--vscode-menu-foreground`, `--vscode-menu-selectionBackground`, `--vscode-menu-selectionForeground`, `--vscode-menu-border`, and `--vscode-menu-separatorBackground`. Fall back to existing editor, foreground, list selection, contrast, and panel colors where host values are absent.

Rows use compact VS Code-like dimensions, with slots for leading content, default label, and shortcut text. Focus, hover, disabled, separators, constrained overflow, and forced-colors behavior are component-owned.

### Integrate all distribution surfaces

Export both classes, registrations, options, and event types from the new module and root package. Add registrations to `allComponents` and typed wrappers to the React entry point. Document attributes, properties, methods, slots, events, keyboard behavior, positioning requirements, and accessible trigger handling in the component README.

### Add story integrations without domain coupling

Tree View receives a dedicated context-menu story. Delegated event handling resolves the nearest enabled tree item from the composed path. Right-clicking an unselected item makes it the sole contextual selection; right-clicking an already selected item in multiple mode preserves the current set. Copy, Move, and Delete update an accessible status region to demonstrate command context without pretending to perform application operations.

File Explorer mounts one menu outside the clipping shell. It stores a stable contextual folder path, not a tree-item reference, so rerenders do not invalidate command context. A folder targets itself, a file targets its parent, and whitespace targets the workspace root. New File and New Folder reuse a refactored creation helper with an explicit target path; Find in Folder reports the target in the status region. Mutation commands are disabled in the read-only story.

## Risks / Trade-offs

- **[Fixed positioning can be affected by transformed ancestors or clipping containers]** -> Document root-level placement and demonstrate it by mounting story menus outside the Explorer shell.
- **[Measurement causes a brief intermediate layout]** -> Keep the menu hidden until placement completes in the next rendering step.
- **[Global dismissal listeners can leak or close on the opening event]** -> Attach only while open, defer attachment past the opening turn, and remove listeners on every close and disconnect path.
- **[Element references in event details can become disconnected after consumer rerenders]** -> Treat the invoker as immediate command context and use stable application identifiers, as the File Explorer story does.
- **[Right-click selection conventions vary in multi-select trees]** -> Encode VS Code-like preservation only when the targeted item is already selected; otherwise establish a single contextual selection.
- **[No automatic portal means consumers can mount the menu incorrectly]** -> Make placement requirements prominent in documentation and keep programmatic trigger APIs independent of DOM ancestry.

## Migration Plan

This is an additive capability with no existing consumers to migrate. Add the new components and registrations, then update stories to consume them. Rollback consists of removing the new module, registrations, exports, tokens, wrappers, documentation, and story integrations without changing existing Tree View APIs.
