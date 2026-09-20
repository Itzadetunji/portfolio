import { createFileRoute } from "@tanstack/react-router";
import { personJsonLd, seo, SITE_TITLE } from "#/lib/seo";
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
	head: () => ({
		...seo({
			title: SITE_TITLE,
			description:
				"Adetunji is a software engineer who builds products end to end with React, TypeScript and Node — from data and APIs through to the interface.",
			path: "/",
		}),
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify(personJsonLd()),
			},
		],
	}),
	component: Home,
});

function Home() {
	return (
		<>
			<InteractivePiano />
			<StripeDivider />
			<Hero />
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
