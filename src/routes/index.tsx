import { createFileRoute } from "@tanstack/react-router";
import { About } from "./index/-components/About";
import { Activity } from "./index/-components/Activity";
import { Experience } from "./index/-components/Experience";
import { Hero } from "./index/-components/Hero";
import { Projects } from "./index/-components/Projects";
import { Skills } from "./index/-components/Skills";
import { Socials } from "./index/-components/Socials";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<>
			<Hero />
			<About />
			<Socials />
			<Experience />
			<Activity />
			<Projects />
			<Skills />
		</>
	);
}
