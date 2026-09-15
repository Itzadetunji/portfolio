import { QuotesIcon } from "@phosphor-icons/react";
import { Section } from "./Section";

export function Quote() {
	return (
		<Section className="px-0">
			<h2 className="border-b border-border px-4 py-2 text-xl font-medium tracking-tight">
				Quote
			</h2>
			<figure className="flex flex-col items-center px-6 py-12 text-center sm:px-12 sm:py-16">
				<QuotesIcon
					aria-hidden
					className="mb-6 size-10 text-muted-foreground/35"
					weight="fill"
				/>
				<blockquote className="max-w-xl font-serif text-[1.65rem] font-medium italic leading-[1.35] tracking-tight text-foreground sm:text-[2rem]">
					The worth of a man is what he does with his power
				</blockquote>
				<figcaption className="mt-8 flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
					<span aria-hidden className="h-px w-7 bg-muted-foreground/50" />
					Plato
					<span aria-hidden className="h-px w-7 bg-muted-foreground/50" />
				</figcaption>
			</figure>
		</Section>
	);
}
