"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "cn";
import {
	PROJECTS,
	ProjectCard,
} from "../../index/-components/Projects";
import { Section, StripeDivider } from "../../index/-components/Section";

function EntryReveal({
	children,
	delayMs,
}: {
	children: ReactNode;
	delayMs: number;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [entered, setEntered] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setEntered(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				setEntered(true);
				observer.disconnect();
			},
			{ threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className={cn(
				entered ? "blur-none" : "blur-[10px]",
				"motion-reduce:blur-none motion-reduce:transition-none",
			)}
			style={{
				transitionProperty: "filter",
				transitionDuration: "700ms",
				transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
				transitionDelay: entered ? `${delayMs}ms` : "0ms",
			}}
		>
			{children}
		</div>
	);
}

export function ProjectsPage() {
	return (
		<>
			<Section className="px-0">
				<div className="flex h-80 items-center justify-center">
					<h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
						Projects
					</h1>
				</div>
			</Section>
			<StripeDivider />
			<Section className="px-0">
				<div className="relative grid grid-cols-1 sm:grid-cols-2">
					<div
						aria-hidden
						className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-border sm:block"
					/>
					{PROJECTS.map((project, index) => (
						<EntryReveal key={project.name} delayMs={index * 100}>
							<ProjectCard project={project} />
						</EntryReveal>
					))}
				</div>
			</Section>
		</>
	);
}
