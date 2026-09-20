import { createFileRoute } from "@tanstack/react-router";
import { seo } from "#/lib/seo";
import { ProjectsPage } from "./projects/-components/ProjectsPage";

export const Route = createFileRoute("/projects")({
	component: ProjectsPage,
	head: () =>
		seo({
			title: "Projects",
			description:
				"Selected work by Adetunji — products, tools and interfaces built with React, TypeScript and Node.",
			path: "/projects",
		}),
});
