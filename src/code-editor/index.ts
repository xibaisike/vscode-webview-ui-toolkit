// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {EditorState, Extension} from '@codemirror/state';
import {EditorView, placeholder} from '@codemirror/view';
import {attr, FASTElement, html, observable, ref} from '@microsoft/fast-element';
import {basicSetup} from 'codemirror';
import {codeEditorStyles as styles} from './code-editor.styles.js';

export type {Extension} from '@codemirror/state';

const defaultEditorMinHeight = 160;
const defaultRows = 8;

const template = html<CodeEditor>`
	<label
		class="${x => (x.hasLabel ? 'label' : 'label label__hidden')}"
		part="label"
	>
		<slot @slotchange="${x => x.handleLabelChange()}"></slot>
	</label>
	<div ${ref('editorContainer')} class="editor" part="editor"></div>
`;

const theme = EditorView.theme(
	{
		'&': {
			backgroundColor: 'var(--vscode-input-background, #3c3c3c)',
			color: 'var(--vscode-input-foreground, #cccccc)',
			fontFamily:
				'var(--vscode-editor-font-family, var(--vscode-font-family, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif))',
			fontSize: 'var(--vscode-font-size, 13px)',
			height: '100%',
		},
		'&.cm-focused': {
			outline: 'none',
		},
		'.cm-scroller': {
			fontFamily:
				'var(--vscode-editor-font-family, var(--vscode-font-family, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif))',
			lineHeight: '1.5',
			overflow: 'auto',
		},
		'.cm-content': {
			caretColor: 'var(--vscode-editorCursor-foreground, #aeafad)',
			padding: '8px 0',
		},
		'.cm-line': {
			padding: '0 8px',
		},
		'.cm-gutters': {
			backgroundColor: 'var(--vscode-input-background, #3c3c3c)',
			color: 'var(--vscode-descriptionForeground, #858585)',
			border: 'none',
		},
		'.cm-activeLine': {
			backgroundColor:
				'var(--vscode-editor-lineHighlightBackground, rgba(255, 255, 255, 0.04))',
		},
		'.cm-activeLineGutter': {
			backgroundColor: 'transparent',
		},
		'.cm-cursor, .cm-dropCursor': {
			borderLeftColor: 'var(--vscode-editorCursor-foreground, #aeafad)',
		},
		'.cm-selectionBackground, ::selection': {
			backgroundColor:
				'var(--vscode-editor-selectionBackground, rgba(38, 79, 120, 0.48))',
		},
		'.cm-panels, .cm-tooltip': {
			backgroundColor: 'var(--vscode-editorWidget-background, #252526)',
			color: 'var(--vscode-foreground, #cccccc)',
			border: '1px solid var(--vscode-widget-border, #454545)',
		},
		'.cm-searchMatch': {
			backgroundColor:
				'var(--vscode-editor-findMatchHighlightBackground, rgba(234, 92, 0, 0.22))',
			outline: '1px solid var(--vscode-editor-findMatchBorder, transparent)',
		},
		'.cm-searchMatch.cm-searchMatch-selected': {
			backgroundColor: 'var(--vscode-editor-findMatchBackground, rgba(234, 92, 0, 0.33))',
		},
		'.cm-foldPlaceholder': {
			backgroundColor: 'transparent',
			border: '1px solid var(--vscode-panel-border, #80808059)',
			color: 'inherit',
		},
	},
	{dark: true}
);

/**
 * The Visual Studio Code code editor class.
 *
 * @remarks
 * HTML Element: `<vscode-code-editor>`
 *
 * @public
 */
export class CodeEditor extends FASTElement {
	@attr public value = '';
	@attr public placeholder = '';
	@attr public rows = String(defaultRows);
	@attr({attribute: 'line-wrapping', mode: 'boolean'}) public lineWrapping = false;
	@attr({mode: 'boolean'}) public readonly = false;
	@attr({mode: 'boolean'}) public disabled = false;
	@observable public hasLabel = false;

	public editorContainer!: HTMLDivElement;
	private editorView: EditorView | null = null;
	private pendingInitialization = false;
	private focusValue = this.value;
	private _extensions: Extension[] = [];

	public get extensions(): Extension[] {
		return this._extensions;
	}

	public set extensions(value: Extension[]) {
		this._extensions = Array.isArray(value) ? [...value] : [];
		if (this.$fastController.isConnected) {
			this.recreateEditor();
		}
	}

	public connectedCallback() {
		super.connectedCallback();
		this.handleLabelChange();
		this.initializeEditor();
	}

	public disconnectedCallback() {
		this.destroyEditor();
		super.disconnectedCallback();
	}

