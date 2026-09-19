// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {attr, html, observable, ref} from '@microsoft/fast-element';
import {
	FoundationElement,
	FoundationElementDefinition,
} from '@microsoft/fast-foundation';
import {treeItemStyles, treeViewStyles} from './tree-view.styles.js';

/**
 * The selection behavior of a tree view.
 *
 * @public
 */
export type TreeSelectionMode = 'single' | 'multiple';

/**
 * Details emitted when a tree view selection changes.
 *
 * @public
 */
export interface TreeSelectionChangeEventDetail {
	/**
	 * The selected items in tree order.
	 */
	readonly selectedItems: TreeItem[];
}

/**
 * Details emitted when a tree item is invoked.
 *
 * @public
 */
export interface TreeItemInvokeEventDetail {
	/**
	 * The invoked item.
	 */
	readonly item: TreeItem;
}

/**
 * Details emitted when a tree item is expanded or collapsed.
 *
 * @public
 */
export interface TreeItemExpandedChangeEventDetail {
	/**
	 * The item whose expansion changed.
	 */
	readonly item: TreeItem;
	/**
	 * The item's new expansion state.
	 */
	readonly expanded: boolean;
}

/**
 * A tree selection change event.
 *
 * @public
 */
export type TreeSelectionChangeEvent =
	CustomEvent<TreeSelectionChangeEventDetail>;

/**
 * A tree item invocation event.
 *
 * @public
 */
export type TreeItemInvokeEvent = CustomEvent<TreeItemInvokeEventDetail>;

/**
 * A tree item expansion change event.
 *
 * @public
 */
export type TreeItemExpandedChangeEvent =
	CustomEvent<TreeItemExpandedChangeEventDetail>;

const treeViewTemplate = html<TreeView>`
	<slot @slotchange="${x => x.refresh()}"></slot>
`;

const treeItemTemplate = html<TreeItem>`
	<div class="row" part="row">
		<button
			class="disclosure"
			part="disclosure"
			type="button"
			tabindex="-1"
			aria-label="${x => (x.expanded ? 'Collapse' : 'Expand')}"
			aria-hidden="${x => (!x.hasChildren).toString()}"
			?disabled="${x => !x.hasChildren || x.disabled}"
			@click="${(x, c) => x.handleDisclosureClick(c.event)}"
			@dblclick="${(x, c) => x.stopDisclosureEvent(c.event)}"
		>
			<svg viewBox="0 0 16 16" aria-hidden="true">
				<path d="M6 4l4 4-4 4z"></path>
			</svg>
		</button>
		<span class="start" part="start"><slot name="start"></slot></span>
		<span class="label" part="label">
			<slot
				${ref('labelSlot')}
				@slotchange="${x => x.handleLabelChange()}"
			></slot>
		</span>
		<span class="description" part="description">
			<slot name="description"></slot>
		</span>
		<span class="actions" part="actions"><slot name="actions"></slot></span>
	</div>
	<div
		class="children"
		part="children"
		role="group"
		?hidden="${x => !x.expanded || !x.hasChildren}"
	>
		<slot
			name="children"
			@slotchange="${x => x.handleChildrenChange()}"
		></slot>
	</div>
`;

/**
 * A tree item displayed within a {@link TreeView}.
 *
 * @remarks
 * HTML Element: `<vscode-tree-item>`
 *
 * @public
 */
export class TreeItem extends FoundationElement {
	/**
	 * Whether the item's child group is visible.
	 *
	 * @public
	 */
	@attr({mode: 'boolean'}) public expanded = false;

	/**
	 * Whether the item is selected.
	 *
	 * @public
	 */
	@attr({mode: 'boolean'}) public selected = false;

	/**
	 * Whether user interaction with the item is disabled.
	 *
	 * @public
	 */
	@attr({mode: 'boolean'}) public disabled = false;

	/**
	 * The item label used for type-ahead navigation.
	 *
	 * @public
	 */
	@attr public label = '';

	/** @internal */
	@observable public hasChildren = false;

	/** @internal */
	public labelSlot!: HTMLSlotElement;

