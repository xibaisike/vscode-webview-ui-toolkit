// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {attr, html, observable, ref} from '@microsoft/fast-element';
import {
	FoundationElement,
	FoundationElementDefinition,
} from '@microsoft/fast-foundation';
import {
	contextMenuItemStyles,
	contextMenuStyles,
} from './context-menu.styles.js';

/**
 * Options accepted by {@link ContextMenu.showAt}, {@link ContextMenu.showFor},
 * and {@link ContextMenu.hide}.
 *
 * @public
 */
export interface ContextMenuOptions {
	/**
	 * When `true`, focus is not restored to the invoker after the menu closes.
	 */
	readonly suppressFocusRestore?: boolean;
}

/**
 * Placement computed by the context menu when it opens.
 *
 * - `'initial'` — placement has not been measured yet.
 * - `'right'` / `'left'` — horizontal axis placement.
 * - `'above'` / `'below'` — vertical axis placement.
 *
 * @public
 */
export type ContextMenuPlacement = 'initial' | 'above' | 'below';

/**
 * The detail payload for the `menu-select` event.
 *
 * @public
 */
export interface ContextMenuSelectEventDetail {
	/**
	 * The activated context-menu item.
	 */
	readonly item: ContextMenuItem;
	/**
	 * The command value of the activated item.
	 */
	readonly value: string;
	/**
	 * The invoker element that opened the menu, when one was provided.
	 */
	readonly invoker: HTMLElement | null;
}

/**
 * The detail payload for the `open-change` event.
 *
 * @public
 */
export interface ContextMenuOpenChangeEventDetail {
	/**
	 * The new open state of the menu.
	 */
	readonly open: boolean;
}

/**
 * A `menu-select` event.
 *
 * @public
 */
export type ContextMenuSelectEvent = CustomEvent<ContextMenuSelectEventDetail>;

/**
 * An `open-change` event.
 *
 * @public
 */
export type ContextMenuOpenChangeEvent =
	CustomEvent<ContextMenuOpenChangeEventDetail>;

const VIEWPORT_MARGIN = 4;

/**
 * The menu currently open across the toolkit, if any.
 *
 * @internal
 */
let openMenu: ContextMenu | null = null;

function recordOpenMenu(menu: ContextMenu | null): void {
	openMenu = menu;
}

function closeOpenMenu(): void {
	if (openMenu && openMenu.open) {
		openMenu.hide({suppressFocusRestore: true});
	}
}

const contextMenuItemTemplate = html<ContextMenuItem>`
	<div
		class="row"
		part="row"
		role="menuitem"
		tabindex="${x => x.tabIndex ?? -1}"
		aria-disabled="${x => x.disabled.toString()}"
		@click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
		@mousedown="${(x, c) => x.handleMouseDown(c.event as MouseEvent)}"
	>
		<span class="start" part="start"><slot name="start"></slot></span>
		<span class="label" part="label"><slot></slot></span>
		<span class="shortcut" part="shortcut"
			><slot name="shortcut"></slot
		></span>
	</div>
`;

/**
 * A command item displayed inside a {@link ContextMenu}.
 *
 * @remarks
 * HTML Element: `<vscode-context-menu-item>`
 *
 * @public
 */
export class ContextMenuItem extends FoundationElement {
	/**
	 * The command value associated with the item. The value is reflected to
	 * the `value` attribute and surfaced in the {@link ContextMenuSelectEventDetail}.
	 *
	 * @public
	 */
	@attr public value = '';

	/**
	 * Whether the item is disabled and cannot be activated.
	 *
	 * @public
	 */
	@attr({mode: 'boolean'}) public disabled = false;

	/**
	 * The item's tab stop when participating in roving focus.
	 *
	 * @internal
	 */
	@observable public tabIndex: number = -1;

	/** @internal */
	public connectedCallback() {
		super.connectedCallback();
		this.setAttribute('role', 'menuitem');
		this.syncAriaState();
	}

