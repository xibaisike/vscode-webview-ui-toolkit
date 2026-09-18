import {createComponent, createStoryStack} from './helpers';

function createRadioGroup(args) {
	const group = createComponent('vscode-radio-group', {
		disabled: args.disabled,
		orientation: args.orientation,
		readonly: args.readonly,
	});
	group.innerHTML = `
		<label slot="label">Telemetry level</label>
		<vscode-radio value="off">Off</vscode-radio>
		<vscode-radio value="error">Errors only</vscode-radio>
		<vscode-radio value="all" checked>All events</vscode-radio>
	`;
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
	},
};

export const Horizontal = {
	args: {
		disabled: false,
		orientation: 'horizontal',
		readonly: false,
	},
};
