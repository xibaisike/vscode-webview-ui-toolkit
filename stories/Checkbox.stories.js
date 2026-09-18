import {createComponent, createStatusText, createStoryStack} from './helpers';

export default {
	title: 'Components/Checkbox',
	tags: ['autodocs'],
	argTypes: {
		checked: {control: 'boolean'},
		disabled: {control: 'boolean'},
		label: {control: 'text'},
	},
	render: ({checked, disabled, label}) => {
		const root = createStoryStack();
		const status = createStatusText(`Checked: ${checked}`);
		const checkbox = createComponent('vscode-checkbox', {
			checked,
			disabled,
		});
		checkbox.textContent = label;
		checkbox.addEventListener('change', () => {
			status.textContent = `Checked: ${checkbox.hasAttribute('checked')}`;
		});
		root.append(checkbox, status);
		return root;
	},
};

export const Playground = {
	args: {
		checked: false,
		disabled: false,
		label: 'Enable diagnostics',
	},
};

export const States = {
	render: () => {
		const root = createStoryStack();
		for (const [label, checked, disabled] of [
			['Unchecked', false, false],
			['Checked', true, false],
			['Disabled', false, true],
		]) {
			const checkbox = createComponent('vscode-checkbox', {
				checked,
				disabled,
			});
			checkbox.textContent = label;
			root.append(checkbox);
		}
		return root;
	},
};
