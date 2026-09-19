// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {css} from '@microsoft/fast-element';
import {
	display,
	ElementDefinitionContext,
	focusVisible,
	FoundationElementDefinition,
} from '@microsoft/fast-foundation';
import {
	borderWidth,
	cornerRadius,
	disabledOpacity,
	fontFamily,
	menuBackground,
	menuBorder,
	menuForeground,
	menuSelectionBackground,
	menuSelectionForeground,
	typeRampBaseFontSize,
	typeRampBaseLineHeight,
} from '../design-tokens.js';

export const contextMenuStyles = (
	context: ElementDefinitionContext,
	definition: FoundationElementDefinition
) => css`
	${display('block')} :host {
		box-sizing: border-box;
		min-width: 0;
		font-family: ${fontFamily};
		font-size: ${typeRampBaseFontSize};
		line-height: ${typeRampBaseLineHeight};
		color: ${menuForeground};
		outline: none;
	}
	:host([hidden]) {
		display: none;
	}
	.list {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		max-height: calc(100vh - 8px);
		min-width: 160px;
		max-width: calc(100vw - 8px);
		padding: 4px 0;
		overflow-y: auto;
		overflow-x: hidden;
		border-radius: calc(${cornerRadius} * 1px);
		border: calc(${borderWidth} * 1px) solid ${menuBorder};
		background: ${menuBackground};
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.32);
	}
	:host(:not([open])) .list {
		display: none;
	}
	:host([open][placement]) {
		position: fixed;
		top: 0;
		left: 0;
		margin: 0;
		z-index: 1000;
	}
	@media (forced-colors: active) {
		.list {
			border-color: ButtonText;
			background: Canvas;
			color: CanvasText;
		}
	}
`;

export const contextMenuItemStyles = (
	context: ElementDefinitionContext,
	definition: FoundationElementDefinition
) => css`
	${display('block')} :host {
		box-sizing: border-box;
		min-width: 0;
		font-family: ${fontFamily};
		font-size: ${typeRampBaseFontSize};
		line-height: ${typeRampBaseLineHeight};
		color: ${menuForeground};
		outline: none;
		cursor: default;
		user-select: none;
	}
	.row {
		box-sizing: border-box;
		display: grid;
		grid-template-columns: auto 1fr auto;
		column-gap: 6px;
		align-items: center;
		min-height: 22px;
		padding: 2px 8px 2px 8px;
		border-radius: 0;
	}
	:host(:hover:not([disabled])) .row {
		background: ${menuSelectionBackground};
		color: ${menuSelectionForeground};
	}
	:host([aria-selected='true']) .row {
		background: ${menuSelectionBackground};
		color: ${menuSelectionForeground};
	}
	:host(:${focusVisible}) .row {
		outline: 1px solid ${menuSelectionForeground};
		outline-offset: -1px;
	}
	:host([disabled]) {
		opacity: ${disabledOpacity};
		cursor: not-allowed;
	}
	.start {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 16px;
		height: 16px;
	}
	.start:empty {
		display: none;
	}
	::slotted([slot='start']) {
		width: 16px;
		height: 16px;
		fill: currentColor;
	}
	.label {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.shortcut {
		min-width: 0;
		max-width: 100%;
		overflow: hidden;
		text-align: end;
		text-overflow: ellipsis;
		white-space: nowrap;
		opacity: 0.8;
		margin-inline-start: 16px;
	}
	:host([aria-selected='true']) .shortcut,
	:host(:hover:not([disabled])) .shortcut {
		opacity: 1;
	}
	.shortcut:empty {
		display: none;
	}
	@media (forced-colors: active) {
		.row {
			color: CanvasText;
		}
		:host([aria-selected='true']) .row,
		:host(:hover:not([disabled])) .row {
			background: Highlight;
			color: HighlightText;
			force-color-adjust: none;
		}
	}
`;