	/** @internal */
	private disabledChanged() {
		this.syncAriaState();
	}

	/** @internal */
	private syncAriaState() {
		if (!this.$fastController.isConnected) {
			return;
		}

		if (this.disabled) {
			this.setAttribute('aria-disabled', 'true');
		} else {
			this.removeAttribute('aria-disabled');
		}
	}

	/** @internal */
	public handleClick(event: MouseEvent) {
		if (this.disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		const menu = this.closest('vscode-context-menu') as ContextMenu | null;
		menu?.activateItem(this);
	}

	/** @internal */
	public handleMouseDown(event: MouseEvent) {
		// Prevent focus from leaving the menu when items are pressed.
		event.preventDefault();
	}
}

/**
 * The Visual Studio Code context-menu-item component registration.
 *
 * @public
 */
export const vsCodeContextMenuItem = ContextMenuItem.compose<
	FoundationElementDefinition,
	typeof ContextMenuItem
>({
	baseName: 'context-menu-item',
	template: contextMenuItemTemplate,
	styles: contextMenuItemStyles,
});

const contextMenuTemplate = html<ContextMenu>`
	<div
		class="list"
		part="list"
		role="menu"
		${ref('listElement')}
		tabindex="${x => (x.open ? x.tabIndex ?? -1 : -1)}"
		@keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
		@focusin="${(x, c) => x.handleFocusIn(c.event as FocusEvent)}"
	>
		<slot @slotchange="${x => x.handleSlotChange()}"></slot>
	</div>
`;

/**
 * A popup menu of contextual commands.
 *
 * @remarks
 * HTML Element: `<vscode-context-menu>`
 *
 * @public
 */
export class ContextMenu extends FoundationElement {
	/**
	 * Whether the menu is currently open and positioned.
	 *
	 * @public
	 */
	@attr({mode: 'boolean'}) public open = false;

	/**
	 * The measured placement of the menu after it opens.
	 *
	 * @public
	 */
	@attr public placement: ContextMenuPlacement = 'initial';

	/** @internal */
	public listElement!: HTMLDivElement;

	/** @internal */
	@observable public tabIndex: number = -1;

	private items: ContextMenuItem[] = [];
	private mutationObserver?: MutationObserver;
	private refreshQueued = false;
	private invoker: HTMLElement | null = null;
	private placementFrame = 0;
	private dismissalListeners: Array<() => void> = [];

	/** @internal */
	public connectedCallback() {
		super.connectedCallback();
		this.setAttribute('role', 'menu');
		this.toggleAttribute('hidden', !this.open);
		this.mutationObserver = new MutationObserver(() => this.queueRefresh());
		this.mutationObserver.observe(this, {
			childList: true,
			subtree: true,
		});
		this.queueRefresh();
	}

	/** @internal */
	private openChanged() {
		this.toggleAttribute('hidden', !this.open);
	}

	/** @internal */
	public disconnectedCallback() {
		this.removeGlobalListeners();
		if (this.mutationObserver) {
			this.mutationObserver.disconnect();
			this.mutationObserver = undefined;
		}
		if (this.placementFrame !== 0) {
			cancelAnimationFrame(this.placementFrame);
			this.placementFrame = 0;
		}
		if (openMenu === this) {
			openMenu = null;
		}
		super.disconnectedCallback();
	}

	/**
	 * The currently active item participating in roving focus, if any.
	 *
	 * @public
	 */
	public get activeItem(): ContextMenuItem | null {
		return this.items.find(item => item.tabIndex === 0) ?? null;
	}

