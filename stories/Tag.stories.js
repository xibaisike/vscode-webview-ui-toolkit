import {createComponent, createInlineCluster} from './helpers';

export default {
	title: 'Components/Tag',
	tags: ['autodocs'],
	render: () => {
		const cluster = createInlineCluster();
		for (const label of ['Preview', 'Deprecated', 'Requires reload']) {
			const tag = createComponent('vscode-tag');
			tag.textContent = label;
			cluster.append(tag);
		}
		return cluster;
	},
};

export const Basic = {};
