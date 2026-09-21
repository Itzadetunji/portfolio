"use client";

import { useEffect, useRef, useState } from "react";
import { LogoIcon } from "#/components/icons/logo-icon";
import {
	WIPE_DURATION,
	WIPE_EASING,
	WIPE_FROM_BOTTOM_TIP,
	WIPE_FROM_BOTTOM_TIP_EDGE,
} from "#/lib/wipe";

function waitForWindowLoad() {
	if (document.readyState === "complete") {
		return Promise.resolve();
	}

	return new Promise<void>((resolve) => {
		window.addEventListener("load", () => resolve(), { once: true });
	});
}

export function PageLoadWipe() {
	const fillRef = useRef<HTMLDivElement>(null);
	const edgeRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const fill = fillRef.current;
		const edge = edgeRef.current;
		if (!fill || !edge) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			void waitForWindowLoad().then(() => setVisible(false));
			return;
		}

		let cancelled = false;
		const wipes: Animation[] = [];

		const playWipe = (
			el: HTMLElement,
			frames: readonly [string, string],
		) =>
			el.animate([{ clipPath: frames[0] }, { clipPath: frames[1] }], {
				duration: WIPE_DURATION,
				easing: WIPE_EASING,
				fill: "forwards",
			});

		void waitForWindowLoad().then(() => {
			if (cancelled || !fillRef.current || !edgeRef.current) return;

			wipes.push(
				playWipe(fillRef.current, WIPE_FROM_BOTTOM_TIP),
				playWipe(edgeRef.current, WIPE_FROM_BOTTOM_TIP_EDGE),
			);

			void wipes[0]?.finished.then(() => {
				if (!cancelled) setVisible(false);
			});
		});

		return () => {
			cancelled = true;
			for (const wipe of wipes) wipe.cancel();
		};
	}, []);

	if (!visible) return null;

	return (
		<div aria-hidden className="page-load-wipe">
			<div ref={edgeRef} className="page-load-wipe-edge" />
			<div ref={fillRef} className="page-load-wipe-fill">
				<LogoIcon className="page-load-logo size-16 text-foreground sm:size-20" />
			</div>
		</div>
	);
}
