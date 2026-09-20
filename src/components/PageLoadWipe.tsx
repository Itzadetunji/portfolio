"use client";

import { useEffect, useRef, useState } from "react";
import { WIPE_DURATION, WIPE_EASING, WIPE_FROM_TOP_LEFT } from "#/lib/wipe";

const LINE_COUNT = 220;
const lineIndexes = Array.from({ length: LINE_COUNT }, (_, index) => index);

function waitForWindowLoad() {
	if (document.readyState === "complete") {
		return Promise.resolve();
	}

	return new Promise<void>((resolve) => {
		window.addEventListener("load", () => resolve(), { once: true });
	});
}

export function PageLoadWipe() {
	const overlayRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const overlay = overlayRef.current;
		if (!overlay) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			void waitForWindowLoad().then(() => setVisible(false));
			return;
		}

		let cancelled = false;
		let wipe: Animation | undefined;

		void waitForWindowLoad().then(() => {
			if (cancelled || !overlayRef.current) return;

			wipe = overlayRef.current.animate(
				[
					{ clipPath: WIPE_FROM_TOP_LEFT[1] },
					{ clipPath: WIPE_FROM_TOP_LEFT[0] },
				],
				{
					duration: WIPE_DURATION,
					easing: WIPE_EASING,
					fill: "forwards",
				},
			);

			void wipe.finished.then(() => {
				if (!cancelled) setVisible(false);
			});
		});

		return () => {
			cancelled = true;
			wipe?.cancel();
		};
	}, []);

	if (!visible) return null;

	return (
		<div ref={overlayRef} aria-hidden className="page-load-wipe">
			<div
				className="page-load-stripes"
				style={{ ["--n" as string]: LINE_COUNT }}
			>
				{lineIndexes.map((index) => (
					<span
						key={index}
						className="page-load-line"
						style={{ ["--i" as string]: index }}
					/>
				))}
			</div>
		</div>
	);
}
