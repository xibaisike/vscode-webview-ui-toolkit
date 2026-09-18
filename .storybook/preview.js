import '../src/index-rollup';
import '../stories/storybook.css';

const themes = {
	'dark': {
		kind: 'vscode-dark',
		colorScheme: 'dark',
		variables: {
			'--vscode-editor-background': '#1e1e1e',
			'--vscode-foreground': '#cccccc',
			'--vscode-font-family':
				"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
			'--vscode-font-size': '13px',
			'--vscode-font-weight': '400',
			'--vscode-focusBorder': '#007fd4',
			'--vscode-contrastActiveBorder': 'transparent',
			'--vscode-contrastBorder': 'transparent',
			'--vscode-button-background': '#0e639c',
			'--vscode-button-foreground': '#ffffff',
			'--vscode-button-hoverBackground': '#1177bb',
			'--vscode-button-border': 'transparent',
			'--vscode-button-secondaryBackground': '#3a3d41',
			'--vscode-button-secondaryForeground': '#ffffff',
			'--vscode-button-secondaryHoverBackground': '#45494e',
			'--vscode-badge-background': '#4d4d4d',
			'--vscode-badge-foreground': '#ffffff',
			'--vscode-checkbox-background': '#3c3c3c',
			'--vscode-checkbox-border': '#3c3c3c',
			'--vscode-checkbox-foreground': '#f0f0f0',
			'--vscode-dropdown-background': '#3c3c3c',
			'--vscode-dropdown-border': '#3c3c3c',
			'--vscode-dropdown-foreground': '#f0f0f0',
			'--vscode-input-background': '#3c3c3c',
			'--vscode-input-foreground': '#cccccc',
			'--vscode-input-placeholderForeground': '#888888',
			'--vscode-textLink-foreground': '#3794ff',
			'--vscode-textLink-activeForeground': '#4daafc',
			'--vscode-progressBar-background': '#0e70c0',
			'--vscode-panelTitle-activeBorder': '#e7e7e7',
			'--vscode-panelTitle-activeForeground': '#e7e7e7',
			'--vscode-panelTitle-inactiveForeground': '#e7e7e799',
			'--vscode-panel-background': '#181818',
			'--vscode-panel-border': '#80808059',
			'--vscode-list-activeSelectionBackground': '#094771',
			'--vscode-list-activeSelectionForeground': '#ffffff',
			'--vscode-list-hoverBackground': '#2a2d2e',
			'--vscode-scrollbarSlider-background': '#79797966',
			'--vscode-scrollbarSlider-hoverBackground': '#646464b3',
			'--vscode-scrollbarSlider-activeBackground': '#bfbfbf66',
			'--vscode-settings-dropdownListBorder': '#454545',
		},
	},
	'light': {
		kind: 'vscode-light',
		colorScheme: 'light',
		variables: {
			'--vscode-editor-background': '#ffffff',
			'--vscode-foreground': '#1f1f1f',
			'--vscode-font-family':
				"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
			'--vscode-font-size': '13px',
			'--vscode-font-weight': '400',
			'--vscode-focusBorder': '#007acc',
			'--vscode-contrastActiveBorder': 'transparent',
			'--vscode-contrastBorder': 'transparent',
			'--vscode-button-background': '#0e639c',
			'--vscode-button-foreground': '#ffffff',
			'--vscode-button-hoverBackground': '#1177bb',
			'--vscode-button-border': 'transparent',
			'--vscode-button-secondaryBackground': '#e8e8e8',
			'--vscode-button-secondaryForeground': '#333333',
			'--vscode-button-secondaryHoverBackground': '#d0d0d0',
			'--vscode-badge-background': '#c7c7c7',
			'--vscode-badge-foreground': '#333333',
			'--vscode-checkbox-background': '#f3f3f3',
			'--vscode-checkbox-border': '#cecece',
			'--vscode-checkbox-foreground': '#1f1f1f',
			'--vscode-dropdown-background': '#f3f3f3',
			'--vscode-dropdown-border': '#cecece',
			'--vscode-dropdown-foreground': '#1f1f1f',
			'--vscode-input-background': '#ffffff',
			'--vscode-input-foreground': '#1f1f1f',
			'--vscode-input-placeholderForeground': '#6b6b6b',
			'--vscode-textLink-foreground': '#005fb8',
			'--vscode-textLink-activeForeground': '#004999',
			'--vscode-progressBar-background': '#0f6cbd',
			'--vscode-panelTitle-activeBorder': '#0f6cbd',
			'--vscode-panelTitle-activeForeground': '#1f1f1f',
			'--vscode-panelTitle-inactiveForeground': '#616161',
			'--vscode-panel-background': '#f8f8f8',
			'--vscode-panel-border': '#d4d4d4',
			'--vscode-list-activeSelectionBackground': '#dbeafe',
			'--vscode-list-activeSelectionForeground': '#1f1f1f',
			'--vscode-list-hoverBackground': '#f1f1f1',
			'--vscode-scrollbarSlider-background': '#c7c7c7',
			'--vscode-scrollbarSlider-hoverBackground': '#a6a6a6',
			'--vscode-scrollbarSlider-activeBackground': '#8c8c8c',
			'--vscode-settings-dropdownListBorder': '#cecece',
		},
	},
	'high-contrast': {
		kind: 'vscode-high-contrast',
		colorScheme: 'dark',
		variables: {
			'--vscode-editor-background': '#000000',
			'--vscode-foreground': '#ffffff',
			'--vscode-font-family':
				"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
			'--vscode-font-size': '13px',
			'--vscode-font-weight': '400',
			'--vscode-focusBorder': '#f38518',
			'--vscode-contrastActiveBorder': '#f38518',
			'--vscode-contrastBorder': '#6fc3df',
			'--vscode-button-background': '#000000',
			'--vscode-button-foreground': '#ffffff',
			'--vscode-button-hoverBackground': '#0f4a85',
			'--vscode-button-border': '#f38518',
			'--vscode-button-secondaryBackground': 'transparent',
			'--vscode-button-secondaryForeground': '#ffffff',
			'--vscode-button-secondaryHoverBackground': 'transparent',
			'--vscode-badge-background': '#000000',
			'--vscode-badge-foreground': '#ffffff',
			'--vscode-checkbox-background': '#000000',
			'--vscode-checkbox-border': '#ffffff',
			'--vscode-checkbox-foreground': '#ffffff',
			'--vscode-dropdown-background': '#000000',
			'--vscode-dropdown-border': '#ffffff',
			'--vscode-dropdown-foreground': '#ffffff',
			'--vscode-input-background': '#000000',
			'--vscode-input-foreground': '#ffffff',
			'--vscode-input-placeholderForeground': '#cfcfcf',
			'--vscode-textLink-foreground': '#75beff',
			'--vscode-textLink-activeForeground': '#9cdcfe',
			'--vscode-progressBar-background': '#75beff',
			'--vscode-panelTitle-activeBorder': '#f38518',
			'--vscode-panelTitle-activeForeground': '#ffffff',
			'--vscode-panelTitle-inactiveForeground': '#ffffff',
			'--vscode-panel-background': '#000000',
			'--vscode-panel-border': '#ffffff',
			'--vscode-list-activeSelectionBackground': '#000000',
			'--vscode-list-activeSelectionForeground': '#ffffff',
			'--vscode-list-hoverBackground': '#1a1a1a',
			'--vscode-scrollbarSlider-background': '#6fc3df',
			'--vscode-scrollbarSlider-hoverBackground': '#f38518',
			'--vscode-scrollbarSlider-activeBackground': '#ffffff',
			'--vscode-settings-dropdownListBorder': '#ffffff',
		},
	},
};

