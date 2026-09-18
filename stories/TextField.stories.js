import {
	createComponent,
	createSlotIcon,
	createStatusText,
	createStoryStack,
} from './helpers';

export default {
	title: 'Components/Text Field',
	tags: ['autodocs'],
	argTypes: {
		placeholder: {control: 'text'},
		type: {
			control: 'select',
			options: ['text', 'email', 'password', 'tel', 'url'],
		},
		value: {control: 'text'},
		disabled: {control: 'boolean'},
		readonly: {control: 'boolean'},
		showStartIcon: {control: 'boolean'},
		showEndIcon: {control: 'boolean'},
	},
	render: ({
		placeholder,
		type,
		value,
		disabled,
		readonly,
		showStartIcon,
		showEndIcon,
	}) => {
		const root = createStoryStack();
		const status = createStatusText(`Current value: ${value || '(empty)'}`);
		const field = createComponent('vscode-text-field', {
			id: 'search-field',
			placeholder,
			type,
			value,
			disabled,
			readonly,
		});
		field.textContent = 'Search';
		if (showStartIcon) {
			field.append(createSlotIcon('⌕', 'start'));
		}
		if (showEndIcon) {
			field.append(createSlotIcon('›', 'end'));
		}
		field.addEventListener('input', () => {
			status.textContent = `Current value: ${field.value || '(empty)'}`;
		});
		root.append(field, status);
		return root;
	},
};

export const Playground = {
	args: {
		placeholder: 'Search settings',
		type: 'text',
		value: '',
		disabled: false,
		readonly: false,
		showStartIcon: true,
		showEndIcon: false,
	},
};

export const WithEndActions = {
	args: {
		placeholder: 'Search settings',
		type: 'text',
		value: '',
		disabled: false,
		readonly: false,
		showStartIcon: true,
		showEndIcon: true,
	},
};
