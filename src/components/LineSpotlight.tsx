"use client";

import { cn } from "cn";
import type { RefObject } from "react";
import {
	LINE_SPOTLIGHT_RADIUS,
	type UseLineSpotlightResult,
} from "#/hooks/use-line-spotlight";

type LineSpotlightOverlayProps = {
	pathRef: RefObject<SVGPathElement | null>;
	gradientRef: RefObject<SVGRadialGradientElement | null>;
	gradientId: string;
	radius?: number;
	className?: string;
	title?: string;
};

export function LineSpotlightOverlay({
	pathRef,
	gradientRef,
	gradientId,
	radius = LINE_SPOTLIGHT_RADIUS,
	className,
	title = "Line spotlight",
}: LineSpotlightOverlayProps) {
	return (
		<svg
			aria-hidden="true"
			focusable="false"
			className={cn(
				"pointer-events-none absolute inset-0 z-30 size-full overflow-visible",
				className,
			)}
		>
			<title>{title}</title>
			<defs>
				<radialGradient
					ref={gradientRef}
					id={gradientId}
					cx="-9999"
					cy="-9999"
					r={radius}
					gradientUnits="userSpaceOnUse"
				>
					<stop
						className="dark:[stop-color:#fff]"
						stopColor="var(--foreground)"
						stopOpacity="0.85"
					/>
					<stop offset="1" stopColor="var(--foreground)" stopOpacity="0" />
				</radialGradient>
			</defs>
			<path
				ref={pathRef}
				fill="none"
				stroke={`url(#${gradientId})`}
				strokeWidth={1}
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	);
}

export function LineSpotlightFromHook({
	pathRef,
	gradientRef,
	gradientId,
	radius,
	enabled,
	className,
	title,
}: Pick<
	UseLineSpotlightResult,
	"pathRef" | "gradientRef" | "gradientId" | "radius" | "enabled"
> & {
	className?: string;
	title?: string;
}) {
	return (
		<LineSpotlightOverlay
			pathRef={pathRef}
			gradientRef={gradientRef}
			gradientId={gradientId}
			radius={radius}
			className={cn(!enabled && "invisible", className)}
			title={title}
		/>
	);
}