	/**
	 * Opens the menu at the supplied viewport coordinates for the supplied invoker.
	 *
	 * @param x - The viewport X coordinate.
	 * @param y - The viewport Y coordinate.
	 * @param invoker - The contextual invoker for command selection, when provided.
	 * @param options - {@link ContextMenuOptions} controlling focus restoration.
	 * @returns Whether the menu was opened.
	 *
	 * @public
	 */
	public showAt(
		x: number,
		y: number,
		invoker?: HTMLElement | null,
		options: ContextMenuOptions = {}
	): boolean {
		if (!Number.isFinite(x) || !Number.isFinite(y)) {
			return false;
		}

		if (invoker !== undefined && invoker !== null) {
			if (!(invoker instanceof HTMLElement) || !invoker.isConnected) {
				return false;
			}
		}

		closeOpenMenu();

		this.invoker = invoker ?? null;
		this.options = options;
		this.open = true;
		this.placement = 'initial';

		recordOpenMenu(this);

		this.queueRefresh();
		this.schedulePlacement(x, y, null);

		this.dispatchEvent(
			new CustomEvent<ContextMenuOpenChangeEventDetail>('open-change', {
				bubbles: true,
				composed: true,
				detail: {open: true},
			})
		);

		return true;
	}

	/**
	 * Opens the menu adjacent to the supplied invoker without pointer coordinates.
	 *
	 * @param invoker - The contextual invoker element.
	 * @param options - {@link ContextMenuOptions} controlling focus restoration.
	 * @returns Whether the menu was opened.
	 *
	 * @public
	 */
	public showFor(
		invoker: HTMLElement,
		options: ContextMenuOptions = {}
	): boolean {
		if (!(invoker instanceof HTMLElement) || !invoker.isConnected) {
			return false;
		}

		const rect = invoker.getBoundingClientRect();
		return this.showAt(rect.left, rect.bottom, invoker, options);
	}

	/**
	 * Closes the menu.
	 *
	 * @param options - {@link ContextMenuOptions} controlling focus restoration.
	 *
	 * @public
	 */
	public hide(options: ContextMenuOptions = {}): void {
		if (!this.open) {
			return;
		}

		const restore =
			!options.suppressFocusRestore &&
			!this.options?.suppressFocusRestore &&
			this.invoker &&
			this.invoker.isConnected;

		this.open = false;
		this.placement = 'initial';
		this.removeGlobalListeners();

		if (this.placementFrame !== 0) {
			cancelAnimationFrame(this.placementFrame);
			this.placementFrame = 0;
		}

		for (const item of this.items) {
			item.tabIndex = -1;
		}
		this.tabIndex = this.enabledItemCount > 0 ? -1 : 0;

		if (openMenu === this) {
			openMenu = null;
		}

		this.dispatchEvent(
			new CustomEvent<ContextMenuOpenChangeEventDetail>('open-change', {
				bubbles: true,
				composed: true,
				detail: {open: false},
			})
		);

		if (restore && this.invoker) {
			try {
				this.invoker.focus();
			} catch {
				// Invoker may have become non-focusable after dismissal.
			}
		}
	}

	/**
	 * Activates the supplied item and dispatches a `menu-select` event.
	 *
	 * @internal
	 */
	public activateItem(item: ContextMenuItem): void {
		if (!this.open || item.disabled) {
			return;
		}
		if (!this.items.includes(item)) {
			return;
		}

		const value = item.value;
		const invoker = this.invoker;
		this.hide({suppressFocusRestore: false});

		this.dispatchEvent(
			new CustomEvent<ContextMenuSelectEventDetail>('menu-select', {
				bubbles: true,
				composed: true,
				detail: {item, value, invoker},
			})
		);
	}

	private options: ContextMenuOptions = {};

	/** @internal */
	public handleSlotChange() {
		this.queueRefresh();
	}

	private queueRefresh() {
		if (this.refreshQueued) {
			return;
		}
		this.refreshQueued = true;
		queueMicrotask(() => this.refreshItems());
	}

	private refreshItems() {
		this.refreshQueued = false;
		if (!this.$fastController.isConnected) {
			return;
		}

		const previousActive = this.activeItem;
		const items = Array.from(this.children).filter(
			(child): child is ContextMenuItem =>
				child instanceof ContextMenuItem
		);
		this.items = items;

		const enabledItems = items.filter(item => !item.disabled);
		this.enabledItemCount = enabledItems.length;

		const nextActive =
			previousActive && enabledItems.includes(previousActive)
				? previousActive
				: enabledItems[0];

		for (const item of items) {
			item.tabIndex = item === nextActive ? 0 : -1;
		}
		this.tabIndex = enabledItems.length === 0 ? 0 : -1;
	}

