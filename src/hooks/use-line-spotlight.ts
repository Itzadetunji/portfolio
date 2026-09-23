"use client";

import { type RefObject, useEffect, useId, useRef } from "react";

export const LINE_SPOTLIGHT_RADIUS = 100;
const SPOTLIGHT_SETTLE = 0.22;
const OFFSCREEN = -9999;

export type BuildLineSpotlightPath = (root: HTMLElement) => string;

export type UseLineSpotlightOptions = {
	enabled?: boolean;
	buildPath: BuildLineSpotlightPath;
	radius?: number;
	/** Allow activation across the full viewport width (for full-bleed lines). */
	expandX?: boolean;
};

export type UseLineSpotlightResult = {
	rootRef: RefObject<HTMLDivElement | null>;
	pathRef: RefObject<SVGPathElement | null>;
	gradientRef: RefObject<SVGRadialGradientElement | null>;
	gradientId: string;
	radius: number;
	enabled: boolean;
};

export function useLineSpotlight({
	enabled = true,
	buildPath,
	radius = LINE_SPOTLIGHT_RADIUS,
	expandX = false,
}: UseLineSpotlightOptions): UseLineSpotlightResult {
	const rootRef = useRef<HTMLDivElement>(null);
	const pathRef = useRef<SVGPathElement>(null);
	const gradientRef = useRef<SVGRadialGradientElement>(null);
	const gradientId = useId();

	useEffect(() => {
		if (!enabled) return;

		const root = rootRef.current;
		const path = pathRef.current;
		const gradient = gradientRef.current;
		if (!root || !path || !gradient) return;

		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const coarsePointer = window.matchMedia("(hover: none)").matches;
		if (reducedMotion || coarsePointer) return;

		const mouse = { x: OFFSCREEN, y: OFFSCREEN, active: false };
		const current = { x: OFFSCREEN, y: OFFSCREEN };
		let frame = 0;

		const rebuild = () => {
			path.setAttribute("d", buildPath(root));
		};

		const onPointerMove = (event: MouseEvent) => {
			const rootBox = root.getBoundingClientRect();
			const x = event.clientX - rootBox.left;
			const y = event.clientY - rootBox.top;
			mouse.active = expandX
				? y >= -radius && y <= rootBox.height + radius
				: x >= -radius &&
					y >= -radius &&
					x <= rootBox.width + radius &&
					y <= rootBox.height + radius;
			if (mouse.active) {
				mouse.x = x;
				mouse.y = y;
			}
		};

		const onBlur = () => {
			mouse.active = false;
		};

		const tick = () => {
			const targetX = mouse.active ? mouse.x : OFFSCREEN;
			const targetY = mouse.active ? mouse.y : OFFSCREEN;
			current.x += (targetX - current.x) * SPOTLIGHT_SETTLE;
			current.y += (targetY - current.y) * SPOTLIGHT_SETTLE;
			gradient.setAttribute("cx", String(current.x));
			gradient.setAttribute("cy", String(current.y));
			frame = requestAnimationFrame(tick);
		};

		rebuild();
		frame = requestAnimationFrame(tick);

		const observer = new ResizeObserver(rebuild);
		observer.observe(root);
		window.addEventListener("mousemove", onPointerMove, { passive: true });
		window.addEventListener("resize", rebuild);
		window.addEventListener("blur", onBlur);

		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener("mousemove", onPointerMove);
			window.removeEventListener("resize", rebuild);
			window.removeEventListener("blur", onBlur);
			gradient.setAttribute("cx", String(OFFSCREEN));
			gradient.setAttribute("cy", String(OFFSCREEN));
		};
	}, [enabled, buildPath, radius, expandX]);

	return {
		rootRef,
		pathRef,
		gradientRef,
		gradientId,
		radius,
		enabled,
	};
}

const BLACK_FOOT = 6;
const BLACK_RADIUS = 5;

function roundedBottomRect(
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
) {
	const radius = Math.min(r, w / 2, h);
	return [
		`M${x} ${y}`,
		`H${x + w}`,
		`V${y + h - radius}`,
		`Q${x + w} ${y + h} ${x + w - radius} ${y + h}`,
		`H${x + radius}`,
		`Q${x} ${y + h} ${x} ${y + h - radius}`,
		"Z",
	].join("");
}

/** Border paths for the interactive piano (white keys + black keys). */
export function buildPianoSpotlightPath(root: HTMLElement) {
	const rootBox = root.getBoundingClientRect();
	const whites = root.querySelector<HTMLElement>("[data-piano-whites]");
	const whiteKeys = root.querySelectorAll<HTMLElement>("[data-piano-white]");
	const blackKeys = root.querySelectorAll<HTMLElement>("[data-piano-black]");
	if (!whites || whiteKeys.length === 0) return "";

	const whiteBox = whites.getBoundingClientRect();
	const x = whiteBox.left - rootBox.left;
	const y = whiteBox.top - rootBox.top;
	const w = whiteBox.width;
	const h = whiteBox.height;

	let d = `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
	for (let i = 0; i < whiteKeys.length - 1; i++) {
		const keyBox = whiteKeys[i].getBoundingClientRect();
		const vx = keyBox.right - rootBox.left;
		d += `M${vx} ${y}V${y + h}`;
	}

	for (const key of blackKeys) {
		const box = key.getBoundingClientRect();
		d += roundedBottomRect(
			box.left - rootBox.left,
			box.top - rootBox.top,
			box.width,
			box.height + BLACK_FOOT,
			BLACK_RADIUS,
		);
	}

	return d;
}

/**
 * Full-bleed top/bottom stripe borders plus the content-column vertical edges.
 */
export function buildStripeDividerSpotlightPath(root: HTMLElement) {
	const rootBox = root.getBoundingClientRect();
	const left = -rootBox.left;
	const right = window.innerWidth - rootBox.left;
	const h = rootBox.height;
	const w = rootBox.width;

	return [
		`M${left} 0H${right}`,
		`M${left} ${h}H${right}`,
		`M0 0V${h}`,
		`M${w} 0V${h}`,
	].join("");
}
