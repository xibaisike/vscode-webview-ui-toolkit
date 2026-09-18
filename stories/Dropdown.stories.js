import {
	createComponent,
	createFormField,
	createSlotIcon,
	createStatusText,
	createStoryStack,
} from './helpers';

function appendOptions(dropdown) {
	for (const item of ['Stable', 'Insiders', 'Exploration']) {
		const option = createComponent('vscode-option');
		option.textContent = item;
		dropdown.append(option);
	}
}

export default {
	title: 'Components/Dropdown',
	tags: ['autodocs'],
	argTypes: {
		disabled: {control: 'boolean'},
		open: {control: 'boolean'},
		position: {
			control: 'select',
			options: ['above', 'below'],
		},
	},
	render: ({disabled, open, position}) => {
		const root = createStoryStack();
		const dropdown = createComponent('vscode-dropdown', {
			disabled,
			open,
			position,
			id: 'release-channel',
		});
		appendOptions(dropdown);
		const status = createStatusText('Selected value: Stable');
		dropdown.addEventListener('change', () => {
			status.textContent = `Selected value: ${dropdown.value}`;
		});
		root.append(
			createFormField(
				'Release channel',
				dropdown,
				'This story also demonstrates vscode-option.'
			),
			status
		);
		return root;
	},
};

export const Playground = {
	args: {
		disabled: false,
		open: false,
		position: 'below',
	},
};

export const WithCustomIndicator = {
	render: () => {
		const root = createStoryStack();
		const dropdown = createComponent('vscode-dropdown', {
			id: 'dropdown-indicator',
		});
		dropdown.append(createSlotIcon('▾', 'indicator'));
		appendOptions(dropdown);
		root.append(createFormField('Release channel', dropdown));
		return root;
	},
};
