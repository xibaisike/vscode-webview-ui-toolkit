import {createStoryStack, createText} from './helpers';

const components = [
	['Badge and Tag', 'Compact status markers and labels.'],
	['Button', 'Primary, secondary, and icon actions with slots.'],
	['Checkbox', 'Boolean selection states with labels.'],
	['Data Grid', 'Tabular layouts using grid, row, and cell components.'],
	['Divider', 'Low-emphasis separators for related content.'],
	['Dropdown and Option', 'Select controls and listbox options.'],
	['Link', 'Navigation elements styled for VS Code webviews.'],
	['Panels', 'Tabbed layouts with panel tabs and views.'],
	['Progress Ring', 'Indeterminate progress feedback.'],
	['Radio Group', 'Single-selection groups with radio items.'],
	[
		'Text Field and Text Area',
		'Single-line and multiline inputs with slots and states.',
	],
];

export default {
	title: 'Introduction',
	parameters: {
		controls: {disable: true},
		fullWidth: true,
		layout: 'fullscreen',
	},
	render: () => {
		const root = createStoryStack(true);
		root.append(
			createText('VS Code Webview UI Toolkit', 'h1', 'sb-text-block'),
			createText(
				"This Storybook gallery registers the toolkit's web components directly from src and organizes stories by component family. Use the theme toolbar to preview the same stories against representative VS Code light, dark, and high contrast tokens."
			)
		);

		const grid = document.createElement('div');
		grid.className = 'sb-intro-grid';

		for (const [name, description] of components) {
			const card = document.createElement('section');
			card.className = 'sb-intro-card';

			const heading = document.createElement('h3');
			heading.textContent = name;

			const text = document.createElement('p');
			text.textContent = description;

			card.append(heading, text);
			grid.append(card);
		}

		const list = document.createElement('ul');
		list.className = 'sb-intro-list';
		for (const item of [
			'Compound components are demonstrated together where that is how they are intended to be used.',
			'Interactive stories include lightweight event readouts instead of adding extra Storybook action configuration.',
			'Option, panel-tab, panel-view, data-grid-row, and data-grid-cell are covered inside their parent component stories.',
		]) {
			const entry = document.createElement('li');
			entry.textContent = item;
			list.append(entry);
		}

		root.append(grid, list);
		return root;
	},
};

export const Overview = {};
