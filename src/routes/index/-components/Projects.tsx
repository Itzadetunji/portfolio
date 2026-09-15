"use client";

import { ArrowRightIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { createTimeline, utils } from "animejs";
import { useEffect, useRef } from "react";
import { TECH, type TechId } from "#/components/icons";
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

function ProjectCard({ project }: { project: Project }) {
	const live = project.live ?? project.href;

	return (
		<article className="flex flex-col gap-2 p-4">
			<a
				href={withUtm(live)}
				target="_blank"
				rel="noreferrer"
				className="group/media block overflow-hidden rounded-md border border-border"
			>
				<img
					src={project.image}
					alt=""
					width={1200}
					height={630}
					className="h-44 w-full object-cover object-top transition-transform duration-500 ease-out group-hover/media:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/media:scale-100 sm:h-48"
				/>
			</a>
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
		<Section className="border-b px-0">
			<h2 className="border-b border-border px-4 py-2 text-xl font-medium tracking-tight">
				Projects
			</h2>
			<div className="relative grid grid-cols-1 sm:grid-cols-2">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-border sm:block"
				/>
				{PROJECTS.map((project) => (
					<ProjectCard key={project.name} project={project} />
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
