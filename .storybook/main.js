export default {
	stories: ['../stories/**/*.stories.js'],
	addons: ['@storybook/addon-a11y'],
	framework: {
		name: '@storybook/web-components-vite',
		options: {},
	},
	docs: {
		defaultName: 'Overview',
	},
};
