import {createComponent, createText} from './helpers';

export default {
	title: 'Components/Divider',
	tags: ['autodocs'],
	render: () => {
		const root = document.createElement('div');
		root.className = 'sb-divider-stack';
		root.append(
			createText('General settings'),
			createComponent('vscode-divider'),
			createText('Workspace settings'),
			createComponent('vscode-divider'),
			createText('Profile settings')
		);
		return root;
	},
};

export const Basic = {};
