"use client";

import { Link } from "@tanstack/react-router";
import Matter from "matter-js";
import {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { SKILLS } from "#/components/icons/skills";
import { setHideSiteFooter } from "#/lib/site-chrome";

type FallingPill = {
	id: string;
	skillIndex: number;
	spawnX: number;
};

const MAX_PILLS = 80;
const WALL = 80;
const AUTO_GAP_MIN = 1000;
const AUTO_GAP_MAX = 2000;
const HOLD_SPAWN_MS = 280;

function nextAutoGap() {
	return AUTO_GAP_MIN + Math.random() * (AUTO_GAP_MAX - AUTO_GAP_MIN);
}

export function NotFoundPage() {
	const stageRef = useRef<HTMLDivElement>(null);
	const instanceId = useId();
	const skillCursor = useRef(0);
	const spawnSeq = useRef(0);
	const engineRef = useRef<Matter.Engine | null>(null);
	const entriesRef = useRef(
		new Map<string, { body: Matter.Body; el: HTMLElement }>(),
	);
	const pillElRefs = useRef(new Map<string, HTMLElement | null>());
	const addPillRef = useRef<(spawnX: number) => void>(() => {});
	const [pills, setPills] = useState<FallingPill[]>([]);

	const addPill = useCallback(
		(spawnX: number) => {
			const skillIndex = skillCursor.current % SKILLS.length;
			skillCursor.current += 1;
			spawnSeq.current += 1;
			const id = `${instanceId}-${spawnSeq.current}`;

			setPills((current) => {
				const next = [...current, { id, skillIndex, spawnX }];
				if (next.length <= MAX_PILLS) return next;

				const removed = next.slice(0, next.length - MAX_PILLS);
				for (const old of removed) {
					const entry = entriesRef.current.get(old.id);
					if (entry && engineRef.current) {
						Matter.World.remove(engineRef.current.world, entry.body);
						entriesRef.current.delete(old.id);
					}
					pillElRefs.current.delete(old.id);
				}
				return next.slice(next.length - MAX_PILLS);
			});
		},
		[instanceId],
	);

	addPillRef.current = addPill;

	useEffect(() => {
		setHideSiteFooter(true);
		return () => setHideSiteFooter(false);
	}, []);

	useEffect(() => {
		const stage = stageRef.current;
		if (!stage) return;

		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		const width = stage.clientWidth;
		const height = stage.clientHeight;
		const engine = Matter.Engine.create({
			gravity: { x: 0, y: reducedMotion ? 0 : 1.35, scale: 0.001 },
		});
		engineRef.current = engine;

		const floor = Matter.Bodies.rectangle(
			width / 2,
			height + WALL / 2,
			Math.max(width, 1600) + WALL * 4,
			WALL,
			{ isStatic: true, friction: 0.55, restitution: 0.35 },
		);
		const left = Matter.Bodies.rectangle(
			-WALL / 2,
			height / 2,
			WALL,
			height * 4,
			{ isStatic: true },
		);
		const right = Matter.Bodies.rectangle(
			width + WALL / 2,
			height / 2,
			WALL,
			height * 4,
			{ isStatic: true },
		);
		Matter.World.add(engine.world, [floor, left, right]);

		const mouse = Matter.Mouse.create(stage);
		const mouseConstraint = Matter.MouseConstraint.create(engine, {
			mouse,
			constraint: {
				stiffness: 0.22,
				damping: 0.12,
				render: { visible: false },
			},
		});
		Matter.World.add(engine.world, mouseConstraint);

		const onResize = () => {
			const nextW = stage.clientWidth;
			const nextH = stage.clientHeight;
			Matter.Body.setPosition(floor, {
				x: nextW / 2,
				y: nextH + WALL / 2,
			});
			Matter.Body.setPosition(right, {
				x: nextW + WALL / 2,
				y: nextH / 2,
			});
			Matter.Body.setPosition(left, {
				x: -WALL / 2,
				y: nextH / 2,
			});
		};
		window.addEventListener("resize", onResize);

		let frame = 0;
		const tick = () => {
			for (const { body, el } of entriesRef.current.values()) {
				el.style.opacity = "1";
				el.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate(-50%, -50%) rotate(${body.angle}rad)`;
			}
			frame = requestAnimationFrame(tick);
		};

		const runner = Matter.Runner.create();
		if (!reducedMotion) {
			Matter.Runner.run(runner, engine);
		}
		frame = requestAnimationFrame(tick);

		let autoTimeout = 0;
		let holdInterval = 0;
		let holdX = width / 2;
		let pointerDown = false;
		let suppressClickSpawn = false;

		Matter.Events.on(mouseConstraint, "startdrag", () => {
			suppressClickSpawn = true;
			window.clearInterval(holdInterval);
			holdInterval = 0;
		});
		Matter.Events.on(mouseConstraint, "enddrag", () => {
			window.setTimeout(() => {
				suppressClickSpawn = false;
			}, 40);
		});

		const localX = (clientX: number) => {
			const bounds = stage.getBoundingClientRect();
			return Math.min(Math.max(clientX - bounds.left, 24), bounds.width - 24);
		};

		const bodyAtPointer = (clientX: number, clientY: number) => {
			const bounds = stage.getBoundingClientRect();
			const point = {
				x: clientX - bounds.left,
				y: clientY - bounds.top,
			};
			const bodies = [...entriesRef.current.values()].map(
				(entry) => entry.body,
			);
			return Matter.Query.point(bodies, point).length > 0;
		};

		const onPointerDown = (event: PointerEvent) => {
			if (event.button !== 0) return;
			if ((event.target as HTMLElement | null)?.closest?.("[data-ui]")) return;
			if (bodyAtPointer(event.clientX, event.clientY)) return;

			pointerDown = true;
			holdX = localX(event.clientX);
			if (!suppressClickSpawn) {
				addPillRef.current(holdX);
			}
			window.clearInterval(holdInterval);
			holdInterval = window.setInterval(() => {
				if (!pointerDown || suppressClickSpawn) return;
				addPillRef.current(holdX);
			}, HOLD_SPAWN_MS);
		};

		const onPointerMove = (event: PointerEvent) => {
			if (!pointerDown) return;
			holdX = localX(event.clientX);
		};

		const stopHold = () => {
			pointerDown = false;
			window.clearInterval(holdInterval);
			holdInterval = 0;
		};

		const scheduleAuto = () => {
			if (reducedMotion) return;
			autoTimeout = window.setTimeout(() => {
				const x = 24 + Math.random() * Math.max(stage.clientWidth - 48, 48);
				addPillRef.current(x);
				scheduleAuto();
			}, nextAutoGap());
		};

		stage.addEventListener("pointerdown", onPointerDown);
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", stopHold);
		window.addEventListener("pointercancel", stopHold);
		scheduleAuto();

		if (reducedMotion) {
			for (let i = 0; i < Math.min(SKILLS.length, 18); i++) {
				addPillRef.current(
					48 + Math.random() * Math.max(stage.clientWidth - 96, 48),
				);
			}
		}

		return () => {
			cancelAnimationFrame(frame);
			window.clearTimeout(autoTimeout);
			window.clearInterval(holdInterval);
			window.removeEventListener("resize", onResize);
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", stopHold);
			window.removeEventListener("pointercancel", stopHold);
			stage.removeEventListener("pointerdown", onPointerDown);
			Matter.Runner.stop(runner);
			Matter.World.clear(engine.world, false);
			Matter.Engine.clear(engine);
			engineRef.current = null;
			entriesRef.current.clear();
		};
	}, []);

	useLayoutEffect(() => {
		const stage = stageRef.current;
		const engine = engineRef.current;
		if (!stage || !engine) return;

		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		for (const pill of pills) {
			if (entriesRef.current.has(pill.id)) continue;
			const el = pillElRefs.current.get(pill.id);
			if (!el) continue;

			const { width: pw, height: ph } = el.getBoundingClientRect();
			const w = Math.max(pw, 48);
			const h = Math.max(ph, 28);
			const x = pill.spawnX;
			const y = reducedMotion
				? stage.clientHeight - 40 - Math.random() * 80
				: -40 - Math.random() * 60;

			const body = Matter.Bodies.rectangle(x, y, w, h, {
				chamfer: { radius: Math.min(h / 2, 14) },
				restitution: 0.48,
				friction: 0.22,
				frictionAir: 0.02,
				density: 0.002,
				angle: (Math.random() - 0.5) * 0.5,
			});

			if (reducedMotion) {
				Matter.Body.setStatic(body, true);
			}

			Matter.World.add(engine.world, body);
			entriesRef.current.set(pill.id, { body, el });
			el.style.opacity = "1";
		}
	}, [pills]);

	return (
		<div className="relative flex min-h-[calc(100dvh-3.5rem)] flex-1 flex-col items-center justify-center overflow-hidden">
			<div
				ref={stageRef}
				data-lenis-prevent
				className="absolute inset-0 z-0 cursor-grab touch-none active:cursor-grabbing"
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
							ref={(node) => {
								pillElRefs.current.set(pill.id, node);
							}}
							className="pointer-events-none absolute top-0 left-0 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium will-change-transform"
							style={{ opacity: 0 }}
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

			<div
				data-ui
				className="pointer-events-none relative z-10 flex w-fit flex-col items-center justify-center px-6 py-16 text-center"
			>
				<p className="text-sm font-medium tracking-tight text-muted-foreground">
					404 - Page Doesn&apos;t Exist
				</p>
				<h1 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.1]">
					Nothing Here, <br />
					Let me Fill It Up For You
				</h1>
				<Link
					to="/"
					data-ui
					className="pointer-events-auto mt-8 inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
				>
					Back home
				</Link>
			</div>
		</div>
	);
}
