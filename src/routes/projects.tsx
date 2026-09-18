import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "./projects/-components/ProjectsPage";

export const Route = createFileRoute("/projects")({
	component: ProjectsPage,
	head: () => ({
		meta: [{ title: "Projects — Adetunji" }],
	}),
});
