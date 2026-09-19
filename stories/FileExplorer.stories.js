import {createComponent, createText} from './helpers';

const initialWorkspace = {
	type: 'folder',
	name: 'WEBVIEW-TOOLKIT',
	expanded: true,
	children: [
		{
			type: 'folder',
			name: 'src',
			expanded: true,
			children: [
				{
					type: 'folder',
					name: 'components',
					children: [
						{type: 'file', name: 'button.ts'},
						{type: 'file', name: 'tree-view.ts'},
					],
				},
				{type: 'file', name: 'index.ts', selected: true},
				{type: 'file', name: 'vscode-design-system.ts'},
			],
		},
		{
			type: 'folder',
			name: 'stories',
			children: [
				{type: 'file', name: 'FileExplorer.stories.js'},
				{type: 'file', name: 'Introduction.stories.js'},
			],
		},
		{type: 'file', name: 'package.json'},
		{
			type: 'file',
			name: 'README-with-a-deliberately-long-name.md',
		},
	],
};

function cloneWorkspace(readonly = false) {
	const workspace = structuredClone(initialWorkspace);
	if (readonly) {
		workspace.children[3].disabled = true;
	}
	return workspace;
}

function icon(name) {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('viewBox', '0 0 16 16');
	svg.setAttribute('aria-hidden', 'true');
	svg.innerHTML = `<path d="${name}"></path>`;
	return svg;
}

function resourceIcon(type, expanded) {
	const wrapper = document.createElement('span');
	wrapper.slot = 'start';
	wrapper.className = `sb-file-explorer-icon sb-file-explorer-icon--${type}`;
	wrapper.append(
		type === 'folder'
			? icon(
					expanded
						? 'M1.5 4h5l1 1h7l-1.5 7h-11z'
						: 'M1.5 3h5l1 1h7v8h-13z'
			  )
			: icon('M3 1.5h6l4 4v9h-10zm6 1.4v3.6h3.6')
	);
	return wrapper;
}

function actionButton(label, path) {
	const button = createComponent('vscode-button', {
		'appearance': 'icon',
		'aria-label': label,
		'title': label,
	});
	button.append(icon(path));
	return button;
}

function pathFor(parentPath, name) {
	return parentPath ? `${parentPath}/${name}` : name;
}

function findResource(root, path, parent = null) {
	const currentPath = pathFor(parent?.path ?? '', root.name);
	if (currentPath === path) {
		return {node: root, parent: parent?.node ?? null, path: currentPath};
	}
	for (const child of root.children ?? []) {
		const result = findResource(child, path, {
			node: root,
			path: currentPath,
		});
		if (result) {
			return result;
		}
	}
	return null;
}

function clearSelected(node) {
	node.selected = false;
	for (const child of node.children ?? []) {
		clearSelected(child);
	}
}

function createResourceItem(node, parentPath = '') {
	const path = pathFor(parentPath, node.name);
	const item = createComponent('vscode-tree-item', {
		label: node.name,
		expanded: node.expanded,
		selected: node.selected,
		disabled: node.disabled,
	});
	item.dataset.path = path;
	item.dataset.type = node.type;
	item.append(resourceIcon(node.type, node.expanded), node.name);
	for (const child of node.children ?? []) {
		item.append(createResourceItem(child, path));
	}
	return item;
}

function findResourceByPath(workspace, path) {
	return findResource(workspace, path);
}

