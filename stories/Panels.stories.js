import {createComponent, createStoryStack} from './helpers';

function createPanelTab(id, label, badgeText) {
	const tab = createComponent('vscode-panel-tab', {id});
	tab.append(document.createTextNode(label));

	if (badgeText) {
		tab.append(document.createTextNode(' '));
		const badge = createComponent('vscode-badge', {
			appearance: 'secondary',
		});
		badge.textContent = badgeText;
		tab.append(badge);
	}

	return tab;
}

function createPanelView(id, headingText, body) {
	const view = createComponent('vscode-panel-view', {
		id,
		class: 'sb-panels-view',
	});
	const heading = document.createElement('h3');
	heading.textContent = headingText;
	view.append(heading);
	body(view);
	return view;
}

function createPanels(activeid) {
	const panels = createComponent('vscode-panels', {
		'aria-label': 'Example editor panels',
		activeid,
	});

	const problemsTab = createPanelTab('panel-problems', 'PROBLEMS', '1');
	const outputTab = createPanelTab('panel-output', 'OUTPUT');
	const terminalTab = createPanelTab('panel-terminal', 'TERMINAL');

	const problemsView = createPanelView('panel-problems', 'Problems', view => {
		const exceptionDiagnostics = createComponent('vscode-checkbox', {
			checked: true,
		});
		exceptionDiagnostics.textContent = 'Unhandled exception diagnostics';
		const unusedImports = createComponent('vscode-checkbox');
		unusedImports.textContent = 'Unused imports';
		view.append(exceptionDiagnostics, unusedImports);
	});

	const outputView = createPanelView('panel-output', 'Output', view => {
		const text = document.createElement('p');
		text.className = 'sb-text-block';
		text.textContent = 'Build completed successfully.';
		view.append(text);
	});

	const terminalView = createPanelView('panel-terminal', 'Terminal', view => {
		const text = document.createElement('p');
		text.className = 'sb-text-block';
		text.textContent = 'npm run build-storybook';
		view.append(text);
	});

	panels.append(
		problemsTab,
		outputTab,
		terminalTab,
		problemsView,
		outputView,
		terminalView
	);
	return panels;
}

export default {
	title: 'Components/Panels',
	tags: ['autodocs'],
	parameters: {
		fullWidth: true,
	},
	argTypes: {
		activeid: {
			control: 'select',
			options: ['panel-problems', 'panel-output', 'panel-terminal'],
		},
	},
	render: ({activeid}) => {
		const root = createStoryStack(true);
		root.append(createPanels(activeid));
		return root;
	},
};

export const Playground = {
	args: {
		activeid: 'panel-problems',
	},
};

export const DefaultTabs = {
	render: () => createPanels(),
};
