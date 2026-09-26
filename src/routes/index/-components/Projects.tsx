"use client";

import { ArrowRightIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { createTimeline, utils } from "animejs";
import { useEffect, useRef, useState } from "react";
import { EntryReveal } from "#/components/EntryReveal";
import { FloatingBlobs } from "#/components/FloatingBlobs";
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

function ProjectPreview({ project }: { project: Project }) {
	const live = project.live;
	const image = project.image;
	const [active, setActive] = useState(false);

	const preview = (
		<div className="rounded-[10px] border border-border p-1">
			<div className="relative h-50 overflow-hidden rounded-[6px] border border-border bg-muted select-none">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-focus-visible:opacity-100 group-hover:opacity-100 motion-reduce:transition-none"
				>
					<FloatingBlobs active={active} />
				</div>
				<span
					className={cn(
						"absolute top-2 left-2 z-10 text-xs font-medium text-muted-foreground transition-all duration-300 group-focus-visible:text-black group-hover:text-black",
						image
							? "group-focus-visible:left-1/2 group-focus-visible:-translate-x-1/2 group-hover:left-1/2 group-hover:-translate-x-1/2"
							: "group-focus-visible:top-1/2 group-focus-visible:left-1/2 group-focus-visible:-translate-x-1/2 group-focus-visible:-translate-y-1/2 group-hover:top-1/2 group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:text-xl",
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
	);

	const interaction = {
		onMouseEnter: () => setActive(true),
		onMouseLeave: () => setActive(false),
		onFocus: () => setActive(true),
		onBlur: () => setActive(false),
	};

	if (!live) {
		return (
			<div className="group block outline-none" {...interaction}>
				{preview}
			</div>
		);
	}

	return (
		<a
			href={withUtm(live)}
			target="_blank"
			rel="noreferrer"
			className="group block outline-none"
			{...interaction}
		>
			{preview}
		</a>
	);
}

export function ProjectCard({ project }: { project: Project }) {
	const live = project.live;

	return (
		<article className="flex flex-col gap-2 p-4">
			<ProjectPreview project={project} />
			<div className="flex items-center justify-between gap-3">
				<h3 className="min-w-0 truncate text-[15px] font-semibold leading-snug">
					{live ? (
						<a
							href={withUtm(live)}
							target="_blank"
							rel="noreferrer"
							className="transition-colors hover:text-primary"
						>
							{project.name}
						</a>
					) : (
						project.name
					)}
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
			{live ? <ViewProjectLink href={withUtm(live)} /> : null}
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
