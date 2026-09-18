import { SealCheckIcon } from "@phosphor-icons/react";
import { HeroRole } from "./HeroRole";
import { Section } from "./Section";

export function Hero() {
	return (
		<Section className="relative px-0">
			<div className="relative flex items-end">
				<div className="border-r">
					<img
						src="https://github.com/itzadetunji.png"
						alt="Adetunji"
						width={128}
						height={128}
						fetchPriority="high"
						decoding="async"
						className="size-24 shrink-0 rounded-full object-cover outline outline-white/10 sm:size-32"
					/>
				</div>
				<div className="min-w-0 flex-1">
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
