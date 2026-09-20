import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ReactLenis } from "lenis/react";

import { Footer } from "#/components/Footer";
import { Navbar } from "#/components/Navbar";
import { PageLoadWipe } from "#/components/PageLoadWipe";
import { VisitProvider } from "#/hooks/use-record-visit";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";
import "lenis/dist/lenis.css";

import type { QueryClient } from "@tanstack/react-query";
import { iconLinks, SITE_NAME } from "#/lib/seo";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: SITE_NAME,
			},
			{
				name: "theme-color",
				content: "#0a0a0a",
				media: "(prefers-color-scheme: dark)",
			},
			{
				name: "theme-color",
				content: "#ffffff",
				media: "(prefers-color-scheme: light)",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			...iconLinks,
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				<style
					dangerouslySetInnerHTML={{
						__html:
							"html{background-color:oklch(1 0 0);color-scheme:light}html.dark,html.dark body{background-color:oklch(0.145 0 0);color-scheme:dark}",
					}}
				/>
				<HeadContent />
			</head>
			<body className="flex min-h-dvh flex-col antialiased">
				<PageLoadWipe />
				<VisitProvider>
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
						<Footer />
					</ReactLenis>
				</VisitProvider>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
