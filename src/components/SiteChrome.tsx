"use client";

import { ReactLenis } from "lenis/react";
import { type ReactNode, useSyncExternalStore } from "react";
import { Footer } from "#/components/Footer";
import { Navbar } from "#/components/Navbar";
import {
	getHideSiteFooter,
	subscribeHideSiteFooter,
} from "#/lib/site-chrome";

export function SiteChrome({ children }: { children: ReactNode }) {
	const hideFooter = useSyncExternalStore(
		subscribeHideSiteFooter,
		getHideSiteFooter,
		() => false,
	);

	return (
		<ReactLenis
			root
			options={{
				lerp: 0.1,
				duration: 1.5,
				smoothWheel: true,
				anchors: true,
			}}
			className="flex min-h-dvh flex-col"
		>
			<Navbar />
			<main className="flex min-h-0 flex-1 flex-col">{children}</main>
			{hideFooter ? null : <Footer />}
		</ReactLenis>
	);
}
