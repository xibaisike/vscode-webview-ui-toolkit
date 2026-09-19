# Visual Studio Code Tree View

The `vscode-tree-view` and `vscode-tree-item` components provide accessible hierarchical navigation for Visual Studio Code webviews.

Use them for moderate-sized, fully rendered trees such as file explorers, outlines, and navigation lists. The components do not virtualize items or load children asynchronously.

## Usage

```html
<vscode-tree-view aria-label="Project files">
  <vscode-tree-item expanded>
    src
    <span slot="start" aria-hidden="true">📁</span>
    <vscode-tree-item label="index.ts">
      index.ts
      <span slot="start" aria-hidden="true">📄</span>
    </vscode-tree-item>
  </vscode-tree-item>
</vscode-tree-view>
```

Nested `vscode-tree-item` elements are automatically assigned to their parent's child group. Set `label` when the visible content contains more than the item name so type-ahead navigation has an unambiguous label.

## Tree View

### Attributes

| Attribute        | Type                   | Default  | Description                                         |
| ---------------- | ---------------------- | -------- | --------------------------------------------------- |
| `selection-mode` | `single` or `multiple` | `single` | Controls whether one or many items can be selected. |

### Properties

| Property        | Type                | Description                           |
| --------------- | ------------------- | ------------------------------------- |
| `selectedItems` | `TreeItem[]`        | Returns the currently selected items. |
| `selectionMode` | `TreeSelectionMode` | Reflects `selection-mode`.            |

### Methods

| Method            | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `focusItem(item)` | Focuses a visible enabled item and reports whether it succeeded. |
| `expandAll()`     | Expands every enabled parent item.                               |
| `collapseAll()`   | Collapses every enabled parent and preserves valid focus.        |
| `refresh()`       | Recomputes structure, accessibility metadata, and focus state.   |

### Events

| Event              | Detail                          | Description                         |
| ------------------ | ------------------------------- | ----------------------------------- |
| `selection-change` | `{ selectedItems: TreeItem[] }` | Fires after user selection changes. |
| `item-invoke`      | `{ item: TreeItem }`            | Fires when a leaf is invoked.       |

## Tree Item

### Attributes

| Attribute  | Type    | Description                                                    |
| ---------- | ------- | -------------------------------------------------------------- |
| `disabled` | boolean | Prevents user focus, selection, expansion, and invocation.     |
| `expanded` | boolean | Shows the direct child group when the item contains children.  |
| `label`    | string  | Supplies the type-ahead label when visible content is complex. |
| `selected` | boolean | Reflects whether the item is selected.                         |

### Slots

| Slot          | Description                                        |
| ------------- | -------------------------------------------------- |
| default       | The primary item label.                            |
| `start`       | A leading file, folder, or product icon.           |
| `description` | Secondary text displayed after the label.          |
| `actions`     | Trailing interactive actions shown on hover/focus. |

Child tree items are moved to the internal `children` slot automatically. The `children` slot is reserved for nested `vscode-tree-item` elements.

### Events

| Event             | Detail                                  | Description                         |
| ----------------- | --------------------------------------- | ----------------------------------- |
| `expanded-change` | `{ item: TreeItem, expanded: boolean }` | Fires when expansion state changes. |

## Keyboard Interaction

| Key                       | Behavior                                                       |
| ------------------------- | -------------------------------------------------------------- |
| Arrow Up / Arrow Down     | Moves focus through visible enabled items.                     |
| Arrow Right               | Expands a parent or moves to its first enabled child.          |
| Arrow Left                | Collapses a parent or moves to its parent.                     |
| Home / End                | Moves to the first or last visible enabled item.               |
| Space                     | Selects the focused item.                                      |
| Enter                     | Toggles a parent or invokes a leaf.                            |
| Printable characters      | Moves to the next item whose label starts with the typed text. |
| Ctrl/Cmd + click or Space | Toggles selection in multiple-selection mode.                  |
| Shift + click or Space    | Extends selection in multiple-selection mode.                  |

## Accessibility

Provide an accessible name on `vscode-tree-view` with `aria-label` or `aria-labelledby`. The components maintain tree, treeitem, and group roles; hierarchy metadata; expansion and selection states; and a single roving item tab stop. Empty and all-disabled trees keep the tree container in the tab order.
