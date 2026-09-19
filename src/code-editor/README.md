# Visual Studio Code Code Editor

The `vscode-code-editor` component is a CodeMirror-based code editor for Visual Studio Code webviews.

## Usage

Use the code editor when users need to edit structured or multi-line code-like content inside a webview.

## Implementation

### Attributes

| Attribute         | Type    | Description                                                                 |
| ----------------- | ------- | --------------------------------------------------------------------------- |
| `disabled`        | boolean | Prevents editing and removes the editor from the tab order.                 |
| `lang`            | string  | Enables syntax highlighting for `c`, `c++`, `javascript`, or `typescript`. |
| `line-wrapping`   | boolean | Wraps long lines instead of requiring horizontal scrolling.                 |
| `placeholder`     | string  | Displays helper text while the editor has no content.                       |
| `readonly`        | boolean | Allows selection and focus, but prevents editing.                           |
| `rows`            | number  | Sets the approximate minimum number of visible lines. Defaults to `8`.      |
| `value`           | string  | Sets the editor content.                                                    |

### Properties

| Property      | Type        | Description                                                                 |
| ------------- | ----------- | --------------------------------------------------------------------------- |
| `extensions`  | `Extension[]` | Adds additional CodeMirror extensions such as language support or custom behavior. |

`extensions` is a JavaScript/TypeScript property only and cannot be set as an HTML attribute.

### Basic Code Editor

```html
<vscode-code-editor rows="12" value="const answer = 42;">
  Source Code
</vscode-code-editor>
```

### Placeholder

```html
<vscode-code-editor placeholder="Start typing code..."></vscode-code-editor>
```

### Read Only

```html
<vscode-code-editor readonly value="const answer = 42;"></vscode-code-editor>
```

### Syntax Highlighting

Set `lang` to enable built-in syntax highlighting for C/C++, JavaScript, or TypeScript.

```html
<vscode-code-editor
  lang="typescript"
  value="const answer: number = 42;"
></vscode-code-editor>
```

### Adding CodeMirror Extensions

```ts
import {javascript} from '@codemirror/lang-javascript';

const editor = document.querySelector('vscode-code-editor');
editor.extensions = [javascript()];
```