	private enabledItemCount = 0;

	private schedulePlacement(
		x: number,
		y: number,
		anchor: HTMLElement | null
	): void {
		if (this.placementFrame !== 0) {
			cancelAnimationFrame(this.placementFrame);
		}
		this.placementFrame = requestAnimationFrame(() => {
			this.placementFrame = 0;
			this.applyPlacement(x, y, anchor);
			this.installGlobalListeners();
			this.focusActiveItem();
		});
	}

	private applyPlacement(
		x: number,
		y: number,
		anchor: HTMLElement | null
	): void {
		const list = this.listElement;
		if (!list) {
			return;
		}

		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const rect = list.getBoundingClientRect();
		const width = rect.width || list.offsetWidth;
		const height = rect.height || list.offsetHeight;

		let left = x;
		let top = y;

		if (anchor) {
			const anchorRect = anchor.getBoundingClientRect();
			left = anchorRect.left;
			top = anchorRect.bottom;
		}

		// Prefer right of cursor/invoker, flip to left if it would overflow.
		if (left + width + VIEWPORT_MARGIN > viewportWidth) {
			const flippedLeft = (anchor ? left + width : x) - width;
			if (flippedLeft >= VIEWPORT_MARGIN) {
				left = Math.max(VIEWPORT_MARGIN, flippedLeft);
			}
		}
		left = Math.min(
			Math.max(VIEWPORT_MARGIN, left),
			viewportWidth - width - VIEWPORT_MARGIN
		);

		// Prefer below cursor/invoker, flip above if it would overflow.
		let placement: ContextMenuPlacement = 'below';
		if (top + height + VIEWPORT_MARGIN > viewportHeight) {
			const flippedTop = (anchor ? top : y) - height;
			if (anchor) {
				top = anchor.getBoundingClientRect().top - height;
				if (top >= VIEWPORT_MARGIN) {
					placement = 'above';
				} else {
					top = Math.min(
						Math.max(
							VIEWPORT_MARGIN,
							viewportHeight - height - VIEWPORT_MARGIN
						),
						flippedTop
					);
				}
			} else {
				if (flippedTop >= VIEWPORT_MARGIN) {
					top = flippedTop;
					placement = 'above';
				} else {
					top = Math.max(VIEWPORT_MARGIN, top);
				}
			}
		}

		// Clamp the menu fully within the viewport.
		const clampedHeight = Math.min(
			height,
			viewportHeight - VIEWPORT_MARGIN * 2
		);
		const maxTop = viewportHeight - clampedHeight - VIEWPORT_MARGIN;
		top = Math.min(
			Math.max(VIEWPORT_MARGIN, top),
			Math.max(VIEWPORT_MARGIN, maxTop)
		);

		this.style.top = `${top}px`;
		this.style.left = `${left}px`;
		this.style.maxHeight = `${clampedHeight}px`;
		this.placement = placement;
	}

