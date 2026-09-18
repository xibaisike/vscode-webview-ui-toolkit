import {createComponent, createInlineCluster, createText} from './helpers';

export default {
	title: 'Components/Progress Ring',
	tags: ['autodocs'],
	render: () => {
		const cluster = createInlineCluster();
		cluster.append(
			createComponent('vscode-progress-ring'),
			createText('Indexing workspace…', 'span', 'sb-text-block')
		);
		return cluster;
	},
};

export const Loading = {};
