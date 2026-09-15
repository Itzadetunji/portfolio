import { SealCheckIcon, SpeakerHighIcon } from "@phosphor-icons/react";
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
		<Section className="relative py-4">
			<div className="relative overflow-hidden">
				<div className="relative flex items-center gap-5 sm:gap-7">
					<img
						src="https://github.com/itzadetunji.png"
						alt="Adetunji"
						width={128}
						height={128}
						className="size-24 shrink-0 rounded-full object-cover outline outline-white/10 sm:size-32"
					/>
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2">
							<h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
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
						<p className="mt-1 text-sm text-muted-foreground sm:text-base">
							Software engineer.
						</p>
					</div>
				</div>
			</div>
		</Section>
	);
}
