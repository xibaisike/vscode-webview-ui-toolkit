import {createComponent, createStoryStack} from './helpers';

function createPanels(activeid) {
	const panels = createComponent('vscode-panels', {
		'aria-label': 'Example editor panels',
		activeid,
	});
	panels.innerHTML = `
		<vscode-panel-tab id="tab-problems">PROBLEMS <vscode-badge appearance="secondary">1</vscode-badge></vscode-panel-tab>
		<vscode-panel-tab id="tab-output">OUTPUT</vscode-panel-tab>
		<vscode-panel-tab id="tab-terminal">TERMINAL</vscode-panel-tab>
		<vscode-panel-view id="view-problems" class="sb-panels-view">
			<h3>Problems</h3>
			<vscode-checkbox checked>Unhandled exception diagnostics</vscode-checkbox>
			<vscode-checkbox>Unused imports</vscode-checkbox>
		</vscode-panel-view>
		<vscode-panel-view id="view-output" class="sb-panels-view">
			<h3>Output</h3>
			<p class="sb-text-block">Build completed successfully.</p>
		</vscode-panel-view>
		<vscode-panel-view id="view-terminal" class="sb-panels-view">
			<h3>Terminal</h3>
			<p class="sb-text-block">npm run build-storybook</p>
		</vscode-panel-view>
	`;
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
			options: ['tab-problems', 'tab-output', 'tab-terminal'],
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
		activeid: 'tab-problems',
	},
};

export const DefaultTabs = {
	render: () => createPanels(),
};
