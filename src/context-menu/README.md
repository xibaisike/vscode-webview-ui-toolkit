# Visual Studio Code Context Menu

The `vscode-context-menu` and `vscode-context-menu-item` components provide an accessible, themeable popup command menu that webview authors open against a contextual target without coupling presentation to any application command model.

The menu is purely presentational. It does not wrap or query a trigger element, run any command, or perform filesystem, clipboard, move, delete, or search operations. Consumers resolve the contextual target, call `showAt` or `showFor`, and listen for `menu-select` to dispatch their own commands.

## Usage

```html
<vscode-context-menu id="ctx" hidden>
  <vscode-context-menu-item value="copy">Copy</vscode-context-menu-item>
  <vscode-context-menu-item value="paste" disabled>Paste</vscode-context-menu-item>
  <vscode-divider role="separator"></vscode-divider>
  <vscode-context-menu-item value="delete">
    Delete
    <span slot="shortcut">⌫</span>
  </vscode-context-menu-item>
</vscode-context-menu>

<button id="trigger">Open menu</button>
<script type="module">
  const menu = document.getElementById("ctx");
  const trigger = document.getElementById("trigger");
  trigger.addEventListener("contextmenu", event => {
    event.preventDefault();
    menu.showAt(event.clientX, event.clientY, trigger);
  });
  menu.addEventListener("menu-select", event => {
    console.log("command:", event.detail.value);
  });
</script>
```

### Root-level placement

The menu uses fixed positioning relative to the viewport. Mount it as a sibling near the document or story root, outside of containers that clip overflow (`overflow: hidden`) or transform their descendants, so its coordinates are not affected by ancestor layouts.

## Context Menu

### Attributes

| Attribute   | Type                              | Default     | Description                                                  |
| ----------- | --------------------------------- | ----------- | ------------------------------------------------------------ |
| `open`      | boolean                           | `false`     | Reflects whether the menu is currently visible and measured. |
| `placement` | `'initial' \| 'above' \| 'below'` | `'initial'` | Reflects the resolved vertical placement after measurement.  |

### Slots

| Slot      | Description                                        |
| --------- | -------------------------------------------------- |
| (default) | The menu items and any separators inside the menu. |

### Methods

| Method                             | Description                                                                                                                                                |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `showAt(x, y, invoker?, options?)` | Opens the menu at the supplied viewport coordinates. Returns `false` if the coordinates are invalid or the invoker is disconnected, otherwise `true`.      |
| `showFor(invoker, options?)`       | Opens the menu anchored to the bottom-left of the supplied invoker's bounding rectangle. Returns `false` if the invoker is disconnected, otherwise `true`. |
| `hide(options?)`                   | Closes the menu. Honors `{ suppressFocusRestore: true }` to keep focus where it is.                                                                        |
| `activateItem(item)`               | Activates the supplied item and dispatches `menu-select`.                                                                                                  |

`ContextMenuOptions` accepts `{ suppressFocusRestore?: boolean }`. By default, closing the menu restores focus to the invoker when it remains connected.

### Events

| Event         | Detail                                                                   | Description                                                          |
| ------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `menu-select` | `{ item: ContextMenuItem, value: string, invoker: HTMLElement \| null }` | Fires once when an enabled item is activated by pointer or keyboard. |
| `open-change` | `{ open: boolean }`                                                      | Fires after the menu transitions between open and closed states.     |

Both events are `bubbles` and `composed`, so consumers can listen on a document-level ancestor.

## Context Menu Item

### Attributes

| Attribute  | Type    | Description                                                                         |
| ---------- | ------- | ----------------------------------------------------------------------------------- |
| `value`    | string  | The command value surfaced on `menu-select` and reflected to the `value` attribute. |
| `disabled` | boolean | Prevents the item from receiving focus or being invoked. Reflects `aria-disabled`.  |

### Slots

| Slot       | Description                                            |
| ---------- | ------------------------------------------------------ |
| (default)  | The accessible command label.                          |
| `start`    | Leading content such as an icon.                       |
| `shortcut` | Trailing shortcut hint such as a keyboard accelerator. |

`vscode-divider` elements placed directly inside the menu render as visual separators with `role="separator"`. Disabled items remain visible but are skipped by keyboard navigation.

## Trigger handling

The menu does not bind to a trigger element directly. Resolve the contextual target yourself, attach your own listeners (`contextmenu`, `Shift+F10`, the `ContextMenu` key, etc.), and call `showAt` or `showFor` with the resolved invoker.

```js
trigger.addEventListener("contextmenu", event => {
  event.preventDefault();
  menu.showAt(event.clientX, event.clientY, trigger);
});

trigger.addEventListener("keydown", event => {
  if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
    event.preventDefault();
    menu.showFor(trigger);
  }
});
```

## Keyboard interaction

| Key             | Behavior                                                |
| --------------- | ------------------------------------------------------- |
| Arrow Down / Up | Moves focus through enabled items with wrap-around.     |
| Home / End      | Moves focus to the first or last enabled item.          |
| Enter / Space   | Activates the focused enabled item and closes the menu. |
| Escape          | Closes the menu and restores focus to the invoker.      |
| Tab             | Closes the menu and continues normal focus traversal.   |

Disabled items and separators never receive focus. When the menu contains no enabled items the menu surface itself remains focusable so Escape and Tab can still dismiss it.

## Accessibility

The menu exposes `role="menu"` and items expose `role="menuitem"`. Disabled items expose `aria-disabled="true"`. The menu maintains a roving tabindex so keyboard users enter the menu once and navigate by arrow keys.

Focus is restored to the invoker by default whenever the menu closes via command selection, Escape, outside pointer, blur, resize, or scroll. Pass `{ suppressFocusRestore: true }` to either `showAt` / `showFor` or `hide` when focus is intentionally moving elsewhere.

## Initial non-goals

Nested submenus, checkbox / radio menu items, declarative trigger binding, keybinding lookup, and real filesystem / clipboard / search integration are not part of the initial capability.