	private childrenObserver?: MutationObserver;

	/** @internal */
	public connectedCallback() {
		super.connectedCallback();
		this.setAttribute('role', 'treeitem');
		this.childrenObserver = new MutationObserver(() =>
			this.handleChildrenChange()
		);
		this.childrenObserver.observe(this, {childList: true});
		this.handleChildrenChange();
		this.syncAriaState();
	}

	/** @internal */
	public disconnectedCallback() {
		this.childrenObserver?.disconnect();
		this.childrenObserver = undefined;
		super.disconnectedCallback();
	}

	/**
	 * The direct child tree items.
	 *
	 * @public
	 */
	public get childItems(): TreeItem[] {
		return Array.from(this.children).filter(
			(child): child is TreeItem => child instanceof TreeItem
		);
	}

	/**
	 * The closest parent tree item.
	 *
	 * @public
	 */
	public get parentItem(): TreeItem | null {
		return this.parentElement?.closest(
			'vscode-tree-item'
		) as TreeItem | null;
	}

	/**
	 * The text used for type-ahead navigation.
	 *
	 * @public
	 */
	public get textLabel(): string {
		if (this.label.trim()) {
			return this.label.trim();
		}

		return (
			this.labelSlot
				?.assignedNodes({flatten: true})
				.map(node => node.textContent ?? '')
				.join(' ')
				.replace(/\s+/g, ' ')
				.trim() ?? ''
		);
	}

	/** @internal */
	public handleChildrenChange() {
		const childItems = this.childItems;
		let changed = this.hasChildren !== childItems.length > 0;
		for (const item of childItems) {
			if (item.slot !== 'children') {
				item.slot = 'children';
				changed = true;
			}
		}

		this.hasChildren = childItems.length > 0;
		if (!this.hasChildren && this.expanded) {
			this.expanded = false;
			changed = true;
		}
		this.syncAriaState();
		if (changed) {
			this.notifyTree();
		}
	}

	/** @internal */
	public handleLabelChange() {
		this.notifyTree();
	}

	/** @internal */
	public handleDisclosureClick(event: Event) {
		event.stopPropagation();
		if (!this.disabled && this.hasChildren) {
			this.expanded = !this.expanded;
		}
	}

	/** @internal */
	public stopDisclosureEvent(event: Event) {
		event.stopPropagation();
	}

	private expandedChanged(oldValue: boolean, newValue: boolean) {
		this.syncAriaState();
		if (oldValue !== undefined && oldValue !== newValue) {
			this.dispatchEvent(
				new CustomEvent<TreeItemExpandedChangeEventDetail>(
					'expanded-change',
					{
						bubbles: true,
						composed: true,
						detail: {item: this, expanded: newValue},
					}
				)
			);
		}
		this.notifyTree();
	}

	private selectedChanged() {
		this.syncAriaState();
	}

	private disabledChanged() {
		this.syncAriaState();
		this.notifyTree();
	}

	private labelChanged() {
		this.notifyTree();
	}

	private syncAriaState() {
		if (!this.$fastController.isConnected) {
			return;
		}

		this.setAttribute('aria-selected', this.selected.toString());
		if (this.disabled) {
			this.setAttribute('aria-disabled', 'true');
		} else {
			this.removeAttribute('aria-disabled');
		}

		if (this.hasChildren) {
			this.setAttribute('aria-expanded', this.expanded.toString());
		} else {
			this.removeAttribute('aria-expanded');
		}
	}

	private notifyTree() {
		if (!this.$fastController.isConnected) {
			return;
		}

		this.dispatchEvent(
			new CustomEvent('tree-item-state-change', {
				bubbles: true,
				composed: true,
			})
		);
	}
}

/**
 * The Visual Studio Code tree item component registration.
 *
 * @public
 */
export const vsCodeTreeItem = TreeItem.compose<
	FoundationElementDefinition,
	typeof TreeItem
>({
	baseName: 'tree-item',
	template: treeItemTemplate,
	styles: treeItemStyles,
});

/**
 * A container that coordinates hierarchical tree items.
 *
 * @remarks
 * HTML Element: `<vscode-tree-view>`
 *
 * @public
 */