function applyTheme(themeName) {
	const theme = themes[themeName] ?? themes.dark;
	const body = document.body;

	body.setAttribute('data-vscode-theme-kind', theme.kind);
	body.style.colorScheme = theme.colorScheme;

	for (const [name, value] of Object.entries(theme.variables)) {
		body.style.setProperty(name, value);
	}
}

export const globalTypes = {
	vscodeTheme: {
		name: 'VS Code theme',
		description:
			'Preview the component gallery with representative VS Code theme tokens.',
		defaultValue: 'dark',
		toolbar: {
			icon: 'paintbrush',
			items: [
				{value: 'dark', title: 'Dark'},
				{value: 'light', title: 'Light'},
				{value: 'high-contrast', title: 'High Contrast'},
			],
			dynamicTitle: true,
		},
	},
};

export default {
	decorators: [
		(story, context) => {
			applyTheme(context.globals.vscodeTheme);

			const shell = document.createElement('div');
			shell.className = 'sb-vscode-root';
			if (context.parameters.fullWidth) {
				shell.classList.add('sb-vscode-root--full-width');
			}

			shell.append(story());
			return shell;
		},
	],
	parameters: {
		a11y: {
			manual: false,
		},
		backgrounds: {
			disable: true,
		},
		controls: {
			expanded: true,
		},
		options: {
			storySort: {
				order: ['Introduction', 'Components'],
			},
		},
	},
};
