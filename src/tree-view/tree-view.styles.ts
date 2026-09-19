// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {css} from '@microsoft/fast-element';
import {
	contrastActiveBorder,
	disabledOpacity,
	focusBorder,
	fontFamily,
	foreground,
	listActiveSelectionBackground,
	listActiveSelectionForeground,
	listFocusOutline,
	listHoverBackground,
	listHoverForeground,
	listInactiveSelectionBackground,
	listInactiveSelectionForeground,
	treeIndentGuidesStroke,
	typeRampBaseFontSize,
} from '../design-tokens.js';

export const treeViewStyles = css`
	:host {
		display: block;
		box-sizing: border-box;
		min-width: 0;
		color: ${foreground};
		font-family: ${fontFamily};
		font-size: ${typeRampBaseFontSize};
		outline: none;
	}

	:host(:focus-visible) {
		outline: 1px solid ${focusBorder};
		outline-offset: -1px;
	}
`;

export const treeItemStyles = css`
	:host {
		display: block;
		box-sizing: border-box;
		min-width: 0;
		outline: none;
		--tree-item-level: var(--vscode-tree-item-level, 1);
		--tree-item-indent: var(--vscode-tree-item-indent, 8px);
	}

	.row {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		height: 22px;
		min-width: 0;
		padding-inline-start: calc(
			(var(--tree-item-level) - 1) * var(--tree-item-indent)
		);
		color: ${foreground};
		cursor: default;
		user-select: none;
	}

	:host(:hover) > .row {
		color: ${listHoverForeground};
		background: ${listHoverBackground};
	}

	:host([selected]) > .row {
		color: ${listInactiveSelectionForeground};
		background: ${listInactiveSelectionBackground};
		outline: 1px solid ${contrastActiveBorder};
		outline-offset: -1px;
	}

	:host-context(vscode-tree-view:focus-within)[selected] > .row {
		color: ${listActiveSelectionForeground};
		background: ${listActiveSelectionBackground};
	}

	:host(:focus-visible) > .row {
		outline: 1px solid ${listFocusOutline};
		outline-offset: -1px;
	}

	:host([disabled]) > .row {
		opacity: ${disabledOpacity};
	}

	.disclosure {
		display: inline-flex;
		flex: 0 0 16px;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		width: 16px;
		height: 22px;
		padding: 0;
		border: 0;
		color: inherit;
		background: transparent;
		cursor: pointer;
	}

	.disclosure[aria-hidden='true'] {
		visibility: hidden;
		pointer-events: none;
	}

	.disclosure:focus-visible {
		outline: 1px solid ${focusBorder};
		outline-offset: -2px;
	}

	.disclosure svg {
		width: 16px;
		height: 16px;
		fill: currentColor;
		transition: transform 80ms linear;
	}

	:host([expanded]) > .row .disclosure svg {
		transform: rotate(90deg);
	}

	.start {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		margin-inline-end: 4px;
	}

	::slotted([slot='start']) {
		width: 16px;
		height: 16px;
	}

	.label {
		flex: 0 1 auto;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.description {
		flex: 1 1 auto;
		min-width: 0;
		margin-inline-start: 6px;
		overflow: hidden;
		opacity: 0.7;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.actions {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		margin-inline-start: auto;
		padding-inline-end: 4px;
		visibility: hidden;
	}

	:host(:hover) > .row .actions,
	:host(:focus-within) > .row .actions {
		visibility: visible;
	}

	.children {
		box-sizing: border-box;
		margin-inline-start: calc(16px + var(--tree-item-indent));
		border-inline-start: 1px solid ${treeIndentGuidesStroke};
	}

	.children[hidden] {
		display: none;
	}

	@media (forced-colors: active) {
		:host(:hover) > .row,
		:host([selected]) > .row {
			outline: 1px dotted ${contrastActiveBorder};
			outline-offset: -1px;
		}
	}
`;
