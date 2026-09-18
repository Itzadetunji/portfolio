"use client";

import { cn } from "cn";
import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type PointerEvent,
} from "react";
import { Section } from "./Section";

type NoteId =
	| "C3"
	| "Cs3"
	| "D3"
	| "Ds3"
	| "E3"
	| "F3"
	| "Fs3"
	| "G3"
	| "Gs3"
	| "A3"
	| "As3"
	| "B3"
	| "C4";

const WHITE_KEYS: {
	id: NoteId;
	note: string;
	solfege: string;
	key: string;
}[] = [
	{ id: "C3", note: "C", solfege: "d", key: "A" },
	{ id: "D3", note: "D", solfege: "r", key: "S" },
	{ id: "E3", note: "E", solfege: "m", key: "D" },
	{ id: "F3", note: "F", solfege: "f", key: "F" },
	{ id: "G3", note: "G", solfege: "s", key: "G" },
	{ id: "A3", note: "A", solfege: "l", key: "H" },
	{ id: "B3", note: "B", solfege: "t", key: "J" },
	{ id: "C4", note: "C", solfege: "d", key: "K" },
];

const BLACK_SLOTS: ({
	id: NoteId;
	sharp: string;
	flat: string;
	key: string;
	align: "left" | "right" | "center";
} | null)[] = [
	{ id: "Cs3", sharp: "C♯", flat: "D♭", key: "W", align: "left" },
	{ id: "Ds3", sharp: "D♯", flat: "E♭", key: "E", align: "right" },
	null,
	{ id: "Fs3", sharp: "F♯", flat: "G♭", key: "T", align: "left" },
	{ id: "Gs3", sharp: "G♯", flat: "A♭", key: "Y", align: "center" },
	{ id: "As3", sharp: "A♯", flat: "B♭", key: "U", align: "right" },
	null,
];

const KEY_TO_NOTE: Record<string, NoteId> = {
	a: "C3",
	s: "D3",
	d: "E3",
	f: "F3",
	g: "G3",
	h: "A3",
	j: "B3",
	k: "C4",
	w: "Cs3",
	e: "Ds3",
	t: "Fs3",
	y: "Gs3",
	u: "As3",
};

function isTypingTarget(target: EventTarget | null) {
	if (!(target instanceof HTMLElement)) return false;
	const tag = target.tagName;
	return (
		tag === "INPUT" ||
		tag === "TEXTAREA" ||
		tag === "SELECT" ||
		target.isContentEditable
	);
}