function renderExplorer({multiple = false, readonly = false} = {}) {
	const container = document.createElement('section');
	container.className = 'sb-file-explorer-container';

	const shell = document.createElement('div');
	shell.className = 'sb-file-explorer';

	const header = document.createElement('header');
	header.className = 'sb-file-explorer-header';
	header.append(createText('EXPLORER', 'h2', 'sb-file-explorer-title'));

	const actions = document.createElement('div');
	actions.className = 'sb-file-explorer-actions';
	const newFile = actionButton(
		'New File',
		'M8 1v6h6v2h-6v6h-2v-6h-6v-2h6v-6z'
	);
	const newFolder = actionButton(
		'New Folder',
		'M1 3h5l1 1h7v8h-13zm7 3v2h-2v1h2v2h1v-2h2v-1h-2v-2z'
	);
	const refresh = actionButton(
		'Refresh',
		'M13 3v4h-4l1.6-1.6a4 4 0 1 0 .7 4.8l1.4.8a6 6 0 1 1-.7-7l1-1z'
	);
	const collapse = actionButton(
		'Collapse All',
		'M3 2h10v2h-10zm2 4h6v2h-6zm2 4h2v2h-2z'
	);
	actions.append(newFile, newFolder, refresh, collapse);
	header.append(actions);

	const status = createText(
		'Selected: WEBVIEW-TOOLKIT/src/index.ts',
		'div',
		'sb-file-explorer-status'
	);
	status.setAttribute('aria-live', 'polite');

	const tree = createComponent('vscode-tree-view', {
		'aria-label': 'Mock workspace files',
		'selection-mode': multiple ? 'multiple' : 'single',
	});

	const renderTree = (focusPath = selectedPath) => {
		tree.replaceChildren(createResourceItem(workspace));
		tree.refresh();
		const focusItem = Array.from(
			tree.querySelectorAll('vscode-tree-item')
		).find(item => item.dataset.path === focusPath);
		if (focusItem) {
			tree.focusItem(focusItem);
		}
	};

	// Create a new resource inside an explicit stable folder path.
	const createResource = (type, targetPath) => {
		if (readonly) {
			return;
		}

		if (!targetPath) {
			targetPath = workspace.name;
		}

		const target = findResourceByPath(workspace, targetPath)?.node;
		if (!target || target.type !== 'folder') {
			return;
		}

		const sequence = type === 'file' ? ++fileCounter : ++folderCounter;
		const name =
			type === 'file'
				? `new-file-${sequence}.txt`
				: `new-folder-${sequence}`;
		target.children ??= [];
		target.expanded = true;
		const resource = {
			type,
			name,
			selected: true,
			...(type === 'folder' ? {children: []} : {}),
		};
		clearSelected(workspace);
		resource.selected = true;
		target.children.push(resource);
		selectedPath = pathFor(targetPath, name);
		status.textContent = `Selected: ${selectedPath}`;
		renderTree(selectedPath);
	};

	// Resolve the currently selected item to a stable folder path,
	// for the toolbar-driven creation flow.
	const resolveToolbarFolder = () => {
		const selected = findResourceByPath(workspace, selectedPath);
		if (!selected) {
			return workspace.name;
		}
		if (selected.node.type === 'folder') {
			return selected.path;
		}
		const parentPath = selected.path.slice(
			0,
			selected.path.lastIndexOf('/')
		);
		return parentPath || workspace.name;
	};

	let workspace = cloneWorkspace(readonly);
	let fileCounter = 0;
	let folderCounter = 0;
	let selectedPath = 'WEBVIEW-TOOLKIT/src/index.ts';
	let contextTargetPath = workspace.name;

	// Root-mounted context menu so the Explorer shell does not clip it.
	const menu = createComponent('vscode-context-menu', {hidden: ''});
	const menuNewFile = createComponent(
		'vscode-context-menu-item',
		{value: 'new-file'},
		'New File'
	);
	const menuNewFolder = createComponent(
		'vscode-context-menu-item',
		{value: 'new-folder'},
		'New Folder'
	);
	const menuFind = createComponent(
		'vscode-context-menu-item',
		{value: 'find-in-folder'},
		'Find in Folder'
	);
	menu.append(menuNewFile, menuNewFolder, menuFind);

	const updateContextMenuState = () => {
		menuNewFile.disabled = !!readonly;
		menuNewFolder.disabled = !!readonly;
	};
	updateContextMenuState();

	const findItemFromEvent = event => {
		for (const target of event.composedPath()) {
			if (
				target instanceof HTMLElement &&
				target.tagName === 'VSCODE-TREE-ITEM' &&
				target.closest('vscode-tree-view') === tree
			) {
				return target;
			}
		}
		return null;
	};

	const resolveContextTarget = item => {
		if (!item) {
			return workspace.name;
		}
		const path = item.dataset.path;
		if (!path) {
			return workspace.name;
		}
		const found = findResourceByPath(workspace, path);
		if (!found) {
			return workspace.name;
		}
		if (found.node.type === 'folder') {
			return found.path;
		}
		const parentPath = found.path.slice(0, found.path.lastIndexOf('/'));
		return parentPath || workspace.name;
	};

	const openContextMenu = (event, item) => {
		event.preventDefault();
		contextTargetPath = resolveContextTarget(item);
		menu.showAt(event.clientX, event.clientY, item ?? shell);
	};

	tree.addEventListener('contextmenu', event => {
		const item = findItemFromEvent(event);
		if (!item) {
			return;
		}
		if (!item.selected) {
			for (const candidate of tree.querySelectorAll('vscode-tree-item')) {
				candidate.selected = candidate === item;
			}
			item.selected = true;
		}
		openContextMenu(event, item);
	});

	// Whitespace inside the Explorer tree container targets the workspace root.
	shell.addEventListener('contextmenu', event => {
		if (findItemFromEvent(event)) {
			return;
		}
		openContextMenu(event, null);
	});

	menu.addEventListener('menu-select', event => {
		const value = event.detail.value;
		if (value === 'new-file') {
			createResource('file', contextTargetPath);
			status.textContent = `Created file in ${contextTargetPath}`;
		} else if (value === 'new-folder') {
			createResource('folder', contextTargetPath);
			status.textContent = `Created folder in ${contextTargetPath}`;
		} else if (value === 'find-in-folder') {
			status.textContent = `Find in Folder: ${contextTargetPath}`;
		}
	});

	tree.addEventListener('selection-change', event => {
		const paths = event.detail.selectedItems.map(item => item.dataset.path);
		if (paths.length > 0) {
			selectedPath = paths[paths.length - 1];
		}
		status.textContent = paths.length
			? `Selected: ${paths.join(', ')}`
			: 'Selected: none';
	});
	tree.addEventListener('item-invoke', event => {
		selectedPath = event.detail.item.dataset.path;
		status.textContent = `Opened: ${selectedPath}`;
	});
	tree.addEventListener('expanded-change', event => {
		const resource = findResource(
			workspace,
			event.detail.item.dataset.path
		);
		if (resource?.node.type === 'folder') {
			resource.node.expanded = event.detail.expanded;
			event.detail.item
				.querySelector(':scope > [slot="start"]')
				?.replaceWith(resourceIcon('folder', event.detail.expanded));
		}
	});

	// Toolbar still resolves the currently selected folder/file parent.
	newFile.addEventListener('click', () => {
		createResource('file', resolveToolbarFolder());
	});
	newFolder.addEventListener('click', () => {
		createResource('folder', resolveToolbarFolder());
	});
	refresh.addEventListener('click', () => {
		workspace = cloneWorkspace(readonly);
		fileCounter = 0;
		folderCounter = 0;
		selectedPath = 'WEBVIEW-TOOLKIT/src/index.ts';
		contextTargetPath = workspace.name;
		status.textContent = `Selected: ${selectedPath}`;
		updateContextMenuState();
		renderTree(selectedPath);
	});
	collapse.addEventListener('click', () => tree.collapseAll());

	renderTree();
	shell.append(header, tree, status);
	container.append(shell, menu);
	return container;
}

export default {
	title: 'Components/File Explorer',
	tags: ['autodocs'],
	parameters: {
		fullWidth: true,
	},
};

export const MockWorkspace = {
	render: () => renderExplorer(),
};

export const MultipleSelectionAndReadOnly = {
	render: () => renderExplorer({multiple: true, readonly: true}),
};
