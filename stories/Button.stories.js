import {
	createComponent,
	createInlineCluster,
	createSlotIcon,
	createStatusText,
	createStoryStack,
} from './helpers';

function renderButton(args) {
	const button = createComponent('vscode-button', {
		'appearance': args.appearance,
		'disabled': args.disabled,
		'aria-label': args.appearance === 'icon' ? args.ariaLabel : undefined,
	});

	if (args.appearance === 'icon') {
		button.append(createSlotIcon('✓'));
		return button;
	}

	if (args.showStartIcon) {
		button.append(createSlotIcon('+', 'start'));
	}
	button.append(document.createTextNode(args.label));
	return button;
}

export default {
	title: 'Components/Button',
	tags: ['autodocs'],
	argTypes: {
		appearance: {
			control: 'select',
			options: ['primary', 'secondary', 'icon'],
		},
		label: {control: 'text'},
		disabled: {control: 'boolean'},
		showStartIcon: {control: 'boolean'},
		ariaLabel: {control: 'text'},
	},
	render: args => {
		const root = createStoryStack();
		const cluster = createInlineCluster();
		const status = createStatusText('Last click: none');
		const button = renderButton(args);

		button.addEventListener('click', () => {
			status.textContent = `Last click: ${args.appearance} button activated`;
		});

		cluster.append(button);
		root.append(cluster, status);
		return root;
	},
};

export const Playground = {
	args: {
		appearance: 'primary',
		label: 'Save',
		disabled: false,
		showStartIcon: false,
		ariaLabel: 'Confirm',
	},
};

export const Variants = {
	render: () => {
		const cluster = createInlineCluster();
		cluster.append(
			renderButton({
				appearance: 'primary',
				label: 'Save',
				disabled: false,
				showStartIcon: false,
				ariaLabel: 'Save',
			}),
			renderButton({
				appearance: 'secondary',
				label: 'Cancel',
				disabled: false,
				showStartIcon: false,
				ariaLabel: 'Cancel',
			}),
			renderButton({
				appearance: 'icon',
				label: '',
				disabled: false,
				showStartIcon: false,
				ariaLabel: 'Confirm changes',
			})
		);
		return cluster;
	},
};

export const WithStartIcon = {
	args: {
		appearance: 'primary',
		label: 'Add item',
		disabled: false,
		showStartIcon: true,
		ariaLabel: 'Add item',
	},
};
