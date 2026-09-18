// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {Compartment, EditorState, Extension} from '@codemirror/state';
import {EditorView, placeholder} from '@codemirror/view';
import {attr, html, nullableNumberConverter, observable, ref} from '@microsoft/fast-element';
import {FoundationElement, FoundationElementDefinition} from '@microsoft/fast-foundation';
import {basicSetup} from 'codemirror';
import {codeEditorStyles as styles} from './code-editor.styles.js';

export type {Extension} from '@codemirror/state';

const defaultEditorMinHeight = 160;
const defaultRows = 8;

const template = html<CodeEditor>`
	<label
		class="${x => ((x as any).hasLabel ? 'label' : 'label label__hidden')}"
		part="label"
	>
		<slot
			${ref('labelSlot')}
			@slotchange="${x => (x as any).handleLabelChange()}"
		></slot>
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
export class CodeEditor extends FoundationElement {
	@attr public value = '';
	@attr public placeholder = '';
	@attr({converter: nullableNumberConverter}) public rows = defaultRows;
	@attr({attribute: 'line-wrapping', mode: 'boolean'}) public lineWrapping = false;
	@attr({mode: 'boolean'}) public readonly = false;
	@attr({mode: 'boolean'}) public disabled = false;
	@observable private hasLabel = false;

	private readonly accessibilityCompartment = new Compartment();
	private readonly editorStateCompartment = new Compartment();
	private readonly wrappingCompartment = new Compartment();
	private readonly placeholderCompartment = new Compartment();
	private readonly extraExtensionsCompartment = new Compartment();
	/** @internal */
	public editorContainer!: HTMLDivElement;
	/** @internal */
	public labelSlot!: HTMLSlotElement;
	private editorView: EditorView | null = null;
	private pendingInitialization = false;
	private pendingFocus = false;
	private pendingFocusOptions?: FocusOptions;
	private focusValue = this.value;
	private _extensions: Extension[] = [];

	public get extensions(): Extension[] {
		return this._extensions;
	}

	public set extensions(value: Extension[]) {
		this._extensions = Array.isArray(value) ? [...value] : [];
		this.reconfigure(this.extraExtensionsCompartment, this.getExtraExtensionsExtension());
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
		if (this.editorView) {
			this.editorView.contentDOM.focus(options);
			return;
		}

		this.pendingFocus = true;
		this.pendingFocusOptions = options;
	}

	private handleLabelChange() {
		const labelText = this.getLabelText();
		this.hasLabel = labelText.length > 0;
		this.reconfigure(this.accessibilityCompartment, this.getAccessibilityExtension());
	}

	private valueChanged(oldValue: string, newValue: string) {
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

	private placeholderChanged() {
		this.reconfigure(this.placeholderCompartment, this.getPlaceholderExtension());
	}

	private rowsChanged() {
		this.updateEditorMinHeight();
	}

	private lineWrappingChanged() {
		this.reconfigure(this.wrappingCompartment, this.getWrappingExtension());
	}

	private readonlyChanged() {
		this.reconfigure(this.editorStateCompartment, this.getEditorStateExtension());
		this.reconfigure(this.accessibilityCompartment, this.getAccessibilityExtension());
	}

	private disabledChanged() {
		this.reconfigure(this.editorStateCompartment, this.getEditorStateExtension());
		this.reconfigure(this.accessibilityCompartment, this.getAccessibilityExtension());
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
		if (this.pendingFocus) {
			this.pendingFocus = false;
			this.editorView.contentDOM.focus(this.pendingFocusOptions);
			this.pendingFocusOptions = undefined;
		}
	}

	private destroyEditor() {
		this.editorView?.destroy();
		this.editorView = null;
	}

	private getEditorExtensions(): Extension[] {
		const extensions: Extension[] = [
			basicSetup,
			theme,
			this.editorStateCompartment.of(this.getEditorStateExtension()),
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
			this.accessibilityCompartment.of(this.getAccessibilityExtension()),
			this.wrappingCompartment.of(this.getWrappingExtension()),
			this.placeholderCompartment.of(this.getPlaceholderExtension()),
			this.extraExtensionsCompartment.of(this.getExtraExtensionsExtension()),
		];

		return extensions;
	}

	private getEditorStateExtension(): Extension {
		return [
			EditorState.readOnly.of(this.disabled || this.readonly),
			EditorView.editable.of(!this.disabled && !this.readonly),
		];
	}

	private getAccessibilityExtension(): Extension {
		return EditorView.contentAttributes.of(this.getContentAttributes());
	}

	private getWrappingExtension(): Extension {
		return this.lineWrapping ? EditorView.lineWrapping : [];
	}

	private getPlaceholderExtension(): Extension {
		return this.placeholder ? placeholder(this.placeholder) : [];
	}

	private getExtraExtensionsExtension(): Extension {
		return this._extensions;
	}

	private getContentAttributes(): {[key: string]: string} {
		const attributes: {[key: string]: string} = {
			role: 'textbox',
			'aria-label': this.getAriaLabel(),
			'aria-multiline': 'true',
			spellcheck: 'false',
		};

		if (this.readonly || this.disabled) {
			attributes['aria-readonly'] = 'true';
		}

		if (this.disabled) {
			attributes['aria-disabled'] = 'true';
			attributes.tabindex = '-1';
		}

		return attributes;
	}

	private getAriaLabel(): string {
		return this.getAttribute('aria-label') || this.getLabelText() || 'Code editor';
	}

	private getLabelText(): string {
		if (this.labelSlot) {
			return this.labelSlot
				.assignedNodes({flatten: true})
				.map(node => node.textContent?.trim() ?? '')
				.join(' ')
				.trim();
		}

		return Array.from(this.childNodes)
			.map(node => node.textContent?.trim() ?? '')
			.join(' ')
			.trim();
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
		if (!Number.isFinite(this.rows) || this.rows < 1) {
			return defaultEditorMinHeight;
		}

		return this.rows * 20;
	}

	private reconfigure(compartment: Compartment, extension: Extension) {
		if (!this.editorView) {
			return;
		}

		this.editorView.dispatch({
			effects: compartment.reconfigure(extension),
		});
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
export const vsCodeCodeEditor = CodeEditor.compose<
	FoundationElementDefinition,
	typeof CodeEditor
>({
	baseName: 'code-editor',
	template,
	styles,
	shadowOptions: {
		delegatesFocus: true,
	},
});
