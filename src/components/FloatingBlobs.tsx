"use client";

import { useEffect, useRef } from "react";

const BLOB_BG = "#f3eadc";

type FloatingBlob = {
	ox: number;
	oy: number;
	radius: number;
	aspect: number;
	color: string;
	ax: number;
	ay: number;
	sx: number;
	sy: number;
	px: number;
	py: number;
	pulse: number;
	pulseSpeed: number;
	rot: number;
	rotSpeed: number;
	seed: number;
};

const BLOB_COLORS = [
	"#c49a4a",
	"#e8c4b0",
	"#f0d2c4",
	"#d9b07a",
	"#efe0cf",
	"#f7ebe0",
];

const BLOB_RADIUS_RANGE: [number, number][] = [
	[0.42, 0.52],
	[0.34, 0.44],
	[0.3, 0.4],
	[0.28, 0.38],
	[0.26, 0.36],
	[0.24, 0.34],
];

function rand(min: number, max: number) {
	return min + Math.random() * (max - min);
}

function createFloatingBlobs(): FloatingBlob[] {
	const colors = [...BLOB_COLORS];
	for (let i = colors.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[colors[i], colors[j]] = [colors[j], colors[i]];
	}

	return colors.map((color, index) => {
		const [minR, maxR] = BLOB_RADIUS_RANGE[index] ?? [0.28, 0.4];
		return {
			ox: rand(0.08, 0.92),
			oy: rand(0.08, 0.92),
			radius: rand(minR, maxR),
			aspect: rand(0.82, 1.14),
			color,
			ax: rand(0.04, 0.09),
			ay: rand(0.04, 0.08),
			sx: rand(0.18, 0.38),
			sy: rand(0.18, 0.38),
			px: rand(0, Math.PI * 2),
			py: rand(0, Math.PI * 2),
			pulse: rand(0.04, 0.09),
			pulseSpeed: rand(0.25, 0.48),
			rot: rand(-0.6, 0.6),
			rotSpeed: rand(-0.12, 0.12),
			seed: rand(0, Math.PI * 2),
		};
	});
}

function drawOrganicBlob(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	rx: number,
	ry: number,
	rotation: number,
	seed: number,
	t: number,
	color: string,
) {
	const points = 7;
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);
	ctx.beginPath();

	const coords: { x: number; y: number }[] = [];
	for (let i = 0; i < points; i++) {
		const angle = (i / points) * Math.PI * 2;
		const wobble =
			0.82 +
			0.18 * Math.sin(t * 0.7 + seed + i * 1.65) +
			0.06 * Math.cos(t * 1.1 + seed * 1.3 + i * 0.9);
		coords.push({
			x: Math.cos(angle) * rx * wobble,
			y: Math.sin(angle) * ry * wobble,
		});
	}

	const first = coords[0];
	const last = coords[coords.length - 1];
	ctx.moveTo((last.x + first.x) / 2, (last.y + first.y) / 2);
	for (let i = 0; i < coords.length; i++) {
		const current = coords[i];
		const next = coords[(i + 1) % coords.length];
		ctx.quadraticCurveTo(
			current.x,
			current.y,
			(current.x + next.x) / 2,
			(current.y + next.y) / 2,
		);
	}
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
	ctx.restore();
}

export function FloatingBlobs({ active }: { active: boolean }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const activeRef = useRef(active);
	const startLoopRef = useRef<(() => void) | null>(null);
	const stopLoopRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		activeRef.current = active;
		if (active) startLoopRef.current?.();
		else stopLoopRef.current?.();
	}, [active]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		let width = 0;
		let height = 0;
		let dpr = 1;
		let frame = 0;
		let running = false;
		const start = performance.now();
		const blobs = createFloatingBlobs();

		const paint = (now: number) => {
			const t = reducedMotion ? 0 : (now - start) / 1000;
			ctx.fillStyle = BLOB_BG;
			ctx.fillRect(0, 0, width, height);

			const scale = Math.min(width, height);

			for (const blob of blobs) {
				const x =
					blob.ox * width +
					Math.sin(t * blob.sx + blob.px) * blob.ax * width;
				const y =
					blob.oy * height +
					Math.cos(t * blob.sy + blob.py) * blob.ay * height;
				const pulse =
					1 + Math.sin(t * blob.pulseSpeed + blob.seed) * blob.pulse;
				const rx = blob.radius * scale * pulse;
				const ry = rx * blob.aspect;
				const rotation = blob.rot + t * blob.rotSpeed;

				drawOrganicBlob(
					ctx,
					x,
					y,
					rx,
					ry,
					rotation,
					blob.seed,
					t,
					blob.color,
				);
			}
		};

		const layout = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			width = canvas.clientWidth;
			height = canvas.clientHeight;
			canvas.width = Math.max(1, Math.floor(width * dpr));
			canvas.height = Math.max(1, Math.floor(height * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			paint(performance.now());
		};

		const tick = (now: number) => {
			paint(now);
			if (running) frame = requestAnimationFrame(tick);
		};

		const startLoop = () => {
			if (running || reducedMotion || document.hidden) return;
			running = true;
			frame = requestAnimationFrame(tick);
		};

		const stopLoop = () => {
			running = false;
			cancelAnimationFrame(frame);
			paint(performance.now());
		};

		startLoopRef.current = startLoop;
		stopLoopRef.current = stopLoop;

		layout();
		if (activeRef.current) startLoop();

		const resizeObserver = new ResizeObserver(layout);
		resizeObserver.observe(canvas);

		const onVisibility = () => {
			if (document.hidden) stopLoop();
			else if (activeRef.current) startLoop();
		};
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			stopLoop();
			startLoopRef.current = null;
			stopLoopRef.current = null;
			resizeObserver.disconnect();
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, []);

	return <canvas ref={canvasRef} aria-hidden className="h-full w-full" />;
}
