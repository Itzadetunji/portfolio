import { cn } from "cn";
import type { ReactNode } from "react";

export function Section({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<section
			className={cn("mx-auto w-full max-w-3xl px-4 border-x", className)}
		>
			{children}
		</section>
	);
}
