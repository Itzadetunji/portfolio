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

function parseMonth(value: string) {
	const [year, month] = value.split("-").map(Number);
	return new Date(year, month - 1, 1);
}

function formatMonth(value: string) {
	return parseMonth(value).toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
	});
}

function monthCount(start: string, end: string | null) {
	const from = parseMonth(start);
	const to = end ? parseMonth(end) : new Date();
	return (
		(to.getFullYear() - from.getFullYear()) * 12 +
		(to.getMonth() - from.getMonth()) +
		1
	);
}

function formatTenure(start: string, end: string | null) {
	const months = Math.max(monthCount(start, end), 1);
	if (months < 12) return `${months} mo${months === 1 ? "" : "s"}`;
	const years = Math.floor(months / 12);
	const rest = months % 12;
	const yearLabel = `${years} yr${years === 1 ? "" : "s"}`;
	if (!rest) return yearLabel;
	return `${yearLabel} ${rest} mo${rest === 1 ? "" : "s"}`;
}

function Logo({ item }: { item: ExperienceItem }) {
	const initial = item.company.charAt(0).toUpperCase();

	if (item.logo) {
		return (
			<img
				src={item.logo}
				alt=""
				width={40}
				height={40}
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
		<Section className="border-b px-0">
			<h2 className="border-b border-border px-4 py-2 text-xl font-medium tracking-tight">
				Experience
			</h2>
			<ul className="flex flex-col gap-4 px-4 py-4">
				{EXPERIENCE.map((item) => (
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
									{formatTenure(item.start, item.end)}
								</p>
							</div>
						</div>
						<p className="shrink-0 pt-0.5 text-sm text-muted-foreground">
							{formatMonth(item.start)} -{" "}
							{item.end ? formatMonth(item.end) : "Present"}
						</p>
					</li>
				))}
			</ul>
		</Section>
	);
}
