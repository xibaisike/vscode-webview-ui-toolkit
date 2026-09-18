import {
	createComponent,
	createInlineCluster,
	createStoryStack,
	createText,
} from './helpers';

export default {
	title: 'Components/Badge',
	tags: ['autodocs'],
	argTypes: {
		appearance: {
			control: 'select',
			options: ['primary', 'secondary'],
		},
		label: {control: 'text'},
	},
	render: ({appearance, label}) => {
		const root = createStoryStack();
		const cluster = createInlineCluster();
		const badge = createComponent('vscode-badge', {appearance});
		badge.textContent = label;
		cluster.append(badge);
		root.append(
			cluster,
			createText(
				'Badges are useful for small counts and lightweight status emphasis.'
			)
		);
		return root;
	},
};

export const Playground = {
	args: {
		appearance: 'primary',
		label: '4',
	},
};

export const CommonUsage = {
	render: () => {
		const root = createStoryStack();
		const cluster = createInlineCluster();

		for (const [appearance, value] of [
			['primary', '4'],
			['secondary', 'Beta'],
		]) {
			const badge = createComponent('vscode-badge', {appearance});
			badge.textContent = value;
			cluster.append(badge);
		}

		root.append(cluster);
		return root;
	},
};
