"use client";

import { MusicNotesIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import {
	type PointerEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { LineSpotlightFromHook } from "#/components/LineSpotlight";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
	buildPianoSpotlightPath,
	useLineSpotlight,
} from "#/hooks/use-line-spotlight";
import songBook from "../-data/piano-songs.json";
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

const NOTE_IDS: NoteId[] = [
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

const SONGS = songBook.songs;

type SongNote = (typeof SONGS)[number]["notes"][number];

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
	const [songId, setSongId] = useState(SONGS[0]?.id ?? "");
	const [isPlaying, setIsPlaying] = useState(false);
	const [spotlightEnabled, setSpotlightEnabled] = useState(true);
	const activeRef = useRef(active);
	activeRef.current = active;
	const isPlayingRef = useRef(false);
	isPlayingRef.current = isPlaying;
	const manualHoldRef = useRef(new Set<NoteId>());
	const voices = useRef(new Map<NoteId, HTMLAudioElement>());
	const hostRef = useRef<HTMLDivElement>(null);
	const spotlight = useLineSpotlight({
		enabled: spotlightEnabled,
		buildPath: buildPianoSpotlightPath,
	});

	const ensureVoice = useCallback((id: NoteId) => {
		let audio = voices.current.get(id);
		if (audio) return audio;
		audio = new Audio(`/piano/${id}.mp3`);
		audio.preload = "auto";
		hostRef.current?.append(audio);
		voices.current.set(id, audio);
		return audio;
	}, []);

	const warmVoices = useCallback(() => {
		for (const id of NOTE_IDS) ensureVoice(id);
	}, [ensureVoice]);

	useEffect(() => {
		let idleId = 0;
		let timeoutId = 0;
		let cancelled = false;

		const warm = () => {
			if (!cancelled) warmVoices();
		};

		const schedule = () => {
			if (typeof window.requestIdleCallback === "function") {
				idleId = window.requestIdleCallback(warm, { timeout: 5000 });
				return;
			}
			timeoutId = window.setTimeout(warm, 2000);
		};

		if (document.readyState === "complete") {
			schedule();
		} else {
			window.addEventListener("load", schedule, { once: true });
		}

		return () => {
			cancelled = true;
			window.removeEventListener("load", schedule);
			if (idleId) window.cancelIdleCallback(idleId);
			if (timeoutId) window.clearTimeout(timeoutId);
			voices.current.clear();
			hostRef.current?.replaceChildren();
		};
	}, [warmVoices]);

	const press = useCallback(
		(id: NoteId) => {
			if (activeRef.current.has(id)) return;
			const next = new Set(activeRef.current);
			next.add(id);
			activeRef.current = next;
			setActive(next);
			const audio = ensureVoice(id);
			audio.currentTime = 0;
			void audio.play().catch(() => {});
		},
		[ensureVoice],
	);

	const release = useCallback((id: NoteId) => {
		if (!activeRef.current.has(id)) return;
		const next = new Set(activeRef.current);
		next.delete(id);
		activeRef.current = next;
		setActive(next);
	}, []);

	const stopAutoplay = useCallback(() => {
		if (!isPlayingRef.current) return;
		isPlayingRef.current = false;
		setIsPlaying(false);
	}, []);

	useEffect(() => {
		const onDown = (event: KeyboardEvent) => {
			if (event.repeat || event.metaKey || event.ctrlKey || event.altKey)
				return;
			if (isTypingTarget(event.target)) return;
			const note = KEY_TO_NOTE[event.key.toLowerCase()];
			if (!note) return;
			event.preventDefault();
			stopAutoplay();
			manualHoldRef.current.add(note);
			press(note);
		};
		const onUp = (event: KeyboardEvent) => {
			const note = KEY_TO_NOTE[event.key.toLowerCase()];
			if (!note) return;
			manualHoldRef.current.delete(note);
			release(note);
		};
		const onBlur = () => {
			if (isPlaying) return;
			activeRef.current = new Set();
			setActive(new Set());
		};
		window.addEventListener("keydown", onDown);
		window.addEventListener("keyup", onUp);
		window.addEventListener("blur", onBlur);
		return () => {
			window.removeEventListener("keydown", onDown);
			window.removeEventListener("keyup", onUp);
			window.removeEventListener("blur", onBlur);
		};
	}, [press, release, isPlaying, stopAutoplay]);

	useEffect(() => {
		if (!isPlaying) return;
		warmVoices();
		const song = SONGS.find((entry) => entry.id === songId);
		if (!song) return;

		let index = 0;
		let timeout = 0;
		let held: NoteId | null = null;
		let cancelled = false;
		const beatMs = 60000 / song.bpm;

		const releaseHeld = () => {
			if (!held) return;
			release(held);
			held = null;
		};

		const playStep = () => {
			if (cancelled) return;
			const event = song.notes[index] as SongNote;
			index = (index + 1) % song.notes.length;
			const duration = Math.max(30, event.beats * beatMs);

			if (event.key) {
				const note = KEY_TO_NOTE[event.key.toLowerCase()];
				if (note) {
					press(note);
					held = note;
					const sustain = Math.min(
						duration - 20,
						Math.max(36, duration * 0.68),
					);
					timeout = window.setTimeout(() => {
						releaseHeld();
						timeout = window.setTimeout(
							playStep,
							Math.max(20, duration - sustain),
						);
					}, sustain);
					return;
				}
			}

			timeout = window.setTimeout(playStep, duration);
		};

		playStep();
		return () => {
			cancelled = true;
			window.clearTimeout(timeout);
			if (held && !manualHoldRef.current.has(held)) {
				release(held);
			}
		};
	}, [isPlaying, songId, press, release, warmVoices]);

	const bindKey = (id: NoteId) => ({
		onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
			event.preventDefault();
			event.currentTarget.setPointerCapture(event.pointerId);
			stopAutoplay();
			manualHoldRef.current.add(id);
			press(id);
		},
		onPointerUp: () => {
			manualHoldRef.current.delete(id);
			release(id);
		},
		onPointerCancel: () => {
			manualHoldRef.current.delete(id);
			release(id);
		},
		onLostPointerCapture: () => {
			manualHoldRef.current.delete(id);
			release(id);
		},
	});

	return (
		<Section className="px-0">
			<div className="px-3 sm:py-5 sm:px-4">
				<div ref={hostRef} className="sr-only" aria-hidden />
				<div className="relative mb-1.5 select-none">
					<div className="absolute top-2 sm:left-2 z-20">
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								<Button
									type="button"
									variant="outline"
									size="icon-sm"
									aria-label="Piano controls"
									className="bg-background/80 backdrop-blur-sm"
								>
									<MusicNotesIcon weight="regular" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-56 min-w-56">
								<DropdownMenuItem
									onSelect={() =>
										setIsPlaying((playing) => {
											isPlayingRef.current = !playing;
											return !playing;
										})
									}
								>
									{isPlaying ? (
										<PauseIcon weight="fill" />
									) : (
										<PlayIcon weight="fill" />
									)}
									{isPlaying ? "Pause" : "Play"}
								</DropdownMenuItem>
								<DropdownMenuCheckboxItem
									checked={spotlightEnabled}
									onCheckedChange={(checked) =>
										setSpotlightEnabled(checked === true)
									}
								>
									Line spotlight
								</DropdownMenuCheckboxItem>
								<DropdownMenuSeparator />
								<DropdownMenuLabel>Songs</DropdownMenuLabel>
								<DropdownMenuRadioGroup
									value={songId}
									onValueChange={setSongId}
								>
									{SONGS.map((song) => (
										<DropdownMenuRadioItem key={song.id} value={song.id}>
											{song.title}
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<p className="flex min-h-24 items-center justify-center py-10 text-center text-[15px] text-muted-foreground min-[480px]:hidden">
						Check me on desktop for a surprise
					</p>
					<div
						ref={spotlight.rootRef}
						className="relative hidden min-[480px]:block"
					>
						<LineSpotlightFromHook
							{...spotlight}
							title="Piano line spotlight"
						/>
						<div
							data-piano-whites
							className="flex border-y border-l border-border"
						>
							{WHITE_KEYS.map((key) => {
								const pressed = active.has(key.id);
								return (
									<button
										key={key.id}
										type="button"
										data-piano-white
										aria-label={`${key.note} ${key.solfege}`}
										className={cn(
											"relative z-0 flex h-56.75 min-w-0 flex-1 flex-col items-center justify-end pb-2.5",
											"border-r border-border bg-transparent text-foreground",
											"transition-[transform,background-color] duration-75 ease-out",
											pressed
												? "z-1 translate-y-1.25 bg-foreground/8"
												: "hover:bg-foreground/4",
										)}
										{...bindKey(key.id)}
									>
										<span className="pointer-events-none absolute inset-x-0 top-40.75 font-mono text-[10px] font-medium text-muted-foreground">
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
											data-piano-black
											aria-label={`${slot.sharp} ${slot.flat}`}
											className={cn(
												"pointer-events-auto relative flex h-33.75 w-[80%] flex-col items-center justify-end rounded-b-[5px] pb-2",
												"border border-border bg-background text-foreground diagonal-stripes",
												"after:pointer-events-none after:absolute after:-inset-x-px after:top-full after:h-1.5 after:rounded-b-[5px] after:border after:border-t-0 after:border-border after:diagonal-stripes",
												"transition-[transform,background-color] duration-75 ease-out",
												pressed
													? "translate-y-1.25 bg-muted after:h-px"
													: "hover:bg-muted/80",
											)}
											{...bindKey(slot.id)}
										>
											<span className="font-mono text-[9px] font-medium text-muted-foreground">
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
			</div>
		</Section>
	);
}
