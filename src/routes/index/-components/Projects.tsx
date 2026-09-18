"use client";

import { ArrowRightIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { createTimeline, utils } from "animejs";
import { useEffect, useRef } from "react";
import { TECH, type TechId } from "#/components/icons";
import { EntryReveal } from "#/components/EntryReveal";
import { withUtm } from "#/lib/utm";
import { Section } from "./Section";

export type Project = {
	name: string;
	description: string;
	image: string;
	href: string;
	live?: string;
	repo?: string;
	stack: TechId[];
};

export const PROJECTS: Project[] = [
	{
		name: "Icodraw",
		description:
			"A lightweight screen-capture and annotation tool for macOS, Windows and Linux - grab a region, mark it up, and share it without a heavyweight editor in the way.",
		image: "/projects/icodraw.png",
		href: "https://icodraw.prathm.me/",
		live: "https://icodraw.prathm.me/",
		repo: "https://github.com/insanekrishnna/inki",
		stack: ["typescript", "react", "vite", "tailwind"],
	},
	{
		name: "Paperlab",
		description:
			"46 PDF tools that run entirely in the browser - merge, split, convert and OCR without an upload, a sign-up or a watermark, because the files never leave the device.",
		image: "/projects/paperlab.png",
		href: "https://paperlabb.vercel.app/",
		live: "https://paperlabb.vercel.app/",
		repo: "https://github.com/insanekrishnna/pureab",
		stack: ["typescript", "nextjs", "tailwind", "pdflib"],
	},
	{
		name: "Icodraw",
		description:
			"A lightweight screen-capture and annotation tool for macOS, Windows and Linux - grab a region, mark it up, and share it without a heavyweight editor in the way.",
		image: "/projects/icodraw.png",
		href: "https://icodraw.prathm.me/",
		live: "https://icodraw.prathm.me/",
		repo: "https://github.com/insanekrishnna/inki",
		stack: ["typescript", "react", "vite", "tailwind"],
	},
	{
		name: "Paperlab",
		description:
			"46 PDF tools that run entirely in the browser - merge, split, convert and OCR without an upload, a sign-up or a watermark, because the files never leave the device.",
		image: "/projects/paperlab.png",
		href: "https://paperlabb.vercel.app/",
		live: "https://paperlabb.vercel.app/",
		repo: "https://github.com/insanekrishnna/pureab",
		stack: ["typescript", "nextjs", "tailwind", "pdflib"],
	},
	{
		name: "Icodraw",
		description:
			"A lightweight screen-capture and annotation tool for macOS, Windows and Linux - grab a region, mark it up, and share it without a heavyweight editor in the way.",
		image: "/projects/icodraw.png",
		href: "https://icodraw.prathm.me/",
		live: "https://icodraw.prathm.me/",
		repo: "https://github.com/insanekrishnna/inki",
		stack: ["typescript", "react", "vite", "tailwind"],
	},
	{
		name: "Paperlab",
		description:
			"46 PDF tools that run entirely in the browser - merge, split, convert and OCR without an upload, a sign-up or a watermark, because the files never leave the device.",
		image: "/projects/paperlab.png",
		href: "https://paperlabb.vercel.app/",
		live: "https://paperlabb.vercel.app/",
		repo: "https://github.com/insanekrishnna/pureab",
		stack: ["typescript", "nextjs", "tailwind", "pdflib"],
	},
];

const chip =
	"inline-flex items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-xs font-medium text-foreground transition-colors hover:border-neutral-400 dark:hover:border-neutral-600";

function TechChip({ id }: { id: TechId }) {
	const tech = TECH[id];
	const Icon = tech.icon;
	const branded = tech.color !== "currentColor" && !tech.darkColor;

	return (
		<span className={chip}>
			<Icon
				aria-hidden
				className={`size-3 shrink-0 ${tech.darkColor ? "text-black dark:text-neutral-200" : ""} ${tech.color === "currentColor" ? "text-muted-foreground" : ""}`}
				style={branded ? { color: tech.color } : undefined}
			/>
			{tech.label}
		</span>
	);
}

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

function ProjectHoverBackdrop() {
	return (
		<svg
			aria-hidden
			className="h-full w-full"
			preserveAspectRatio="xMidYMid slice"
			viewBox="0 0 480 300"
		>
			<rect fill="#f3eadc" height="300" width="480" />
			<path
				d="M-48 28c88-78 196-12 228 70 34 86-78 148-158 118C-66 186-92 92-48 28Z"
				fill="#c49a4a"
			/>
			<path
				d="M168 8c78-48 176-8 208 72 28 72-22 128-96 136-78 8-148-52-148-116 0-36 14-68 36-92Z"
				fill="#e8c4b0"
			/>
			<path
				d="M292-24c92-28 198 62 168 148-28 80-126 46-184-8-52-48-44-112 16-140Z"
				fill="#f0d2c4"
			/>
			<path
				d="M-28 188c96-48 196 38 148 118-40 66-148 28-176-42-18-46 0-88 28-76Z"
				fill="#d9b07a"
			/>
			<path
				d="M360 168c92-44 168 52 128 128-36 68-148 36-176-28-24-54 20-92 48-100Z"
				fill="#efe0cf"
			/>
			<path
				d="M210 118c64-36 148 8 136 78-12 64-108 72-156 28-40-36-28-78 20-106Z"
				fill="#f7ebe0"
			/>
		</svg>
	);
}

function ProjectPreview({ project }: { project: Project }) {
	const live = project.live ?? project.href;

	return (
		<a
			href={withUtm(live)}
			target="_blank"
			rel="noreferrer"
			className="group block outline-none"
		>
			<div className="rounded-[10px] border border-border p-[4px]">
				<div className="relative h-[200px] overflow-hidden rounded-[6px] border border-border bg-muted select-none">
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-focus-visible:opacity-100 group-hover:opacity-100 motion-reduce:transition-none"
					>
						<ProjectHoverBackdrop />
					</div>
					<span className="absolute top-2 left-2 z-10 text-xs font-medium text-muted-foreground transition-all duration-300 group-focus-visible:left-1/2 group-focus-visible:-translate-x-1/2 group-focus-visible:text-black group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:text-black">
						{project.name} Screen
					</span>
					<div className="absolute bottom-0 left-1/2 h-[75%] w-[80%] -translate-x-1/2 rounded-t-[6px] border border-b-0 border-border bg-background p-[2px] pb-0 transition-all duration-300 group-focus-visible:h-[70%] group-hover:h-[70%] motion-reduce:transition-none motion-reduce:group-focus-visible:h-[75%] motion-reduce:group-hover:h-[75%]">
						<div className="relative h-full w-full overflow-hidden rounded-t-[4px]">
							<img
								src={project.image}
								alt=""
								width={1200}
								height={630}
								loading="lazy"
								decoding="async"
								className="absolute inset-x-0 top-0 h-[110%] w-full object-cover object-top transition-[height] duration-300 group-focus-visible:h-[115%] group-hover:h-[115%] motion-reduce:transition-none motion-reduce:group-focus-visible:h-[110%] motion-reduce:group-hover:h-[110%]"
							/>
						</div>
					</div>
				</div>
			</div>
		</a>
	);
}

export function ProjectCard({ project }: { project: Project }) {
	const live = project.live ?? project.href;

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
			<p className="truncate text-[13px] leading-snug text-muted-foreground">
				{project.description}
			</p>
			<ul className="flex flex-wrap gap-1.5">
				{project.stack.map((id) => (
					<li key={id} className="flex">
						<TechChip id={id} />
					</li>
				))}
			</ul>
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