export class TreeView extends FoundationElement {
	/**
	 * The tree's selection behavior.
	 *
	 * @public
	 */
	@attr({attribute: 'selection-mode'})
	public selectionMode: TreeSelectionMode = 'single';

	private activeItem: TreeItem | null = null;
	private selectionAnchor: TreeItem | null = null;
	private mutationObserver?: MutationObserver;
	private typeAhead = '';
	private typeAheadTimer?: number;
	private refreshQueued = false;

	/** @internal */
	public connectedCallback() {
		super.connectedCallback();
		this.setAttribute('role', 'tree');
		this.addEventListener('click', this.handleClick);
		this.addEventListener('dblclick', this.handleDoubleClick);
		this.addEventListener('keydown', this.handleKeyDown);
		this.addEventListener(
			'tree-item-state-change',
			this.handleItemStateChange
		);
		this.mutationObserver = new MutationObserver(() => this.queueRefresh());
		this.mutationObserver.observe(this, {
			childList: true,
			subtree: true,
		});
		this.refresh();
	}

	/** @internal */
	public disconnectedCallback() {
		this.removeEventListener('click', this.handleClick);
		this.removeEventListener('dblclick', this.handleDoubleClick);
		this.removeEventListener('keydown', this.handleKeyDown);
		this.removeEventListener(
			'tree-item-state-change',
			this.handleItemStateChange
		);
		this.mutationObserver?.disconnect();
		this.mutationObserver = undefined;
		if (this.typeAheadTimer !== undefined) {
			window.clearTimeout(this.typeAheadTimer);
		}
		super.disconnectedCallback();
	}

	/**
	 * The currently selected tree items.
	 *
	 * @public
	 */
	public get selectedItems(): TreeItem[] {
		return this.items.filter(item => item.selected);
	}

	/**
	 * Recomputes tree ownership, accessibility metadata, and focus state.
	 *
	 * @public
	 */
	public refresh() {
		if (!this.$fastController.isConnected) {
			return;
		}

		this.refreshQueued = false;
		this.syncItemGroup(this.rootItems, 1);
		this.enforceSelectionMode();

		const visibleItems = this.visibleEnabledItems;
		if (!this.activeItem || !visibleItems.includes(this.activeItem)) {
			this.activeItem =
				this.findVisibleAncestor(this.activeItem) ??
				visibleItems[0] ??
				null;
		}

		for (const item of this.items) {
			item.tabIndex = item === this.activeItem ? 0 : -1;
		}

		this.tabIndex = visibleItems.length === 0 ? 0 : -1;
		this.setAttribute(
			'aria-multiselectable',
			(this.selectionMode === 'multiple').toString()
		);
	}

	/**
	 * Focuses a visible, enabled item contained by this tree.
	 *
	 * @param item - The item to focus.
	 * @returns Whether focus was moved.
	 *
	 * @public
	 */
	public focusItem(item: TreeItem): boolean {
		if (!this.visibleEnabledItems.includes(item)) {
			return false;
		}

		this.setActiveItem(item, true);
		return true;
	}

	/**
	 * Expands every parent item.
	 *
	 * @public
	 */
	public expandAll() {
		for (const item of this.items) {
			if (item.hasChildren && !item.disabled) {
				item.expanded = true;
			}
		}
		this.refresh();
	}

	/**
	 * Collapses every parent item.
	 *
	 * @public
	 */
	public collapseAll() {
		for (const item of this.items) {
			if (item.hasChildren && !item.disabled) {
				item.expanded = false;
			}
		}
		this.refresh();
		if (this.activeItem) {
			this.activeItem.focus();
		}
	}

	private get items(): TreeItem[] {
		return Array.from(this.querySelectorAll('vscode-tree-item')).filter(
			(item): item is TreeItem =>
				item instanceof TreeItem &&
				item.closest('vscode-tree-view') === this
		);
	}

	private get rootItems(): TreeItem[] {
		return Array.from(this.children).filter(
			(item): item is TreeItem => item instanceof TreeItem
		);
	}