	public focus(options?: FocusOptions) {
		super.focus(options);
		this.editorView?.focus();
	}

	public handleLabelChange() {
		const labelText = this.textContent?.trim() ?? '';
		this.hasLabel = labelText.length > 0;
		if (this.editorView) {
			this.editorView.contentDOM.setAttribute('aria-label', this.getAriaLabel());
		}
	}

	public valueChanged(oldValue: string, newValue: string) {
		if (!this.editorView || oldValue === newValue) {
			return;
		}

		const editorValue = this.editorView.state.doc.toString();
		if (editorValue === newValue) {
			return;
		}

		this.editorView.dispatch({
			changes: {
				from: 0,
				to: editorValue.length,
				insert: newValue,
			},
		});
	}

	public placeholderChanged() {
		this.recreateEditor();
	}

	public rowsChanged() {
		this.updateEditorMinHeight();
	}

	public lineWrappingChanged() {
		this.recreateEditor();
	}

	public readonlyChanged() {
		this.recreateEditor();
	}

	public disabledChanged() {
		this.recreateEditor();
	}

	private initializeEditor() {
		if (this.editorView || this.pendingInitialization) {
			return;
		}

		if (!this.editorContainer) {
			this.pendingInitialization = true;
			queueMicrotask(() => {
				this.pendingInitialization = false;
				if (this.$fastController.isConnected) {
					this.initializeEditor();
				}
			});
			return;
		}

		this.editorView = new EditorView({
			state: EditorState.create({
				doc: this.value,
				extensions: this.getEditorExtensions(),
			}),
			parent: this.editorContainer,
		});

		this.focusValue = this.value;
		this.updateEditorMinHeight();
	}

	private recreateEditor() {
		if (!this.$fastController.isConnected) {
			return;
		}

		const currentValue = this.editorView?.state.doc.toString() ?? this.value;
		this.destroyEditor();
		this.value = currentValue;
		this.initializeEditor();
	}

	private destroyEditor() {
		this.editorView?.destroy();
		this.editorView = null;
	}

	private getEditorExtensions(): Extension[] {
		const extensions: Extension[] = [
			basicSetup,
			theme,
			EditorState.readOnly.of(this.disabled || this.readonly),
			EditorView.editable.of(!this.disabled && !this.readonly),
			EditorView.updateListener.of(update => {
				if (!update.docChanged) {
					return;
				}

				const nextValue = update.state.doc.toString();
				if (this.value !== nextValue) {
					this.value = nextValue;
				}

				this.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
			}),
			EditorView.domEventHandlers({
				focus: () => {
					this.focusValue = this.editorView?.state.doc.toString() ?? this.value;
					return false;
				},
				blur: () => {
					const nextValue = this.editorView?.state.doc.toString() ?? this.value;
					if (nextValue !== this.focusValue) {
						this.focusValue = nextValue;
						this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
					}
					return false;
				},
			}),
			EditorView.contentAttributes.of(this.getContentAttributes()),
		];

		if (this.lineWrapping) {
			extensions.push(EditorView.lineWrapping);
		}

		if (this.placeholder) {
			extensions.push(placeholder(this.placeholder));
		}

		if (this._extensions.length > 0) {
			extensions.push(...this._extensions);
		}

		return extensions;
	}

	private getContentAttributes(): {[key: string]: string} {
		const attributes: {[key: string]: string} = {
			'aria-label': this.getAriaLabel(),
			spellcheck: 'false',
		};

		if (this.disabled) {
			attributes['aria-disabled'] = 'true';
			attributes.tabindex = '-1';
		}

		return attributes;
	}

	private getAriaLabel(): string {
		return this.textContent?.trim() || 'Code editor';
	}

	private updateEditorMinHeight() {
		const minHeight = `${this.getMinHeight()}px`;
		if (this.editorContainer) {
			this.editorContainer.style.minHeight = minHeight;
		}
		if (this.editorView) {
			this.editorView.dom.style.minHeight = minHeight;
		}
	}

	private getMinHeight(): number {
		const parsedRows = Number.parseInt(this.rows, 10);
		if (Number.isNaN(parsedRows) || parsedRows < 1) {
			return defaultEditorMinHeight;
		}

		return parsedRows * 20;
	}
}

/**
 * The Visual Studio Code code editor component registration.
 *
 * @remarks
 * HTML Element: `<vscode-code-editor>`
 *
 * @public
 */
export const vsCodeCodeEditor = CodeEditor.compose({
	baseName: 'code-editor',
	template,
	styles,
	shadowOptions: {
		delegatesFocus: true,
	},
});
