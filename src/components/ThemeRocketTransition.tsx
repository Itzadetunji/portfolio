"use client";

import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";

const DURATION = 1200;
const EASING = "cubic-bezier(0.45, 0, 0.2, 1)";

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
						{ clipPath: "polygon(100% 0%, 100% 0%, 100% 0%)" },
						{ clipPath: "polygon(100% 0%, -180% 0%, 100% 280%)" },
					],
					{
						duration: DURATION,
						easing: EASING,
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