	private get visibleItems(): TreeItem[] {
		return this.items.filter(item => this.isVisible(item));
	}

	private get visibleEnabledItems(): TreeItem[] {
		return this.visibleItems.filter(item => !item.disabled);
	}

	private selectionModeChanged() {
		this.refresh();
	}

	private queueRefresh() {
		if (this.refreshQueued) {
			return;
		}
		this.refreshQueued = true;
		queueMicrotask(() => this.refresh());
	}

	private readonly handleItemStateChange = () => {
		this.queueRefresh();
	};

	private syncItemGroup(items: TreeItem[], level: number) {
		const setSize = items.length;
		items.forEach((item, index) => {
			if (item.parentElement === this && item.slot) {
				item.removeAttribute('slot');
			}
			item.setAttribute('aria-level', level.toString());
			item.setAttribute('aria-posinset', (index + 1).toString());
			item.setAttribute('aria-setsize', setSize.toString());
			item.style.setProperty('--tree-item-level', level.toString());
			this.syncItemGroup(item.childItems, level + 1);
		});
	}

	private enforceSelectionMode() {
		const selected = this.selectedItems;
		if (this.selectionMode === 'single' && selected.length > 1) {
			for (const item of selected.slice(1)) {
				item.selected = false;
			}
		}
		if (
			this.selectionAnchor &&
			!this.items.includes(this.selectionAnchor)
		) {
			this.selectionAnchor = null;
		}
	}

	private isVisible(item: TreeItem): boolean {
		let parent = item.parentItem;
		while (parent) {
			if (!parent.expanded) {
				return false;
			}
			parent = parent.parentItem;
		}
		return true;
	}

	private findVisibleAncestor(item: TreeItem | null): TreeItem | null {
		let candidate = item?.parentItem ?? null;
		while (candidate) {
			if (this.isVisible(candidate) && !candidate.disabled) {
				return candidate;
			}
			candidate = candidate.parentItem;
		}
		return null;
	}

	private setActiveItem(item: TreeItem, moveFocus: boolean) {
		if (this.activeItem && this.activeItem !== item) {
			this.activeItem.tabIndex = -1;
		}
		this.activeItem = item;
		item.tabIndex = 0;
		if (moveFocus) {
			item.focus();
		}
	}

	private getEventItem(event: Event): TreeItem | null {
		for (const target of event.composedPath()) {
			if (target instanceof TreeItem) {
				return target.closest('vscode-tree-view') === this
					? target
					: null;
			}
		}
		return null;
	}

	private isActionEvent(event: Event, item: TreeItem): boolean {
		for (const target of event.composedPath()) {
			if (target === item) {
				break;
			}
			if (
				target instanceof HTMLElement &&
				(target.slot === 'actions' ||
					target.assignedSlot?.name === 'actions')
			) {
				return true;
			}
		}
		return false;
	}

	private readonly handleClick = (event: MouseEvent) => {
		const item = this.getEventItem(event);
		if (!item || item.disabled || this.isActionEvent(event, item)) {
			return;
		}

		this.setActiveItem(item, true);
		this.selectItem(item, {
			toggle:
				this.selectionMode === 'multiple' &&
				(event.ctrlKey || event.metaKey),
			range: this.selectionMode === 'multiple' && event.shiftKey,
		});
	};

	private readonly handleDoubleClick = (event: MouseEvent) => {
		const item = this.getEventItem(event);
		if (!item || item.disabled || this.isActionEvent(event, item)) {
			return;
		}

		event.preventDefault();
		if (item.hasChildren) {
			item.expanded = !item.expanded;
		} else {
			this.invokeItem(item);
		}
	};

