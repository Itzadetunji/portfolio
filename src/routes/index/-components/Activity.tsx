"use client";

import { useQuery } from "@tanstack/react-query";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { Section } from "./Section";

const GITHUB_USER = "itzadetunji";

const LEVELS = [
	"bg-muted",
	"bg-emerald-900",
	"bg-emerald-700",
	"bg-emerald-500",
	"bg-emerald-400",
] as const;

type Day = {
	date: string;
	count: number;
	level: number;
};

function startOfWeek(date: Date) {
	const next = new Date(date);
	next.setHours(0, 0, 0, 0);
	next.setDate(next.getDate() - next.getDay());
	return next;
}

function toKey(date: Date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

function buildWeeks(days: Day[]) {
	const byDate = new Map(days.map((day) => [day.date, day]));
	const end = new Date();
	end.setHours(0, 0, 0, 0);
	const start = startOfWeek(new Date(end));
	start.setDate(start.getDate() - 52 * 7);

	const weeks: Day[][] = [];
	const cursor = new Date(start);

	while (cursor <= end) {
		const week: Day[] = [];
		for (let i = 0; i < 7; i++) {
			const key = toKey(cursor);
			week.push(byDate.get(key) ?? { date: key, count: 0, level: 0 });
			cursor.setDate(cursor.getDate() + 1);
		}
		weeks.push(week);
	}

	return weeks;
}

function contributionLabel(day: Day) {
	const date = new Date(`${day.date}T00:00:00`);
	const formatted = date.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});
	const noun = day.count === 1 ? "contribution" : "contributions";
	return `${day.count} ${noun} on ${formatted}`;
}

function monthLabels(weeks: Day[][]) {
	return weeks.map((week, index) => {
		const first = new Date(`${week[0].date}T00:00:00`);
		const label = first.toLocaleDateString("en-US", { month: "short" });
		if (index === 0) return label;
		const prev = new Date(`${weeks[index - 1][0].date}T00:00:00`);
		return first.getMonth() === prev.getMonth() ? "" : label;
	});
}

async function fetchContributions() {
	const response = await fetch(
		`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`,
	);
	if (!response.ok) throw new Error("Could not load GitHub activity");
	return response.json() as Promise<{
		total: Record<string, number>;
		contributions: Day[];
	}>;
}

export function Activity() {
	const { data } = useQuery({
		queryKey: ["github-contributions", GITHUB_USER],
		queryFn: fetchContributions,
		staleTime: 1000 * 60 * 60,
	});

	const weeks = buildWeeks(data?.contributions ?? []);
	const labels = monthLabels(weeks);
	const total = weeks
		.flat()
		.reduce((sum, day) => sum + day.count, 0);
	const rangeLabel = (() => {
		if (!weeks.length) return "";
		const first = new Date(`${weeks[0][0].date}T00:00:00`);
		const last = new Date(`${weeks.at(-1)?.[6]?.date}T00:00:00`);
		return `${first.getFullYear()}-${String(last.getFullYear()).slice(2)}`;
	})();

	return (
		<Section className="border-b px-0">
			<h2 className="border-b border-border px-4 py-2 text-xl font-medium tracking-tight">
				Activity
			</h2>
			<TooltipProvider delayDuration={200}>
				<div className="px-4 py-4">
					<div
						className="mb-1 grid text-[11px] text-muted-foreground"
						style={{
							gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
						}}
					>
						{labels.map((label, index) => (
							<span
								key={weeks[index][0].date}
								className="overflow-visible whitespace-nowrap"
							>
								{label}
							</span>
						))}
					</div>
					<div
						className="grid w-full gap-0.75"
						style={{
							gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
						}}
					>
						{weeks.map((week) => (
							<div
								key={week[0].date}
								className="flex flex-col gap-0.75"
							>
								{week.map((day) => (
									<Tooltip key={day.date}>
										<TooltipTrigger
											aria-label={contributionLabel(day)}
											className={`aspect-square w-full min-w-0 rounded-[3px] border-0 p-0 ${LEVELS[day.level] ?? LEVELS[0]}`}
										/>
										<TooltipContent side="top" sideOffset={4}>
											{contributionLabel(day)}
										</TooltipContent>
									</Tooltip>
								))}
							</div>
						))}
					</div>
					<div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
						<p>
							{total} contributions in {rangeLabel}
						</p>
						<div className="flex items-center gap-1">
							<span>Less</span>
							{LEVELS.map((level) => (
								<span
									key={level}
									className={`size-2.5 rounded-[3px] ${level}`}
								/>
							))}
							<span>More</span>
						</div>
					</div>
				</div>
			</TooltipProvider>
		</Section>
	);
}
