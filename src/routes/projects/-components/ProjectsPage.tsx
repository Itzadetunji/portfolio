"use client";

import { EntryReveal } from "#/components/EntryReveal";
import {
	PROJECTS,
	ProjectCard,
} from "../../index/-components/Projects";
import { Section, StripeDivider } from "../../index/-components/Section";

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
