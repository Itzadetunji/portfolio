import { CalendarBlankIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { withUtm } from "#/lib/utm";
import { Section } from "./Section";

function TechGroup({ children }: { children: string }) {
	return (
		<span className="underline decoration-foreground underline-offset-[3px]">
			{children}
		</span>
	);
}

const actionBtn =
	"inline-flex h-fit shrink-0 items-center justify-center gap-2 rounded-2xl border border-border bg-muted/50 px-2.5 py-1.5 text-foreground/85 transition-colors hover:bg-muted hover:text-foreground";

export function About() {
	return (
		<Section className="px-0">
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2">
				<h2 className="text-xl font-medium tracking-tight">About</h2>
				<div className="flex flex-wrap items-center gap-2">
					<a
						href={withUtm("https://calendly.com/itzadetunji")}
						target="_blank"
						rel="noreferrer"
						className={actionBtn}
					>
						<CalendarBlankIcon size={16} weight="regular" />
						<p className="text-sm">Book a call</p>
					</a>
					<a href="mailto:itzadetunji1@gmail.com" className={actionBtn}>
						<EnvelopeSimpleIcon size={16} weight="regular" />
						<p className="text-sm">Send an email</p>
					</a>
				</div>
			</div>
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