	private readonly handleKeyDown = (event: KeyboardEvent) => {
		const item = this.getEventItem(event) ?? this.activeItem;
		if (!item || item.disabled || this.isActionEvent(event, item)) {
			return;
		}

		const visible = this.visibleEnabledItems;
		const index = visible.indexOf(item);
		let target: TreeItem | undefined;

		switch (event.key) {
			case 'ArrowDown':
				target = visible[Math.min(index + 1, visible.length - 1)];
				break;
			case 'ArrowUp':
				target = visible[Math.max(index - 1, 0)];
				break;
			case 'Home':
				target = visible[0];
				break;
			case 'End':
				target = visible[visible.length - 1];
				break;
			case 'ArrowRight':
				if (item.hasChildren && !item.expanded) {
					item.expanded = true;
				} else {
					target = item.childItems.find(child => !child.disabled);
				}
				break;
			case 'ArrowLeft':
				if (item.hasChildren && item.expanded) {
					item.expanded = false;
				} else {
					target = item.parentItem ?? undefined;
				}
				break;
			case ' ':
				this.selectItem(item, {
					toggle:
						this.selectionMode === 'multiple' &&
						(event.ctrlKey || event.metaKey),
					range: this.selectionMode === 'multiple' && event.shiftKey,
				});
				break;
			case 'Enter':
				if (item.hasChildren) {
					item.expanded = !item.expanded;
				} else {
					this.invokeItem(item);
				}
				break;
			default:
				if (
					event.key.length === 1 &&
					!event.altKey &&
					!event.ctrlKey &&
					!event.metaKey
				) {
					this.handleTypeAhead(event.key, item);
					event.preventDefault();
				}
				return;
		}

		event.preventDefault();
		if (target && !target.disabled) {
			this.setActiveItem(target, true);
		}
	};

	private handleTypeAhead(character: string, current: TreeItem) {
		if (this.typeAheadTimer !== undefined) {
			window.clearTimeout(this.typeAheadTimer);
		}
		this.typeAhead += character.toLocaleLowerCase();
		this.typeAheadTimer = window.setTimeout(() => {
			this.typeAhead = '';
			this.typeAheadTimer = undefined;
		}, 700);

		const visible = this.visibleEnabledItems;
		const currentIndex = visible.indexOf(current);
		const ordered = [
			...visible.slice(currentIndex + 1),
			...visible.slice(0, currentIndex + 1),
		];
		const match = ordered.find(item =>
			item.textLabel.toLocaleLowerCase().startsWith(this.typeAhead)
		);
		if (match) {
			this.setActiveItem(match, true);
		}
	}

	private selectItem(
		item: TreeItem,
		options: {toggle: boolean; range: boolean}
	) {
		const previous = this.selectedItems;
		if (
			options.range &&
			this.selectionAnchor &&
			this.isVisible(this.selectionAnchor)
		) {
			const visible = this.visibleEnabledItems;
			const anchorIndex = visible.indexOf(this.selectionAnchor);
			const itemIndex = visible.indexOf(item);
			const start = Math.min(anchorIndex, itemIndex);
			const end = Math.max(anchorIndex, itemIndex);
			const range = new Set(visible.slice(start, end + 1));
			for (const candidate of this.items) {
				candidate.selected = range.has(candidate);
			}
		} else if (options.toggle) {
			item.selected = !item.selected;
			this.selectionAnchor = item;
		} else {
			for (const candidate of this.items) {
				candidate.selected = candidate === item;
			}
			this.selectionAnchor = item;
		}

		const selectedItems = this.selectedItems;
		if (
			previous.length !== selectedItems.length ||
			previous.some(
				(selected, index) => selectedItems[index] !== selected
			)
		) {
			this.dispatchEvent(
				new CustomEvent<TreeSelectionChangeEventDetail>(
					'selection-change',
					{
						bubbles: true,
						composed: true,
						detail: {selectedItems: [...selectedItems]},
					}
				)
			);
		}
	}

	private invokeItem(item: TreeItem) {
		this.dispatchEvent(
			new CustomEvent<TreeItemInvokeEventDetail>('item-invoke', {
				bubbles: true,
				composed: true,
				detail: {item},
			})
		);
	}
}

/**
 * The Visual Studio Code tree view component registration.
 *
 * @public
 */
export const vsCodeTreeView = TreeView.compose<
	FoundationElementDefinition,
	typeof TreeView
>({
	baseName: 'tree-view',
	template: treeViewTemplate,
	styles: treeViewStyles,
});
