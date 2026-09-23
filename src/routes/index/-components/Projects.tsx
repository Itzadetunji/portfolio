"use client";

import { ArrowRightIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { createTimeline, utils } from "animejs";
import { useEffect, useRef, useState } from "react";
import { EntryReveal } from "#/components/EntryReveal";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";
import { withUtm } from "#/lib/utm";
import PROJECTS_DATA from "../-data/projects.json";
import { Section } from "./Section";

export type Project = {
	name: string;
	description: string;
	image?: string;
	live?: string;
	repo?: string;
};

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

export const PROJECTS: Project[] = PROJECTS_DATA.projects;

function ViewProjectLink({ href }: { href: string }) {
	const arrowRef = useRef<HTMLSpanElement>(null);
	const timelineRef = useRef<ReturnType<typeof createTimeline> | null>(null);

	useEffect(() => {
		const arrow = arrowRef.current;
		if (!arrow) return;
		utils.set(arrow, { rotate: -45, scaleX: 1 });
	}, []);

	function prefersReducedMotion() {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}

	function run(direction: "in" | "out") {
		const arrow = arrowRef.current;
		if (!arrow) return;

		timelineRef.current?.pause();

		if (prefersReducedMotion()) {
			utils.set(arrow, {
				rotate: direction === "in" ? 0 : -45,
				scaleX: direction === "in" ? 1.1 : 1,
			});
			return;
		}

		if (direction === "in") {
			timelineRef.current = createTimeline({
				defaults: { ease: "outQuad" },
			})
				.add(arrow, { rotate: 0, duration: 180 })
				.add(arrow, { scaleX: 1.3, duration: 160 });
			return;
		}

		timelineRef.current = createTimeline({
			defaults: { ease: "outQuad" },
		})
			.add(arrow, { scaleX: 1, duration: 140 })
			.add(arrow, { rotate: -45, duration: 180 });
	}

	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			className="mt-1 inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
			onMouseEnter={() => run("in")}
			onMouseLeave={() => run("out")}
			onFocus={() => run("in")}
			onBlur={() => run("out")}
		>
			View Project
			<span
				ref={arrowRef}
				aria-hidden
				className="inline-block origin-center will-change-transform"
			>
				<ArrowRightIcon weight="bold" className="size-3.5" />
			</span>
		</a>
	);
}

function ProjectHoverBackdrop({ active }: { active: boolean }) {
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

function ProjectPreview({ project }: { project: Project }) {
	const live = project.live as string;
	const image = project.image;
	const [active, setActive] = useState(false);

	return (
		<a
			href={withUtm(live)}
			target="_blank"
			rel="noreferrer"
			className="group block outline-none"
			onMouseEnter={() => setActive(true)}
			onMouseLeave={() => setActive(false)}
			onFocus={() => setActive(true)}
			onBlur={() => setActive(false)}
		>
			<div className="rounded-[10px] border border-border p-1">
				<div className="relative h-50 overflow-hidden rounded-[6px] border border-border bg-muted select-none">
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-focus-visible:opacity-100 group-hover:opacity-100 motion-reduce:transition-none"
					>
						<ProjectHoverBackdrop active={active} />
					</div>
					<span
						className={cn(
							"absolute top-2 left-2 z-10 text-xs font-medium text-muted-foreground transition-all duration-300 group-focus-visible:text-black group-hover:text-black",
							image
								? "group-focus-visible:left-1/2 group-focus-visible:-translate-x-1/2 group-hover:left-1/2 group-hover:-translate-x-1/2"
								: "group-focus-visible:top-1/2 group-focus-visible:left-1/2 group-focus-visible:-translate-x-1/2 group-focus-visible:-translate-y-1/2 group-hover:top-1/2 group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2",
						)}
					>
						{project.name}
					</span>
					{image ? (
						<div className="absolute bottom-0 left-1/2 h-[75%] w-[80%] -translate-x-1/2 rounded-t-md border border-b-0 border-border bg-background p-0.5 pb-0 transition-all duration-300 group-focus-visible:h-[70%] group-hover:h-[70%] motion-reduce:transition-none motion-reduce:group-focus-visible:h-[75%] motion-reduce:group-hover:h-[75%]">
							<div className="relative h-full w-full overflow-hidden rounded-t-sm">
								<img
									src={image}
									alt=""
									width={1200}
									height={630}
									loading="lazy"
									decoding="async"
									className="absolute inset-x-0 top-0 h-[110%] w-full object-cover object-top transition-[height] duration-300 group-focus-visible:h-[115%] group-hover:h-[115%] motion-reduce:transition-none motion-reduce:group-focus-visible:h-[110%] motion-reduce:group-hover:h-[110%]"
								/>
							</div>
						</div>
					) : null}
				</div>
			</div>
		</a>
	);
}

export function ProjectCard({ project }: { project: Project }) {
	const live = project.live as string;

	return (
		<article className="flex flex-col gap-2 p-4">
			<ProjectPreview project={project} />
			<div className="flex items-center justify-between gap-3">
				<h3 className="min-w-0 truncate text-[15px] font-semibold leading-snug">
					<a
						href={withUtm(live)}
						target="_blank"
						rel="noreferrer"
						className="transition-colors hover:text-primary"
					>
						{project.name}
					</a>
				</h3>
				{project.repo ? (
					<a
						href={withUtm(project.repo)}
						target="_blank"
						rel="noreferrer"
						aria-label={`${project.name} on GitHub`}
						className="shrink-0 text-foreground/80 transition-colors hover:text-foreground"
					>
						<GithubLogoIcon weight="fill" className="size-4.5" />
					</a>
				) : null}
			</div>
			<TooltipProvider delayDuration={200}>
				<Tooltip>
					<TooltipTrigger asChild>
						<p className="line-clamp-2 cursor-default text-[13px] leading-snug text-muted-foreground">
							{project.description}
						</p>
					</TooltipTrigger>
					<TooltipContent
						side="top"
						sideOffset={6}
						className="max-w-sm text-pretty leading-snug"
					>
						{project.description}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<ViewProjectLink href={withUtm(live)} />
		</article>
	);
}

export function Projects() {
	return (
		<Section className="px-0">
			<h2 className="border-b border-border px-4 py-2 text-xl font-medium tracking-tight">
				Projects
			</h2>
			<div className="relative grid grid-cols-1 sm:grid-cols-2">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-border sm:block"
				/>
				{PROJECTS.slice(0, 2).map((project, index) => (
					<EntryReveal key={project.name} delayMs={index * 100}>
						<ProjectCard project={project} />
					</EntryReveal>
				))}
			</div>
			<div className="flex justify-center border-t border-border px-4 py-4">
				<Link
					to="/projects"
					className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
				>
					See all projects
					<ArrowRightIcon size={14} weight="bold" />
				</Link>
			</div>
		</Section>
	);
}