	private installGlobalListeners(): void {
		this.removeGlobalListeners();

		const onPointer = (event: PointerEvent | MouseEvent) => {
			if (!this.open) {
				return;
			}
			const path = event.composedPath();
			if (path.includes(this)) {
				return;
			}
			this.hide();
		};

		const onKey = (event: KeyboardEvent) => {
			if (!this.open) {
				return;
			}
			if (event.key === 'Escape') {
				event.preventDefault();
				event.stopPropagation();
				this.hide();
			} else if (event.key === 'Tab') {
				this.hide();
			}
		};

		const onBlur = () => {
			if (!this.open) {
				return;
			}
			// Defer to allow related focus moves to settle.
			queueMicrotask(() => {
				if (!this.open) {
					return;
				}
				const active = (this.getRootNode() as Document | ShadowRoot)
					.activeElement as HTMLElement | null;
				if (!active || !this.contains(active)) {
					this.hide();
				}
			});
		};

		const onResize = () => {
			if (this.open) {
				this.hide();
			}
		};

		const onScroll = (event: Event) => {
			if (!this.open) {
				return;
			}
			// Ignore scrolls that occur inside the menu itself.
			if (event.target instanceof Node && this.contains(event.target)) {
				return;
			}
			this.hide();
		};

		window.addEventListener('pointerdown', onPointer, true);
		window.addEventListener('mousedown', onPointer, true);
		window.addEventListener('keydown', onKey, true);
		window.addEventListener('blur', onBlur);
		window.addEventListener('resize', onResize);
		document.addEventListener('scroll', onScroll, true);

		this.dismissalListeners = [
			() => window.removeEventListener('pointerdown', onPointer, true),
			() => window.removeEventListener('mousedown', onPointer, true),
			() => window.removeEventListener('keydown', onKey, true),
			() => window.removeEventListener('blur', onBlur),
			() => window.removeEventListener('resize', onResize),
			() => document.removeEventListener('scroll', onScroll, true),
		];
	}

	private removeGlobalListeners(): void {
		for (const off of this.dismissalListeners) {
			try {
				off();
			} catch {
				// ignore listener removal failures
			}
		}
		this.dismissalListeners = [];
	}

	private focusActiveItem(): void {
		const active = this.activeItem ?? this.enabledItem(0);
		if (active && this.open) {
			try {
				active.focus();
			} catch {
				// ignore focus errors (item removed mid-flight)
			}
		} else if (this.open) {
			try {
				this.listElement?.focus();
			} catch {
				// ignore
			}
		}
	}

	private enabledItem(index: number): ContextMenuItem | undefined {
		const enabled = this.items.filter(item => !item.disabled);
		return enabled[index];
	}

	/** @internal */
	public handleKeyDown(event: KeyboardEvent) {
		if (!this.open) {
			return;
		}

		const enabled = this.items.filter(item => !item.disabled);
		if (enabled.length === 0) {
			return;
		}

		const current = this.activeItem ?? enabled[0];
		const currentIndex = enabled.indexOf(current);
		let target: ContextMenuItem | undefined;

		switch (event.key) {
			case 'ArrowDown':
				target = enabled[(currentIndex + 1) % enabled.length];
				break;
			case 'ArrowUp':
				target =
					enabled[
						(currentIndex - 1 + enabled.length) % enabled.length
					];
				break;
			case 'Home':
				target = enabled[0];
				break;
			case 'End':
				target = enabled[enabled.length - 1];
				break;
			case 'Enter':
			case ' ':
				if (current) {
					event.preventDefault();
					this.activateItem(current);
				}
				return;
			default:
				return;
		}

		if (target) {
			event.preventDefault();
			this.setActiveItem(target);
		}
	}

	/** @internal */
	public handleFocusIn(event: FocusEvent) {
		const target = event.target as HTMLElement | null;
		if (!target) {
			return;
		}
		const item = target.closest(
			'vscode-context-menu-item'
		) as ContextMenuItem | null;
		if (item && this.items.includes(item) && !item.disabled) {
			this.setActiveItem(item);
		}
	}

	private setActiveItem(item: ContextMenuItem) {
		if (this.activeItem === item) {
			item.focus();
			return;
		}
		for (const candidate of this.items) {
			candidate.tabIndex = candidate === item ? 0 : -1;
		}
		this.tabIndex = -1;
		item.focus();
	}
}

/**
 * The Visual Studio Code context-menu component registration.
 *
 * @public
 */
export const vsCodeContextMenu = ContextMenu.compose<
	FoundationElementDefinition,
	typeof ContextMenu
>({
	baseName: 'context-menu',
	template: contextMenuTemplate,
	styles: contextMenuStyles,
});
