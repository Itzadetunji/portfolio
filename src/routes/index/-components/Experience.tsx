import {
	addMonths,
	format,
	formatDuration,
	intervalToDuration,
	parse,
	startOfMonth,
} from "date-fns";
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
};

export const EXPERIENCE: ExperienceItem[] = [
	{
		company: "Company",
		href: "https://example.com",
		logo: "/experience/company.png",
		role: "Role",
		location: "Remote",
		start: "2025-09",
		end: "2026-06",
	},
	{
		company: "Another company",
		href: "https://example.com",
		role: "Role",
		location: "Remote",
		start: "2024-01",
		end: "2025-06",
	},
];

function Logo({ item }: { item: ExperienceItem }) {
	const initial = item.company.charAt(0).toUpperCase();

	if (item.logo) {
		return (
			<img
				src={item.logo}
				alt=""
				width={40}
				height={40}
				loading="lazy"
				decoding="async"
				className="size-10 rounded-xl object-cover outline outline-white/10"
			/>
		);
	}

	return (
		<div className="flex size-10 items-center justify-center rounded-xl bg-muted text-sm font-medium outline outline-white/10">
			{initial}
		</div>
	);
}

export function Experience() {
	return (
		<Section className="px-0">
			<h2 className="border-b border-border px-4 py-2 text-xl font-medium tracking-tight">
				Experience
			</h2>
			<ul className="flex flex-col gap-4 px-4 py-4">
				{EXPERIENCE.map((item) => {
					const start = parse(item.start, "yyyy-MM", new Date());
					const end = item.end
						? parse(item.end, "yyyy-MM", new Date())
						: startOfMonth(new Date());

					return (
						<li
							key={`${item.company}-${item.start}`}
							className="flex items-start justify-between gap-4"
						>
							<div className="flex min-w-0 items-center gap-3">
								<Logo item={item} />
								<div className="min-w-0">
									<a
										href={withUtm(item.href)}
										target="_blank"
										rel="noreferrer"
										className="font-medium underline underline-offset-[3px]"
									>
										{item.company}
									</a>
									<p className="text-sm text-muted-foreground">
										{item.role} • {item.location} •{" "}
										{formatDuration(
											intervalToDuration({
												start,
												end: addMonths(end, 1),
											}),
											{ format: ["years", "months"] },
										)}
									</p>
								</div>
							</div>
							<p className="shrink-0 pt-0.5 text-sm text-muted-foreground">
								{format(start, "MMM yyyy")} -{" "}
								{item.end ? format(end, "MMM yyyy") : "Present"}
							</p>
						</li>
					);
				})}
			</ul>
		</Section>
	);
}
