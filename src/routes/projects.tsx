import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects")({ component: Projects });

function Projects() {
	return (
		<section className="mx-auto w-full max-w-3xl px-4 py-10">
			<h1 className="font-pixelify text-3xl">Projects</h1>
			<p className="mt-3 text-muted-foreground">Work in progress.</p>
		</section>
	);
}
