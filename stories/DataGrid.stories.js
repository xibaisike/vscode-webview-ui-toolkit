import {createComponent, createStoryStack, createText} from './helpers';

function createManualGrid() {
	const grid = createComponent('vscode-data-grid', {
		'aria-label': 'Repository issues',
		'grid-template-columns': '2fr 1fr 1fr',
	});

	grid.innerHTML = `
		<vscode-data-grid-row row-type="header">
			<vscode-data-grid-cell cell-type="columnheader" grid-column="1">Issue</vscode-data-grid-cell>
			<vscode-data-grid-cell cell-type="columnheader" grid-column="2">Owner</vscode-data-grid-cell>
			<vscode-data-grid-cell cell-type="columnheader" grid-column="3">State</vscode-data-grid-cell>
		</vscode-data-grid-row>
		<vscode-data-grid-row>
			<vscode-data-grid-cell grid-column="1">Adopt component gallery</vscode-data-grid-cell>
			<vscode-data-grid-cell grid-column="2">Toolkit</vscode-data-grid-cell>
			<vscode-data-grid-cell grid-column="3">Open</vscode-data-grid-cell>
		</vscode-data-grid-row>
		<vscode-data-grid-row>
			<vscode-data-grid-cell grid-column="1">Review theme tokens</vscode-data-grid-cell>
			<vscode-data-grid-cell grid-column="2">Docs</vscode-data-grid-cell>
			<vscode-data-grid-cell grid-column="3">Done</vscode-data-grid-cell>
		</vscode-data-grid-row>
	`;

	return grid;
}

export default {
	title: 'Components/Data Grid',
	tags: ['autodocs'],
	parameters: {
		fullWidth: true,
	},
	argTypes: {
		generateHeader: {
			control: 'select',
			options: ['default', 'sticky', 'none'],
			name: 'generate-header',
		},
		gridTemplateColumns: {
			control: 'text',
			name: 'grid-template-columns',
		},
	},
	render: ({generateHeader, gridTemplateColumns}) => {
		const root = createStoryStack(true);
		const shell = document.createElement('div');
		shell.className = 'sb-data-grid-shell';
		const grid = createComponent('vscode-data-grid', {
			'aria-label': 'Release checklist',
			'generate-header': generateHeader,
			'grid-template-columns': gridTemplateColumns,
		});
		grid.rowsData = [
			{Task: 'Build package', Status: 'Done', Owner: 'CI'},
			{Task: 'Add stories', Status: 'In progress', Owner: 'Docs'},
			{
				Task: 'Publish release notes',
				Status: 'Pending',
				Owner: 'Maintainer',
			},
		];
		grid.columnDefinitions = [
			{columnDataKey: 'Task', title: 'Task'},
			{columnDataKey: 'Status', title: 'Status'},
			{columnDataKey: 'Owner', title: 'Owner'},
		];

		shell.append(grid);
		root.append(
			shell,
			createText(
				'This story also covers vscode-data-grid-row and vscode-data-grid-cell through the compound grid structure.'
			)
		);
		return root;
	},
};

export const ProgrammaticRows = {
	args: {
		generateHeader: 'default',
		gridTemplateColumns: '2fr 1fr 1fr',
	},
};

export const ManualMarkup = {
	render: () => {
		const root = createStoryStack(true);
		const shell = document.createElement('div');
		shell.className = 'sb-data-grid-shell';
		shell.append(createManualGrid());
		root.append(shell);
		return root;
	},
};
