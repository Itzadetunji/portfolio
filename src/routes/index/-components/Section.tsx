"use client";

import { cn } from "cn";
import {
	createContext,
	type ReactNode,
	useContext,
	useState,
} from "react";
import { LineSpotlightFromHook } from "#/components/LineSpotlight";
import { Button } from "#/components/ui/button";
import {
	buildStripeDividerSpotlightPath,
	useLineSpotlight,
} from "#/hooks/use-line-spotlight";

type DividerSpotlightContextValue = {
	enabled: boolean;
	setEnabled: (enabled: boolean) => void;
};

const DividerSpotlightContext = createContext<DividerSpotlightContextValue>({
	enabled: true,
	setEnabled: () => {},
});

export function StripeDividerSpotlightProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [enabled, setEnabled] = useState(true);
	return (
		<DividerSpotlightContext value={{ enabled, setEnabled }}>
			{children}
		</DividerSpotlightContext>
	);
}

export function StripeDivider({
	showToggle = false,
}: {
	showToggle?: boolean;
} = {}) {
	const { enabled, setEnabled } = useContext(DividerSpotlightContext);
	const spotlight = useLineSpotlight({
		enabled,
		buildPath: buildStripeDividerSpotlightPath,
		expandX: true,
	});

	return (
		<div
			ref={spotlight.rootRef}
			{...(!showToggle ? { "aria-hidden": true as const } : {})}
			className="stripe-divider relative mx-auto h-(--separator-height) w-full max-w-3xl border-x"
		>
			<LineSpotlightFromHook
				{...spotlight}
				className="z-10"
				title="Stripe divider line spotlight"
			/>
			{showToggle ? (
				<div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
					<Button
						type="button"
						variant="outline"
						size="xs"
						aria-pressed={enabled}
						aria-label={
							enabled ? "Disable line spotlight" : "Enable line spotlight"
						}
						className="pointer-events-auto bg-background/80 backdrop-blur-sm"
						onClick={() => setEnabled(!enabled)}
					>
						Spotlight {enabled ? "on" : "off"}
					</Button>
				</div>
			) : null}
		</div>
	);
}

export function Section({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<section
			className={cn("mx-auto w-full max-w-3xl border-x px-4", className)}
		>
			{children}
		</section>
	);
}
