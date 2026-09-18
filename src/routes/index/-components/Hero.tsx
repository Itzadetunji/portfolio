import { SealCheckIcon, SpeakerHighIcon } from "@phosphor-icons/react";
import { HeroRole } from "./HeroRole";
import { Section } from "./Section";

function speakName() {
	if (typeof window === "undefined" || !window.speechSynthesis) return;
	window.speechSynthesis.cancel();
	const utterance = new SpeechSynthesisUtterance("Ah deh toon jee");
	utterance.rate = 0.9;
	window.speechSynthesis.speak(utterance);
}

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
						<button
							type="button"
							onClick={speakName}
							aria-label="Pronounce Adetunji"
							className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<SpeakerHighIcon size={18} weight="regular" />
						</button>
					</div>
					<HeroRole />
				</div>
			</div>
		</Section>
	);
}
