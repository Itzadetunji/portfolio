import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { getVisitCount, recordVisit } from "#/lib/visits";
import { About } from "./index/-components/About";
import { Activity } from "./index/-components/Activity";
import { Experience } from "./index/-components/Experience";
import { Hero } from "./index/-components/Hero";
import { InteractivePiano } from "./index/-components/InteractivePiano";
import { Projects } from "./index/-components/Projects";
import { Quote } from "./index/-components/Quote";
import { StripeDivider } from "./index/-components/Section";
import { Skills } from "./index/-components/Skills";
import { Socials } from "./index/-components/Socials";

export const Route = createFileRoute("/")({
	loader: async ({ cause }) => {
		const visits =
			cause === "preload" ? await getVisitCount() : await recordVisit();
		return { visits };
	},
	component: Home,
});

const homeRoute = getRouteApi("/");

function Home() {
	const { visits } = homeRoute.useLoaderData();

	return (
		<>
			<InteractivePiano />
			<StripeDivider />
			<Hero visits={visits} />
			<StripeDivider />
			<About />
			<StripeDivider />
			<Socials />
			<StripeDivider />
			<Experience />
			<StripeDivider />
			<Activity />
			<StripeDivider />
			<Projects />
			<StripeDivider />
			<Skills />
			<StripeDivider />
			<Quote />
		</>
	);
}
