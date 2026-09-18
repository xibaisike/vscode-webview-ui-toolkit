import {createComponent, createStoryStack, createText} from './helpers';

function createManualGrid() {
	const grid = createComponent('vscode-data-grid', {
		'aria-label': 'Repository issues',
		'grid-template-columns': '2fr 1fr 1fr',
	});

	const rows = [
		{
			type: 'header',
			cells: [
				{column: '1', text: 'Issue', cellType: 'columnheader'},
				{column: '2', text: 'Owner', cellType: 'columnheader'},
				{column: '3', text: 'State', cellType: 'columnheader'},
			],
		},
		{
			cells: [
				{column: '1', text: 'Adopt component gallery'},
				{column: '2', text: 'Toolkit'},
				{column: '3', text: 'Open'},
			],
		},
		{
			cells: [
				{column: '1', text: 'Review theme tokens'},
				{column: '2', text: 'Docs'},
				{column: '3', text: 'Done'},
			],
		},
	];

	for (const rowData of rows) {
		const row = createComponent('vscode-data-grid-row', {
			'row-type': rowData.type,
		});

		for (const cellData of rowData.cells) {
			const cell = createComponent('vscode-data-grid-cell', {
				'cell-type': cellData.cellType,
				'grid-column': cellData.column,
			});
			cell.textContent = cellData.text;
			row.append(cell);
		}

		grid.append(row);
	}

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
