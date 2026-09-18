import {createComponent, createStoryStack} from './helpers';

function createRadioGroup(args) {
	const group = createComponent('vscode-radio-group', {
		disabled: args.disabled,
		orientation: args.orientation,
		readonly: args.readonly,
	});

	const label = document.createElement('label');
	label.slot = 'label';
	label.textContent = 'Telemetry level';

	const off = createComponent('vscode-radio', {value: 'off'});
	off.textContent = 'Off';

	const errors = createComponent('vscode-radio', {value: 'error'});
	errors.textContent = 'Errors only';

	const all = createComponent('vscode-radio', {
		value: 'all',
		checked: args.value === 'all',
	});
	all.textContent = 'All events';

	off.checked = args.value === 'off';
	errors.checked = args.value === 'error';

	group.append(label, off, errors, all);
	return group;
}

export default {
	title: 'Components/Radio Group',
	tags: ['autodocs'],
	argTypes: {
		disabled: {control: 'boolean'},
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
		},
		readonly: {control: 'boolean'},
		value: {
			control: 'select',
			options: ['off', 'error', 'all'],
		},
	},
	render: args => {
		const root = createStoryStack();
		root.append(createRadioGroup(args));
		return root;
	},
};

export const Playground = {
	args: {
		disabled: false,
		orientation: 'vertical',
		readonly: false,
		value: 'all',
	},
};

export const Horizontal = {
	args: {
		disabled: false,
		orientation: 'horizontal',
		readonly: false,
		value: 'error',
	},
};
