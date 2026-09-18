import {createComponent, createStoryStack, createText} from './helpers';

export default {
	title: 'Components/Link',
	tags: ['autodocs'],
	argTypes: {
		href: {control: 'text'},
		label: {control: 'text'},
	},
	render: ({href, label}) => {
		const root = createStoryStack();
		const link = createComponent('vscode-link', {href});
		link.textContent = label;
		root.append(
			link,
			createText(
				'Use links for navigation rather than commands or immediate actions.'
			)
		);
		return root;
	},
};

export const Playground = {
	args: {
		href: 'https://code.visualstudio.com/api',
		label: 'Open the VS Code extension API guide',
	},
};

export const Inline = {
	render: () => {
		const paragraph = document.createElement('p');
		paragraph.className = 'sb-text-block';
		paragraph.append(document.createTextNode('Read the '));
		const link = createComponent('vscode-link', {
			href: 'https://code.visualstudio.com/api',
		});
		link.textContent = 'extension API guide';
		paragraph.append(
			link,
			document.createTextNode(' for deeper platform guidance.')
		);
		return paragraph;
	},
};
