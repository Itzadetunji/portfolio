"use client";

import Matter from "matter-js";
import { useEffect, useRef, useState } from "react";
import { SKILLS } from "#/components/icons/skills";
import { Button } from "#/components/ui/button";
import { Section } from "./Section";

const ARENA_HEIGHT = 320;
const WALL = 80;

type DeviceMotionWithPermission = typeof DeviceMotionEvent & {
	requestPermission?: () => Promise<PermissionState>;
};

export function Skills() {
	const arenaRef = useRef<HTMLDivElement>(null);
	const pillRefs = useRef<(HTMLSpanElement | null)[]>([]);
	const bodiesRef = useRef<Matter.Body[]>([]);
	const vibrateRef = useRef(true);
	const lastShakeAt = useRef(0);
	const shakeRef = useRef<(intensity?: number) => void>(() => {});
	const [vibrate, setVibrate] = useState(true);

	useEffect(() => {
		vibrateRef.current = vibrate;
	}, [vibrate]);

	useEffect(() => {
		const arena = arenaRef.current;
		if (!arena) return;
		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		let runner: Matter.Runner | null = null;
		let engine: Matter.Engine | null = null;
		let frame = 0;
		let started = false;
		let observer: IntersectionObserver | null = null;
		let lastMotion = { x: 0, y: 0, z: 0 };

		const shakeBodies = (intensity = 1) => {
			const now = performance.now();
			if (now - lastShakeAt.current < 90) return;
			lastShakeAt.current = now;
			const force = Math.min(Math.max(intensity, 0.4), 2.8);
			for (const body of bodiesRef.current) {
				Matter.Body.setVelocity(body, {
					x: (Math.random() - 0.5) * 14 * force,
					y: (Math.random() - 0.85) * 12 * force,
				});
				Matter.Body.setAngularVelocity(
					body,
					(Math.random() - 0.5) * 0.45 * force,
				);
			}
		};
		shakeRef.current = shakeBodies;

		const stop = () => {
			cancelAnimationFrame(frame);
			if (runner && engine) Matter.Runner.stop(runner);
			if (engine) {
				Matter.World.clear(engine.world, false);
				Matter.Engine.clear(engine);
			}
		};

		const onDeviceMotion = (event: DeviceMotionEvent) => {
			const raw = event.acceleration;
			const gravity = event.accelerationIncludingGravity;
			let mag = Math.hypot(raw?.x ?? 0, raw?.y ?? 0, raw?.z ?? 0);
			if (mag < 0.4 && gravity) {
				const x = gravity.x ?? 0;
				const y = gravity.y ?? 0;
				const z = gravity.z ?? 0;
				mag = Math.hypot(
					x - lastMotion.x,
					y - lastMotion.y,
					z - lastMotion.z,
				);
				lastMotion = { x, y, z };
			}
			if (mag > 2.2) shakeBodies(mag / 6);
		};

		const start = () => {
			if (started) return;
			started = true;

			const width = arena.clientWidth;
			const height = ARENA_HEIGHT;
			engine = Matter.Engine.create({
				gravity: { x: 0, y: 1.1, scale: 0.001 },
			});

			const floor = Matter.Bodies.rectangle(
				width / 2,
				height + WALL / 2,
				Math.max(width, 1200) + WALL * 4,
				WALL,
				{ isStatic: true, friction: 0.4 },
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

			const bodies: Matter.Body[] = [];
			pillRefs.current.forEach((pill, index) => {
				if (!pill) return;
				const { width: pw, height: ph } = pill.getBoundingClientRect();
				const w = Math.max(pw, 48);
				const h = Math.max(ph, 28);
				const x = 48 + Math.random() * Math.max(width - 96, 48);
				const y = reducedMotion
					? height - 28 - (index % 4) * 36
					: -56 - index * 34;
				const body = Matter.Bodies.rectangle(x, y, w, h, {
					chamfer: { radius: Math.min(h / 2, 14) },
					restitution: 0.28,
					friction: 0.18,
					frictionAir: 0.028,
					density: 0.0022,
					angle: (Math.random() - 0.5) * 0.4,
				});
				bodies.push(body);
			});
			bodiesRef.current = bodies;
			Matter.World.add(engine.world, bodies);

			const mouse = Matter.Mouse.create(arena);
			const mouseConstraint = Matter.MouseConstraint.create(engine, {
				mouse,
				constraint: {
					stiffness: 0.18,
					damping: 0.12,
					render: { visible: false },
				},
			});
			Matter.World.add(engine.world, mouseConstraint);

			let tickCount = 0;
			const onBeforeUpdate = () => {
				if (!vibrateRef.current) return;
				tickCount += 1;
				if (tickCount % 3 !== 0) return;
				const time = engine?.timing.timestamp ?? 0;
				for (const body of bodiesRef.current) {
					const drift = Math.sin(time / 380 + body.id) * 0.000018;
					Matter.Body.applyForce(body, body.position, {
						x: drift + (Math.random() - 0.5) * 0.00005,
						y: (Math.random() - 0.5) * 0.000028,
					});
				}
			};
			Matter.Events.on(engine, "beforeUpdate", onBeforeUpdate);

			const onResize = () => {
				const next = arena.clientWidth;
				Matter.Body.setPosition(floor, {
					x: next / 2,
					y: height + WALL / 2,
				});
				Matter.Body.setPosition(right, {
					x: next + WALL / 2,
					y: height / 2,
				});
			};
			window.addEventListener("resize", onResize);
			window.addEventListener("devicemotion", onDeviceMotion);

			const tick = () => {
				bodies.forEach((body, index) => {
					const el = pillRefs.current[index];
					if (!el) return;
					el.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate(-50%, -50%) rotate(${body.angle}rad)`;
				});
				frame = requestAnimationFrame(tick);
			};

			runner = Matter.Runner.create();
			Matter.Runner.run(runner, engine);
			tick();

			cleanupExtras = () => {
				window.removeEventListener("resize", onResize);
				window.removeEventListener("devicemotion", onDeviceMotion);
				if (engine) {
					Matter.Events.off(engine, "beforeUpdate", onBeforeUpdate);
					Matter.World.remove(engine.world, mouseConstraint);
				}
			};
		};

		let cleanupExtras = () => {};

		observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					start();
					observer?.disconnect();
				}
			},
			{ threshold: 0.2 },
		);
		observer.observe(arena);

		return () => {
			observer?.disconnect();
			cleanupExtras();
			stop();
			bodiesRef.current = [];
		};
	}, []);

	async function shakeMeDad() {
		shakeRef.current(1.35);
		const Motion = DeviceMotionEvent as DeviceMotionWithPermission;
		if (typeof Motion.requestPermission === "function") {
			try {
				await Motion.requestPermission();
			} catch {
				// Permission prompt is best-effort; the button still shakes.
			}
		}
	}

	return (
		<Section className="px-0">
			<h2 className="border-b border-border px-4 py-2 text-xl font-medium tracking-tight">
				Skills
			</h2>
			<div className="flex flex-wrap gap-2 border-b border-border px-4 py-3">
				<Button type="button" variant="outline" size="sm" onClick={shakeMeDad}>
					Shake Me Dad
				</Button>
				<Button
					type="button"
					variant={vibrate ? "default" : "outline"}
					size="sm"
					aria-pressed={vibrate}
					onClick={() => setVibrate((on) => !on)}
				>
					Toggle Vibrate
				</Button>
			</div>
			<div
				ref={arenaRef}
				data-lenis-prevent
				className="relative cursor-grab overflow-hidden touch-none active:cursor-grabbing"
				style={{ height: ARENA_HEIGHT }}
			>
				{SKILLS.map((skill, index) => {
					const Icon = skill.icon;
					const branded =
						Boolean(skill.color) && !skill.darkColor && !skill.stroke;
					return (
						<span
							key={skill.id}
							ref={(node) => {
								pillRefs.current[index] = node;
							}}
							className="pointer-events-none absolute top-0 left-0 inline-flex select-none items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium will-change-transform"
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
		</Section>
	);
}
