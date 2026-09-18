"use client";

import { cn } from "cn";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function EntryReveal({
	children,
	delayMs = 0,
}: {
	children: ReactNode;
	delayMs?: number;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [entered, setEntered] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setEntered(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				setEntered(entry.isIntersecting);
			},
			{ threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className={cn(
				entered ? "blur-none" : "blur-[10px]",
				"motion-reduce:blur-none motion-reduce:transition-none",
			)}
			style={{
				transitionProperty: "filter",
				transitionDuration: "700ms",
				transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
				transitionDelay: entered ? `${delayMs}ms` : "0ms",
			}}
		>
			{children}
		</div>
	);
}
