import {createComponent, createStoryStack, createText} from './helpers';

function createIcon(symbol) {
	const icon = document.createElement('span');
	icon.slot = 'start';
	icon.textContent = symbol;
	icon.setAttribute('aria-hidden', 'true');
	return icon;
}

function createItem(label, options = {}) {
	const item = createComponent('vscode-tree-item', {
		label,
		expanded: options.expanded,
		selected: options.selected,
		disabled: options.disabled,
	});
	item.append(createIcon(options.folder ? '▣' : '◇'), label);
	for (const child of options.children ?? []) {
		item.append(child);
	}
	return item;
}

export default {
	title: 'Components/Tree View',
	tags: ['autodocs'],
	parameters: {
		fullWidth: true,
	},
};


function getEventPath(event) {
    if (typeof event.composedPath === 'function') {
        return event.composedPath();
    }
    const path = [];
    let current = event.target ?? null;
    while (current) {
        path.push(current);
        if (current instanceof Node && current.parentNode) {
            current = current.parentNode;
        } else if (current instanceof ShadowRoot) {
            current = current.host;
        } else {
            break;
        }
    }
    return path;
}


export const Basic = {
	render: () => {
		const root = createStoryStack();
		const tree = createComponent('vscode-tree-view', {
			'aria-label': 'Project files',
		});
		tree.append(
			createItem('src', {
				folder: true,
				expanded: true,
				children: [
					createItem('components', {
						folder: true,
						children: [createItem('Button.ts')],
					}),
					createItem('index.ts', {selected: true}),
				],
			}),
			createItem('README.md')
		);
		root.append(
			tree,
			createText(
				'Use arrow keys to navigate, Enter to expand or invoke, and type a label prefix to jump.'
			)
		);
		return root;
	},
};

export const MultipleSelection = {
	render: () => {
		const root = createStoryStack();
		const tree = createComponent('vscode-tree-view', {
			'aria-label': 'Multiple selection example',
			'selection-mode': 'multiple',
		});
		tree.append(
			createItem('alpha.ts', {selected: true}),
			createItem('beta.ts'),
			createItem('generated.ts', {disabled: true}),
			createItem('delta.ts')
		);
		root.append(
			tree,
			createText(
				'Use Ctrl/Cmd to toggle items and Shift to select a range.'
			)
		);
		return root;
	},
};

export const EmptyAndDisabled = {
	render: () => {
		const root = createStoryStack();
		const empty = createComponent('vscode-tree-view', {
			'aria-label': 'Empty tree',
		});
		const disabled = createComponent('vscode-tree-view', {
			'aria-label': 'Disabled tree',
		});
		disabled.append(createItem('Unavailable resource', {disabled: true}));
		root.append(
			createText('Empty tree', 'h3'),
			empty,
			createText('All items disabled', 'h3'),
			disabled
		);
		return root;
	},
};

export const ContextCommands = {
	render: () => {
		const root = createStoryStack(true);

		const tree = createComponent('vscode-tree-view', {
			'aria-label': 'Files with right-click commands',
			'selection-mode': 'multiple',
		});
		tree.append(
			createItem('README.md'),
			createItem('package.json', {selected: true}),
			createItem('index.ts'),
			createItem('tsconfig.json')
		);

		const status = createText('Command: none', 'div', 'sb-status');
		status.setAttribute('aria-live', 'polite');

		const menu = createComponent('vscode-context-menu', {hidden: ''});
		menu.append(
			createComponent(
				'vscode-context-menu-item',
				{value: 'copy'},
				'Copy'
			),
			createComponent(
				'vscode-context-menu-item',
				{value: 'move'},
				'Move…'
			),
			createComponent(
				'vscode-context-menu-item',
				{value: 'delete'},
				'Delete'
			)
		);
		root.append(menu);

		const findItem = event => {

			for (const candidate of getEventPath(event)) {
				if (
					candidate instanceof HTMLElement &&
					candidate.tagName === 'VSCODE-TREE-ITEM' &&
					candidate.closest('vscode-tree-view') === tree
				) {
					return candidate;
				}
			}
			return null;
		};

		const handleContextMenu = event => {
			event.preventDefault();
			const item = findItem(event.target);
			if (!item) {
				return;
			}
			// Establish a single contextual selection when the targeted
			// item is not already part of the selection.
			if (!item.selected) {
				for (const candidate of tree.querySelectorAll(
					'vscode-tree-item'
				)) {
					candidate.selected = candidate === item;
				}
				item.selected = true;
			}
			menu.showAt(event.clientX, event.clientY, item);
		};

		tree.addEventListener('contextmenu', handleContextMenu);

		menu.addEventListener('menu-select', event => {
			const invoker = event.detail.invoker;
			const label = invoker?.getAttribute('label') ?? '(none)';
			status.textContent = `Command: ${event.detail.value} on ${label}`;
		});

		root.append(
			tree,
			createText(
				'Right-click an item to open the context menu. Right-clicking an unselected item selects only that item; right-clicking an item in the existing selection preserves the selection.'
			),
			status
		);
		return root;
	},
};
