"use client";

import { useEffect, useRef, useState } from "react";
import { WIPE_DURATION, WIPE_EASING, WIPE_FROM_TOP_RIGHT } from "#/lib/wipe";

export function PageLoadWipe() {
	const overlayRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const overlay = overlayRef.current;
		if (!overlay) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setVisible(false);
			return;
		}

		const animation = overlay.animate(
			[
				{ clipPath: WIPE_FROM_TOP_RIGHT[1] },
				{ clipPath: WIPE_FROM_TOP_RIGHT[0] },
			],
			{
				duration: WIPE_DURATION,
				easing: WIPE_EASING,
				fill: "forwards",
			},
		);

		void animation.finished.then(() => {
			setVisible(false);
		});

		return () => {
			animation.cancel();
		};
	}, []);

	if (!visible) return null;

	return (
		<div
			ref={overlayRef}
			aria-hidden
			className="fixed inset-0 z-[300] bg-background"
			style={{ clipPath: WIPE_FROM_TOP_RIGHT[1] }}
		/>
	);
}
