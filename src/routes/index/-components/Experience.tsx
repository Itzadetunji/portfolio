"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import {
	addMonths,
	format,
	formatDuration,
	intervalToDuration,
	parse,
	startOfMonth,
} from "date-fns";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion";
import { withUtm } from "#/lib/utm";
import { Section } from "./Section";

export type ExperienceItem = {
	company: string;
	href: string;
	logo?: string;
	role: string;
	location: string;
	start: string;
	end: string | null;
	highlights: [string, string, string];
};

export const EXPERIENCE: ExperienceItem[] = [
	{
		company: "VerifyAfrica",
		href: "https://verifyafrica.io",
		logo: "/experience/verifyafrica.svg",
		role: "Software Engineer",
		location: "Remote",
		start: "2026-06",
		end: null,
		highlights: [
			"Building identity verification and KYC flows so teams can check African IDs, passports and licences in seconds instead of stitching vendors together.",
			"Shipping TypeScript and React interfaces for compliance dashboards, covering KYC, KYB and AML workflows used by regulated product teams.",
			"Integrating verification APIs across the stack so onboarding stays fast, auditable and reliable as coverage expands across African markets.",
		],
	},
	{
		company: "Migranium",
		href: "https://www.migranium.com",
		logo: "/experience/migranium.png",
		role: "Lead Frontend Developer",
		location: "Toronto, Ontario, Canada",
		start: "2024-03",
		end: "2026-06",
		highlights: [
			"Owned the patient waitlist feature from concept through launch, cutting clinic onboarding time by 40% with React, TypeScript and REST integrations.",
			"Architected a high-performance Next.js landing page with 95+ PageSpeed scores, lifting conversion by 25% through rendering and optimisation work.",
			"Maintained and scaled the core app with React Query and TypeScript, reducing load times by 30% as the healthcare platform grew.",
		],
	},
	{
		company: "Hadi Finance",
		href: "https://hadifinance.com",
		logo: "/experience/hadifinance.png",
		role: "Frontend Developer",
		location: "Abuja, Nigeria",
		start: "2023-02",
		end: "2024-02",
		highlights: [
			"Built the landing page and e-commerce app with Axios and Context, wiring REST APIs that powered credit services for retailers.",
			"Raised engagement on the Credix credit-making segment by 35% through API integrations, refactors and close work with the product team.",
			"Cut processing time by 50% with performance-minded React solutions that made inventory financing flows faster for informal retailers.",
		],
	},
];

function Logo({ item }: { item: ExperienceItem }) {
	const initial = item.company.charAt(0).toUpperCase();
	const frame =
		"relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md p-0.75 outline outline-black/10 dark:outline-white/10";

	if (item.logo) {
		return (
			<div>
				<div className={frame}>
					<img
						src={item.logo}
						alt=""
						width={40}
						height={40}
						loading="lazy"
						decoding="async"
						className="size-full object-contain select-none rounded-sm outline dark:bg-white outline-black/10 dark:outline-white/10 p-1"
					/>
				</div>
			</div>
		);
	}

	return (
		<div className={`${frame} text-sm font-medium text-neutral-800`}>
			{initial}
		</div>
	);
}

function DateRange({ item }: { item: ExperienceItem }) {
	const start = parse(item.start, "yyyy-MM", new Date());
	const end = item.end
		? parse(item.end, "yyyy-MM", new Date())
		: startOfMonth(new Date());

	return (
		<div className="text-sm text-muted-foreground sm:text-right">
			<p>
				{format(start, "MMM yyyy")} -{" "}
				{item.end ? format(end, "MMM yyyy") : "Present"}
			</p>
			<p>{item.location}</p>
			<p className="sr-only">
				{formatDuration(
					intervalToDuration({
						start,
						end: addMonths(end, 1),
					}),
					{ format: ["years", "months"] },
				)}
			</p>
		</div>
	);
}

export function Experience() {
	return (
		<Section className="px-0">
			<h2 className="border-b border-border px-4 py-2 text-xl font-medium tracking-tight">
				Experience
			</h2>
			<Accordion type="single" collapsible className="rounded-none border-0">
				{EXPERIENCE.map((item) => (
					<AccordionItem
						key={`${item.company}-${item.start}`}
						value={`${item.company}-${item.start}`}
						className="border-border data-open:bg-transparent"
					>
						<AccordionTrigger className="items-center gap-3 px-4 py-3 hover:no-underline">
							<div className="flex min-w-0 flex-1 items-center gap-3">
								<Logo item={item} />
								<div className="min-w-0">
									<p className="font-medium">{item.company}</p>
									<p className="text-sm text-muted-foreground">{item.role}</p>
									<div className="mt-1 sm:hidden">
										<DateRange item={item} />
									</div>
								</div>
							</div>
							<div className="hidden shrink-0 sm:block">
								<DateRange item={item} />
							</div>
						</AccordionTrigger>
						<AccordionContent className="px-4 pb-4">
							<ul className="list-disc space-y-2 pl-5 text-[15px] leading-6 text-foreground marker:text-foreground">
								{item.highlights.map((highlight) => (
									<li key={highlight}>{highlight}</li>
								))}
							</ul>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
			<div className="flex justify-center border-t border-border px-4 py-4">
				<a
					href={withUtm("https://www.linkedin.com/in/itzadetunji")}
					target="_blank"
					rel="noreferrer"
					className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
				>
					View all
					<ArrowRightIcon size={14} weight="bold" />
				</a>
			</div>
		</Section>
	);
}
