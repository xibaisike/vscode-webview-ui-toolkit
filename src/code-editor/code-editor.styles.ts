// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {css} from '@microsoft/fast-element';
import {
	disabledCursor,
	display,
	ElementDefinitionContext,
	FoundationElementDefinition,
} from '@microsoft/fast-foundation';
import {
	borderWidth,
	cornerRadiusRound,
	designUnit,
	disabledOpacity,
	dropdownBorder,
	focusBorder,
	fontFamily,
	foreground,
	inputBackground,
	inputForeground,
	inputMinWidth,
	typeRampBaseFontSize,
	typeRampBaseLineHeight,
} from '../design-tokens.js';

export const codeEditorStyles = (
	context: ElementDefinitionContext,
	definition: FoundationElementDefinition
) => css`
	${display('block')} :host {
		font-family: ${fontFamily};
		outline: none;
	}

	.label {
		display: block;
		color: ${foreground};
		cursor: pointer;
		font-size: ${typeRampBaseFontSize};
		line-height: ${typeRampBaseLineHeight};
		margin-bottom: 2px;
	}

	.label__hidden {
		display: none;
		visibility: hidden;
	}

	.editor {
		box-sizing: border-box;
		position: relative;
		color: ${inputForeground};
		background: ${inputBackground};
		border-radius: calc(${cornerRadiusRound} * 1px);
		border: calc(${borderWidth} * 1px) solid ${dropdownBorder};
		min-width: ${inputMinWidth};
		min-height: calc(${designUnit} * 20px);
		overflow: hidden;
	}

	:host(:focus-within:not([disabled])) .editor {
		border-color: ${focusBorder};
	}

	:host([disabled]) {
		opacity: ${disabledOpacity};
	}

	:host([disabled]) .label,
	:host([readonly]) .label,
	:host([readonly]) .editor,
	:host([disabled]) .editor {
		cursor: ${disabledCursor};
	}
`;
