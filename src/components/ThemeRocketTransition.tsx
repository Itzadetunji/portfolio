"use client";

import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { WIPE_DURATION, WIPE_EASING, WIPE_FROM_TOP_RIGHT } from "#/lib/wipe";

type ThemeRocketTransitionProps = {
	active: boolean;
	toDark: boolean;
	onApply: () => void;
	onComplete: () => void;
};

export function ThemeRocketTransition({
	active,
	toDark,
	onApply,
	onComplete,
}: ThemeRocketTransitionProps) {
	const onApplyRef = useRef(onApply);
	const onCompleteRef = useRef(onComplete);
	onApplyRef.current = onApply;
	onCompleteRef.current = onComplete;

	useEffect(() => {
		if (!active) return;

		let cancelled = false;
		let clipAnim: Animation | undefined;
		let viewTransition: ViewTransition | undefined;

		const run = async () => {
			const applyTheme = () => {
				document.documentElement.classList.toggle("dark", toDark);
				onApplyRef.current();
			};

			if (
				window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
				typeof document.startViewTransition !== "function"
			) {
				flushSync(applyTheme);
				onCompleteRef.current();
				return;
			}

			document.documentElement.classList.add("theme-wiping");

			viewTransition = document.startViewTransition(() => {
				flushSync(applyTheme);
			});

			try {
				await viewTransition.ready;
				if (cancelled) return;

				clipAnim = document.documentElement.animate(
					[
						{ clipPath: WIPE_FROM_TOP_RIGHT[0] },
						{ clipPath: WIPE_FROM_TOP_RIGHT[1] },
					],
					{
						duration: WIPE_DURATION,
						easing: WIPE_EASING,
						fill: "none",
						pseudoElement: "::view-transition-new(root)",
					},
				);

				await Promise.all([
					clipAnim.finished.catch(() => undefined),
					viewTransition.finished.catch(() => undefined),
				]);
			} finally {
				document.documentElement.classList.remove("theme-wiping");
			}

			if (!cancelled) onCompleteRef.current();
		};

		void run();

		return () => {
			cancelled = true;
			clipAnim?.cancel();
			viewTransition?.skipTransition();
		};
	}, [active, toDark]);

	return null;
}
