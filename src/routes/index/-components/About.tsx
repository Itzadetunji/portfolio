import { Section } from "./Section";

function TechGroup({ children }: { children: string }) {
	return (
		<span className="underline decoration-foreground underline-offset-[3px]">
			{children}
		</span>
	);
}

export function About() {
	return (
		<Section className="border-y px-0">
			<h2 className="border-b border-border px-4 py-2 text-xl font-medium tracking-tight">
				About
			</h2>
			<ul className="list-disc space-y-3 px-4 py-5 pl-9 text-[15px] leading-6 text-foreground marker:text-foreground">
				<li>
					I&apos;m Adetunji — a software engineer who cares about craft,
					readable interfaces, and systems that hold up when things get messy.
				</li>
				<li>
					I build products end to end with{" "}
					<TechGroup>React, TypeScript and Node.js</TechGroup> — from data and
					APIs through to the interface.
				</li>
				<li>
					On the backend I work with{" "}
					<TechGroup>Express, PostgreSQL and Bun</TechGroup>, with a bias toward
					strong validation, correctness and predictable failure handling.
				</li>
			</ul>
		</Section>
	);
}
