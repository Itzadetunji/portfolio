import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { NotFoundPage } from "#/components/NotFoundPage";
import { PageLoadWipe } from "#/components/PageLoadWipe";
import { SiteChrome } from "#/components/SiteChrome";
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
	notFoundComponent: NotFoundPage,
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
					<SiteChrome>{children}</SiteChrome>
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
