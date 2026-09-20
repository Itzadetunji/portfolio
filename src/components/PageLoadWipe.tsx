"use client";

import { useEffect, useRef, useState } from "react";
import { LogoIcon } from "#/components/icons/logo-icon";
import { WIPE_DURATION, WIPE_EASING, WIPE_FROM_BOTTOM_TIP } from "#/lib/wipe";

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
					{ clipPath: WIPE_FROM_BOTTOM_TIP[0] },
					{ clipPath: WIPE_FROM_BOTTOM_TIP[1] },
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
			<LogoIcon className="page-load-logo size-16 text-foreground sm:size-20" />
		</div>
	);
}
