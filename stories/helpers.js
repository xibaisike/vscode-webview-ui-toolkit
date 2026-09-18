export function createStoryStack(wide = false) {
	const root = document.createElement('div');
	root.className = wide
		? 'sb-story-stack sb-story-stack--wide'
		: 'sb-story-stack';
	return root;
}

export function createComponent(tagName, attributes = {}) {
	const element = document.createElement(tagName);

	for (const [name, value] of Object.entries(attributes)) {
		if (value === false || value === undefined || value === null) {
			continue;
		}

		if (value === true) {
			element.setAttribute(name, '');
			continue;
		}

		element.setAttribute(name, String(value));
	}

	return element;
}

export function createText(
	content,
	tagName = 'p',
	className = 'sb-text-block'
) {
	const text = document.createElement(tagName);
	text.className = className;
	text.textContent = content;
	return text;
}

export function createLabel(labelText, controlId) {
	const label = document.createElement('label');
	label.className = 'sb-label';
	label.htmlFor = controlId;
	label.textContent = labelText;
	return label;
}

export function createFormField(labelText, control, helperText) {
	const field = document.createElement('div');
	field.className = 'sb-form-field';
	field.append(createLabel(labelText, control.id), control);

	if (helperText) {
		const helper = document.createElement('div');
		helper.className = 'sb-helper-text';
		helper.textContent = helperText;
		field.append(helper);
	}

	return field;
}

export function createInlineCluster(spread = false) {
	const cluster = document.createElement('div');
	cluster.className = spread
		? 'sb-inline-cluster sb-inline-cluster--spread'
		: 'sb-inline-cluster';
	return cluster;
}

export function createSlotIcon(symbol, slot) {
	const icon = document.createElement('span');
	icon.textContent = symbol;
	icon.setAttribute('aria-hidden', 'true');
	if (slot) {
		icon.slot = slot;
	}
	return icon;
}

export function createStatusText(initialText) {
	const status = document.createElement('div');
	status.className = 'sb-helper-text';
	status.textContent = initialText;
	return status;
}
