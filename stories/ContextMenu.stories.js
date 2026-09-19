import {createComponent, createStoryStack, createText} from './helpers';

function createIcon(symbol, slot = 'start') {
	const icon = document.createElement('span');
	icon.slot = slot;
	icon.textContent = symbol;
	icon.setAttribute('aria-hidden', 'true');
	return icon;
}

function createMenu({withShortcuts = false, withDisabled = false} = {}) {
	const menu = createComponent('vscode-context-menu', {hidden: ''});

	const copy = createComponent(
		'vscode-context-menu-item',
		{value: 'copy'},
		'Copy'
	);
	copy.append(createIcon('⧉'));
	if (withShortcuts) {
		copy.append(createIcon('⌘C', 'shortcut'));
	}

	const paste = createComponent(
		'vscode-context-menu-item',
		{value: 'paste'},
		'Paste'
	);
	paste.append(createIcon('⧉'));
	if (withShortcuts) {
		paste.append(createIcon('⌘V', 'shortcut'));
	}
	if (withDisabled) {
		paste.disabled = true;
	}

	const rename = createComponent(
		'vscode-context-menu-item',
		{value: 'rename'},
		'Rename'
	);
	if (withShortcuts) {
		rename.append(createIcon('F2', 'shortcut'));
	}

	const remove = createComponent(
		'vscode-context-menu-item',
		{value: 'remove'},
		'Remove'
	);
	if (withShortcuts) {
		remove.append(createIcon('⌫', 'shortcut'));
	}

	menu.append(copy, paste, createComponent('vscode-divider'), rename, remove);
	return menu;
}

export default {
	title: 'Components/Context Menu',
	tags: ['autodocs'],
	parameters: {
		fullWidth: true,
	},
};

export const PointerOpened = {
	render: () => {
		const root = createStoryStack(true);

		const trigger = createComponent(
			'button',
			{
				'class': 'sb-context-trigger',
				'aria-label': 'Open context menu',
			},
			'Right-click this area'
		);
		Object.assign(trigger.style, {
			boxSizing: 'border-box',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: '100%',
			minHeight: '140px',
			border: '1px dashed var(--vscode-panel-border)',
			borderRadius: '6px',
			background: 'transparent',
			color: 'var(--vscode-foreground)',
			fontFamily: 'var(--vscode-font-family)',
			fontSize: '13px',
		});

		const menu = createMenu({withShortcuts: true});
		root.append(trigger, menu);

		const status = createText('Command: none', 'div', 'sb-status');
		status.setAttribute('aria-live', 'polite');

		trigger.addEventListener('contextmenu', event => {
			event.preventDefault();
			menu.showAt(event.clientX, event.clientY, trigger);
		});

		menu.addEventListener('menu-select', event => {
			status.textContent = `Command: ${event.detail.value}`;
		});

		root.append(
			createText(
				'Right-click the dashed area to open the menu. Press Arrow Up / Arrow Down to move through items, Enter or Space to activate, Escape to dismiss.'
			),
			status
		);
		return root;
	},
};

export const KeyboardInvoked = {
	render: () => {
		const root = createStoryStack(true);

		const button = createComponent(
			'vscode-button',
			{appearance: 'secondary'},
			'Focus and press Shift+F10'
		);

		const menu = createMenu({withShortcuts: true});
		root.append(button, menu);

		const status = createText('Command: none', 'div', 'sb-status');
		status.setAttribute('aria-live', 'polite');

		const openForButton = () => menu.showFor(button);
		button.addEventListener('contextmenu', event => {
			event.preventDefault();
			openForButton();
		});
		button.addEventListener('keydown', event => {
			if (
				event.key === 'ContextMenu' ||
				(event.shiftKey && event.key === 'F10')
			) {
				event.preventDefault();
				openForButton();
			}
		});

		menu.addEventListener('menu-select', event => {
			status.textContent = `Command: ${event.detail.value}`;
		});

		root.append(
			createText(
				'Focus the button, then press the Context Menu key or Shift+F10 to open the menu adjacent to the invoker.'
			),
			status
		);
		return root;
	},
};

export const DisabledItems = {
	render: () => {
		const root = createStoryStack();

		const trigger = createComponent(
			'button',
			{class: 'sb-context-trigger'},
			'Right-click me'
		);
		Object.assign(trigger.style, {
			boxSizing: 'border-box',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: '100%',
			minHeight: '80px',
			border: '1px dashed var(--vscode-panel-border)',
			borderRadius: '6px',
			background: 'transparent',
			color: 'var(--vscode-foreground)',
			fontFamily: 'var(--vscode-font-family)',
			fontSize: '13px',
		});

		const menu = createMenu({withDisabled: true});
		root.append(trigger, menu);

		const status = createText('Command: none', 'div', 'sb-status');
		status.setAttribute('aria-live', 'polite');

		trigger.addEventListener('contextmenu', event => {
			event.preventDefault();
			menu.showAt(event.clientX, event.clientY, trigger);
		});
		menu.addEventListener('menu-select', event => {
			status.textContent = `Command: ${event.detail.value}`;
		});

		root.append(
			createText(
				'Disabled items remain visible and skip past in keyboard navigation.'
			),
			status
		);
		return root;
	},
};
