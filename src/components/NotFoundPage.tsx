"use client";

import { Link } from "@tanstack/react-router";
import { animate, utils } from "animejs";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { SKILLS } from "#/components/icons/skills";
import { setHideSiteFooter } from "#/lib/site-chrome";

type FallingPill = {
	id: string;
	skillIndex: number;
	x: number;
};

const MAX_PILLS = 72;
const DROP_GAP_MIN = 1000;
const DROP_GAP_MAX = 2000;

function nextGap() {
	return DROP_GAP_MIN + Math.random() * (DROP_GAP_MAX - DROP_GAP_MIN);
}

export function NotFoundPage() {
	const stageRef = useRef<HTMLDivElement>(null);
	const instanceId = useId();
	const skillCursor = useRef(0);
	const spawnId = useRef(0);
	const running = useRef<Array<{ pause: () => void }>>([]);
	const [pills, setPills] = useState<FallingPill[]>([]);

	useEffect(() => {
		setHideSiteFooter(true);
		return () => setHideSiteFooter(false);
	}, []);

	useEffect(() => {
		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (reducedMotion) {
			setPills(
				SKILLS.map((skill, index) => ({
					id: `${instanceId}-static-${skill.id}`,
					skillIndex: index,
					x: 8 + ((index * 37) % 84),
				})),
			);
			return;
		}

		let cancelled = false;
		let timeout = 0;

		const spawn = () => {
			if (cancelled) return;
			const skillIndex = skillCursor.current % SKILLS.length;
			skillCursor.current += 1;
			spawnId.current += 1;
			const id = `${instanceId}-${spawnId.current}`;
			const x = 6 + Math.random() * 88;

			setPills((current) => {
				const next = [...current, { id, skillIndex, x }];
				return next.length > MAX_PILLS
					? next.slice(next.length - MAX_PILLS)
					: next;
			});

			timeout = window.setTimeout(spawn, nextGap());
		};

		timeout = window.setTimeout(spawn, 200);

		return () => {
			cancelled = true;
			window.clearTimeout(timeout);
			for (const animation of running.current) animation.pause();
			running.current = [];
		};
	}, [instanceId]);

	useLayoutEffect(() => {
		const stage = stageRef.current;
		if (!stage) return;

		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (reducedMotion) {
			for (const node of stage.querySelectorAll<HTMLElement>("[data-pill]")) {
				if (node.dataset.dropped) continue;
				node.dataset.dropped = "1";
				const pillHeight = node.offsetHeight || 28;
				utils.set(node, {
					y: stage.clientHeight - 28 - pillHeight / 2,
					rotate: (Math.random() - 0.5) * 24,
					opacity: 1,
				});
			}
			return;
		}

		for (const node of stage.querySelectorAll<HTMLElement>(
			"[data-pill]:not([data-dropped])",
		)) {
			node.dataset.dropped = "1";
			const pillHeight = node.offsetHeight || 28;
			const landY = stage.clientHeight - 28 - pillHeight / 2;
			const startY = -pillHeight - 48;
			const bounce1 = 52 + Math.random() * 18;
			const bounce2 = 22 + Math.random() * 10;
			const fallMs = 900 + Math.random() * 350;
			const rotate = (Math.random() - 0.5) * 24;

			utils.set(node, {
				y: startY,
				rotate: 0,
				opacity: 0,
			});

			const animation = animate(node, {
				y: [
					{ to: landY, duration: fallMs, ease: "inCubic" },
					{ to: landY - bounce1, duration: 240, ease: "outQuad" },
					{ to: landY, duration: 280, ease: "inQuad" },
					{ to: landY - bounce2, duration: 180, ease: "outQuad" },
					{ to: landY, duration: 220, ease: "inQuad" },
				],
				rotate: {
					to: rotate,
					duration: fallMs + 900,
					ease: "outQuad",
				},
				opacity: {
					to: 1,
					duration: 200,
					ease: "outQuad",
				},
			});
			running.current.push(animation);
		}
	}, [pills]);

	return (
		<div className="relative flex min-h-[calc(100dvh-3.5rem)] flex-1 flex-col overflow-hidden justify-center items-center">
			<div
				ref={stageRef}
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0"
			>
				{pills.map((pill) => {
					const skill = SKILLS[pill.skillIndex];
					if (!skill) return null;
					const Icon = skill.icon;
					const branded =
						Boolean(skill.color) && !skill.darkColor && !skill.stroke;
					return (
						<span
							key={pill.id}
							data-pill
							className="absolute top-0 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium will-change-transform"
							style={{
								left: `${pill.x}%`,
								opacity: 0,
							}}
						>
							<Icon
								aria-hidden
								className={`size-3.5 shrink-0 ${skill.darkColor ? "text-black dark:text-neutral-200" : ""} ${skill.stroke ? "text-muted-foreground" : ""}`}
								style={branded ? { color: skill.color } : undefined}
							/>
							{skill.label}
						</span>
					);
				})}
			</div>

			<div className="relative z-10 flex w-fit flex-col items-center justify-center px-6 py-16 text-center">
				<p className="text-sm font-medium tracking-tight text-muted-foreground">
					404 - Page Doesn&apos;t Exist
				</p>
				<h1 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.1]">
					This Page Doesn&apos;t Exist, Let me Fill It Up For You
				</h1>
				<Link
					to="/"
					className="mt-8 inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
				>
					Back home
				</Link>
			</div>
		</div>
	);
}