export function InteractivePiano() {
	const [active, setActive] = useState<Set<NoteId>>(new Set());
	const activeRef = useRef(active);
	activeRef.current = active;
	const voices = useRef(new Map<NoteId, HTMLAudioElement>());
	const hostRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;
		const ids: NoteId[] = [
			"C3",
			"Cs3",
			"D3",
			"Ds3",
			"E3",
			"F3",
			"Fs3",
			"G3",
			"Gs3",
			"A3",
			"As3",
			"B3",
			"C4",
		];
		for (const id of ids) {
			const audio = new Audio(`/piano/${id}.mp3`);
			audio.preload = "auto";
			host.append(audio);
			voices.current.set(id, audio);
		}
		return () => {
			voices.current.clear();
			host.replaceChildren();
		};
	}, []);

	const press = useCallback((id: NoteId) => {
		if (activeRef.current.has(id)) return;
		setActive((prev) => {
			const next = new Set(prev);
			next.add(id);
			return next;
		});
		const audio = voices.current.get(id);
		if (!audio) return;
		audio.currentTime = 0;
		void audio.play().catch(() => {});
	}, []);

	const release = useCallback((id: NoteId) => {
		if (!activeRef.current.has(id)) return;
		setActive((prev) => {
			const next = new Set(prev);
			next.delete(id);
			return next;
		});
	}, []);

	useEffect(() => {
		const onDown = (event: KeyboardEvent) => {
			if (event.repeat || event.metaKey || event.ctrlKey || event.altKey)
				return;
			if (isTypingTarget(event.target)) return;
			const note = KEY_TO_NOTE[event.key.toLowerCase()];
			if (!note) return;
			event.preventDefault();
			press(note);
		};
		const onUp = (event: KeyboardEvent) => {
			const note = KEY_TO_NOTE[event.key.toLowerCase()];
			if (!note) return;
			release(note);
		};
		const onBlur = () => setActive(new Set());
		window.addEventListener("keydown", onDown);
		window.addEventListener("keyup", onUp);
		window.addEventListener("blur", onBlur);
		return () => {
			window.removeEventListener("keydown", onDown);
			window.removeEventListener("keyup", onUp);
			window.removeEventListener("blur", onBlur);
		};
	}, [press, release]);

	const bindKey = (id: NoteId) => ({
		onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
			event.preventDefault();
			event.currentTarget.setPointerCapture(event.pointerId);
			press(id);
		},
		onPointerUp: () => release(id),
		onPointerCancel: () => release(id),
		onLostPointerCapture: () => release(id),
	});

	return (
		<Section className="px-0">
			<h2 className="border-b border-border px-4 py-2 text-xl font-medium tracking-tight">
				InteractivePiano
			</h2>
			<div className="px-3 py-5 sm:px-4">
				<div ref={hostRef} className="sr-only" aria-hidden />
				<p className="mb-3 font-mono text-[11px] text-muted-foreground">
					<span className="text-foreground">A S D F G H J K</span>
					<span className="mx-2 text-border">·</span>
					d r m f s l t d
				</p>
				<div className="relative select-none">
					<div className="flex">
						{WHITE_KEYS.map((key, index) => {
							const pressed = active.has(key.id);
							return (
								<button
									key={key.id}
									type="button"
									aria-label={`${key.note} ${key.solfege}`}
									className={cn(
										"relative flex h-[168px] min-w-0 flex-1 flex-col items-center justify-end pb-2.5",
										"border-r border-black/25 bg-white text-neutral-800",
										"shadow-[0_5px_1px_rgba(32,32,32,0.2)] transition-[background-color,box-shadow,transform] duration-75 ease-out",
										index === 0 && "rounded-bl-[5px]",
										index === WHITE_KEYS.length - 1 &&
											"rounded-br-[5px] border-r-transparent",
										pressed
											? "translate-y-[5px] bg-[#d8d8d8] shadow-[0_1px_rgba(32,32,32,0.2)]"
											: "hover:bg-neutral-50",
									)}
									{...bindKey(key.id)}
								>
									<span className="font-mono text-[10px] font-medium text-neutral-400">
										{key.key}
									</span>
									<span className="text-[13px] font-semibold leading-none">
										{key.note}
									</span>
								</button>
							);
						})}
					</div>
					<div className="pointer-events-none absolute top-0 left-0 z-10 ml-[2.5%] flex w-[95%]">
						{BLACK_SLOTS.map((slot, index) => {
							if (!slot) {
								return (
									<div
										key={index === 2 ? "gap-ef" : "gap-bc"}
										className="min-w-0 flex-1"
									/>
								);
							}
							const pressed = active.has(slot.id);
							return (
								<div
									key={slot.id}
									className={cn(
										"flex min-w-0 flex-1",
										slot.align === "left" && "justify-start pl-0.5 -mr-0.5",
										slot.align === "right" && "justify-end pr-0.5 -ml-0.5",
										slot.align === "center" && "justify-center",
									)}
								>
									<button
										type="button"
										aria-label={`${slot.sharp} ${slot.flat}`}
										className={cn(
											"pointer-events-auto flex h-[100px] w-[80%] flex-col items-center justify-end rounded-b-[5px] pb-2",
											"bg-black text-white shadow-[0_4px_1px_rgba(0,0,0,0.35)]",
											"transition-[background-color,box-shadow,transform] duration-75 ease-out",
											pressed
												? "translate-y-[5px] bg-[#1a1a1a] shadow-[0_2px_rgba(0,0,0,0.55)]"
												: "hover:bg-neutral-900",
										)}
										{...bindKey(slot.id)}
									>
										<span className="font-mono text-[9px] font-medium text-white/55">
											{slot.key}
										</span>
										<span className="text-[11px] font-semibold leading-[1.05]">
											{slot.sharp}
											<br />
											{slot.flat}
										</span>
									</button>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</Section>
	);
}
