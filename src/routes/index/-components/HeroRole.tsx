"use client";

import { animate, utils } from "animejs";
import { type RefObject, useEffect, useRef } from "react";

export const ROLES = [
	"Software engineer.",
	"Full-stack developer.",
	"Opensource contributor.",
	"Single",
];

const HOLD_MS = 2500;
const SWAP_MS = 400;
const SWAP_Y = 30;
const SHINE_MS = 800;

function RoleLine({
	lineRef,
	text,
}: {
	lineRef: RefObject<HTMLSpanElement | null>;
	text: string;
}) {
	return (
		<span
			ref={lineRef}
			className="absolute top-0 left-0 inline-block will-change-[transform,opacity]"
		>
			<span data-label className="text-muted-foreground">
				{text}
			</span>
			<span
				data-shine
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-clip-text text-transparent"
				style={{
					backgroundImage:
						"linear-gradient(90deg, transparent 0%, transparent calc(var(--shine) * 1% - 16%), color-mix(in oklab, var(--foreground) 80%, white) calc(var(--shine) * 1%), transparent calc(var(--shine) * 1% + 16%), transparent 100%)",
					WebkitTextFillColor: "transparent",
					["--shine" as string]: "-20",
				}}
			>
				{text}
			</span>
		</span>
	);
}

export function HeroRole() {
	const currentRef = useRef<HTMLSpanElement>(null);
	const nextRef = useRef<HTMLSpanElement>(null);
	const indexRef = useRef(0);

	useEffect(() => {
		const first = currentRef.current;
		const second = nextRef.current;
		if (!first || !second) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		let cancelled = false;
		let front = first;
		let back = second;
		let holdTimer = 0;
		const playing: { revert: () => void }[] = [];

		const wait = (ms: number) =>
			new Promise<void>((resolve) => {
				holdTimer = window.setTimeout(resolve, ms);
			});

		const setText = (line: HTMLSpanElement, value: string) => {
			for (const node of line.querySelectorAll("[data-label], [data-shine]")) {
				node.textContent = value;
			}
		};

		const shine = (line: HTMLSpanElement) => {
			const layer = line.querySelector<HTMLElement>("[data-shine]");
			if (!layer) return;
			utils.set(layer, { "--shine": -20 });
			const animation = animate(layer, {
				"--shine": 120,
				duration: SHINE_MS,
				ease: "inOutSine",
			});
			playing.push(animation);
		};

		const run = async () => {
			utils.set(front, { y: -SWAP_Y, opacity: 0 });
			utils.set(back, { y: -SWAP_Y, opacity: 0 });

			const enter = animate(front, {
				y: 0,
				opacity: 1,
				duration: SWAP_MS,
				ease: "outQuad",
			});
			playing.push(enter);
			await enter;
			if (cancelled) return;

			while (!cancelled) {
				shine(front);
				await wait(HOLD_MS);
				if (cancelled) break;

				indexRef.current = (indexRef.current + 1) % ROLES.length;
				setText(back, ROLES[indexRef.current] ?? ROLES[0]);
				utils.set(back, { y: -SWAP_Y, opacity: 0 });

				const out = animate(front, {
					y: SWAP_Y,
					opacity: 0,
					duration: SWAP_MS,
					ease: "inQuad",
				});
				const inn = animate(back, {
					y: 0,
					opacity: 1,
					duration: SWAP_MS,
					ease: "outQuad",
				});
				playing.push(out, inn);
				await Promise.all([out, inn]);
				if (cancelled) break;

				const outgoing = front;
				front = back;
				back = outgoing;
				utils.set(back, { y: -SWAP_Y, opacity: 0 });
			}
		};

		void run();

		return () => {
			cancelled = true;
			window.clearTimeout(holdTimer);
			for (const animation of playing) animation.revert();
		};
	}, []);

	return (
		<p
			aria-live="polite"
			className="relative overflow-hidden text-sm sm:text-base"
		>
			<span className="block invisible!">{ROLES[0]}</span>
			<RoleLine lineRef={currentRef} text={ROLES[0]} />
			<RoleLine lineRef={nextRef} text={ROLES[1] ?? ROLES[0]} />
		</p>
	);
}
