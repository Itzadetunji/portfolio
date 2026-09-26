"use client";

import { ProhibitIcon } from "@phosphor-icons/react";
import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

const GAP = 12;
const RADIUS = 1.15;
const HEIGHT = 168;
const REPEL_RADIUS = 88;
const REPEL_STRENGTH = 20;
const SETTLE = 0.22;
const RIPPLE_MS = 1100;
const RIPPLE_SPEED = 320;
const RIPPLE_BAND = 64;
const RIPPLE_STRENGTH = 16;

type Dot = { x: number; y: number; ox: number; oy: number };
type Ripple = { x: number; y: number; started: number };

export function InteractiveDots() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const router = useRouter();

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		const mouse = { x: 0, y: 0, inside: false };
		const ripples: Ripple[] = [];
		let dots: Dot[] = [];
		let width = 0;
		let height = HEIGHT;
		let frame = 0;
		let dpr = 1;

		const layout = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			width = canvas.clientWidth;
			height = HEIGHT;
			canvas.width = Math.max(1, Math.floor(width * dpr));
			canvas.height = Math.max(1, Math.floor(height * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			const cols = Math.max(2, Math.floor(width / GAP));
			const rows = Math.max(2, Math.floor(height / GAP));
			const originX = (width - (cols - 1) * GAP) / 2;
			const originY = (height - (rows - 1) * GAP) / 2;
			dots = [];
			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					dots.push({
						x: originX + col * GAP,
						y: originY + row * GAP,
						ox: 0,
						oy: 0,
					});
				}
			}
		};

		const localPoint = (event: PointerEvent) => {
			const bounds = canvas.getBoundingClientRect();
			return {
				x: event.clientX - bounds.left,
				y: event.clientY - bounds.top,
			};
		};

		const onPointerMove = (event: PointerEvent) => {
			const point = localPoint(event);
			mouse.x = point.x;
			mouse.y = point.y;
			mouse.inside = true;
		};

		const onPointerLeave = () => {
			mouse.inside = false;
		};

		const onPointerDown = (event: PointerEvent) => {
			const point = localPoint(event);
			mouse.x = point.x;
			mouse.y = point.y;
			mouse.inside = true;
			if (!reducedMotion) {
				ripples.push({ x: point.x, y: point.y, started: performance.now() });
			}
		};

		const tick = (now: number) => {
			ctx.clearRect(0, 0, width, height);
			ctx.fillStyle = getComputedStyle(canvas).color;

			for (let i = ripples.length - 1; i >= 0; i--) {
				if (now - ripples[i].started > RIPPLE_MS) ripples.splice(i, 1);
			}

			for (const dot of dots) {
				let targetX = 0;
				let targetY = 0;

				if (!reducedMotion && mouse.inside) {
					const vx = dot.x - mouse.x;
					const vy = dot.y - mouse.y;
					const dist = Math.hypot(vx, vy) || 0.0001;
					if (dist < REPEL_RADIUS) {
						const force = (1 - dist / REPEL_RADIUS) ** 2 * REPEL_STRENGTH;
						targetX += (vx / dist) * force;
						targetY += (vy / dist) * force;
					}
				}

				if (!reducedMotion) {
					for (const ripple of ripples) {
						const elapsed = (now - ripple.started) / 1000;
						const wave = elapsed * RIPPLE_SPEED;
						const vx = dot.x - ripple.x;
						const vy = dot.y - ripple.y;
						const dist = Math.hypot(vx, vy) || 0.0001;
						const band = Math.abs(dist - wave);
						if (band < RIPPLE_BAND) {
							const falloff = 1 - (now - ripple.started) / RIPPLE_MS;
							const amp = (1 - band / RIPPLE_BAND) * falloff * RIPPLE_STRENGTH;
							targetX += (vx / dist) * amp;
							targetY += (vy / dist) * amp;
						}
					}
				}

				dot.ox += (targetX - dot.ox) * SETTLE;
				dot.oy += (targetY - dot.oy) * SETTLE;

				ctx.beginPath();
				ctx.arc(dot.x + dot.ox, dot.y + dot.oy, RADIUS, 0, Math.PI * 2);
				ctx.fill();
			}

			frame = requestAnimationFrame(tick);
		};

		layout();
		frame = requestAnimationFrame(tick);

		const observer = new ResizeObserver(layout);
		observer.observe(canvas);
		canvas.addEventListener("pointermove", onPointerMove);
		canvas.addEventListener("pointerleave", onPointerLeave);
		canvas.addEventListener("pointerdown", onPointerDown);

		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			canvas.removeEventListener("pointermove", onPointerMove);
			canvas.removeEventListener("pointerleave", onPointerLeave);
			canvas.removeEventListener("pointerdown", onPointerDown);
		};
	}, []);

	return (
		<div className="relative">
			<canvas
				ref={canvasRef}
				aria-hidden
				className="block h-42 w-full cursor-crosshair touch-none text-muted-foreground/45"
			/>
			<Link
				to="/hire"
				aria-label="Go somewhere unknown"
				className="absolute top-1/2 left-1/2 z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground/70 opacity-0 transition-opacity ease-in-out hover:opacity-100 hover:text-foreground cursor-pointer"
			>
				<ProhibitIcon className="size-5" weight="regular" aria-hidden />
			</Link>
		</div>
	);
}
