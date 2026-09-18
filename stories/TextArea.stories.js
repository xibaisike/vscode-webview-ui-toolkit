import {
	createComponent,
	createFormField,
	createStatusText,
	createStoryStack,
} from './helpers';

export default {
	title: 'Components/Text Area',
	tags: ['autodocs'],
	argTypes: {
		placeholder: {control: 'text'},
		rows: {control: {type: 'number', min: 2, max: 12, step: 1}},
		resize: {
			control: 'select',
			options: ['none', 'both', 'horizontal', 'vertical'],
		},
		disabled: {control: 'boolean'},
		readonly: {control: 'boolean'},
		value: {control: 'text'},
	},
	render: ({placeholder, rows, resize, disabled, readonly, value}) => {
		const root = createStoryStack();
		const status = createStatusText(
			`Character count: ${String(value ?? '').length}`
		);
		const area = createComponent('vscode-text-area', {
			'id': 'description-field',
			'aria-label': 'Description',
			placeholder,
			rows,
			resize,
			disabled,
			readonly,
			value,
		});
		area.addEventListener('input', () => {
			status.textContent = `Character count: ${
				String(area.value ?? '').length
			}`;
		});
		root.append(createFormField('Description', area), status);
		return root;
	},
};

export const Playground = {
	args: {
		placeholder: 'Describe the proposed change',
		rows: 5,
		resize: 'vertical',
		disabled: false,
		readonly: false,
		value: 'This story demonstrates a multiline authoring experience.',
	},
};
