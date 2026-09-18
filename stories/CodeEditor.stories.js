import {createComponent, createStoryStack, createStatusText} from './helpers';

export default {
	title: 'Components/Code Editor',
	tags: ['autodocs'],
	parameters: {
		fullWidth: true,
	},
	argTypes: {
		placeholder: {control: 'text'},
		rows: {control: {type: 'number', min: 2, max: 20, step: 1}},
		lineWrapping: {control: 'boolean'},
		readonly: {control: 'boolean'},
		disabled: {control: 'boolean'},
		value: {control: 'text'},
	},
	render: ({placeholder, rows, lineWrapping, readonly, disabled, value}) => {
		const root = createStoryStack(true);
		const status = createStatusText(
			`Character count: ${String(value ?? '').length}`
		);
		const editor = createComponent('vscode-code-editor', {
			'aria-label': 'Source code',
			placeholder,
			rows,
			'line-wrapping': lineWrapping,
			readonly,
			disabled,
			value,
		});
		editor.textContent = 'Source code';
		editor.addEventListener('input', () => {
			status.textContent = `Character count: ${
				String(editor.value ?? '').length
			}`;
		});
		root.append(editor, status);
		return root;
	},
};

export const Playground = {
	args: {
		placeholder: 'Start typing code...',
		rows: 8,
		lineWrapping: false,
		readonly: false,
		disabled: false,
		value: `function greet(name) {
	return \`Hello, ${'${name}'}!\`;
}

greet('VS Code');`,
	},
};
