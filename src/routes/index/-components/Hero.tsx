import { EyeIcon, SealCheckIcon } from "@phosphor-icons/react";
import { HeroRole } from "./HeroRole";
import { Section } from "./Section";

const visitsFormatter = new Intl.NumberFormat("en", {
	notation: "compact",
	compactDisplay: "short",
	maximumFractionDigits: 1,
});

export function Hero({ visits = 0 }: { visits?: number }) {
	return (
		<Section className="relative px-0">
			<div className="relative flex items-end">
				<div className="border-r">
					<img
						src="/images/itzadetunji.webp"
						alt="Adetunji"
						width={128}
						height={128}
						fetchPriority="high"
						decoding="async"
						className="size-24 shrink-0 rounded-full object-cover outline outline-white/10 sm:size-32"
					/>
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2 justify-end w-full px-4 py-1">
						<EyeIcon
							size={16}
							weight="regular"
							className="text-muted-foreground"
						/>
						<p
							className="text-sm text-muted-foreground"
							title={`${visits.toLocaleString("en")} visits`}
						>
							{visitsFormatter.format(visits)} visits
						</p>
					</div>
					<div className="flex items-center gap-2 border-y">
						<h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl ">
							Adetunji
						</h1>
						<SealCheckIcon
							weight="fill"
							className="size-5 shrink-0 text-sky-400"
							aria-label="Verified"
						/>
					</div>
					<HeroRole />
				</div>
			</div>
		</Section>
	);
}
