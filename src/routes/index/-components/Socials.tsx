import {
	EnvelopeSimpleIcon,
	FileTextIcon,
	GithubLogoIcon,
	LinkedinLogoIcon,
	PaperPlaneTiltIcon,
	TwitterLogoIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import type { ComponentProps, ReactNode } from "react";
import { withUtm } from "#/lib/utm";
import { Section } from "./Section";

const btn =
	"inline-flex h-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/50 text-foreground/85 transition-colors hover:bg-muted hover:text-foreground";

function SocialButton({
	className,
	children,
	...props
}: ComponentProps<"a"> & { children: ReactNode }) {
	return (
		<a {...props} className={cn(btn, className)}>
			{children}
		</a>
	);
}

export function Socials() {
	return (
		<Section className="px-0">
			<h2 className="border-b border-border px-4 py-2 text-xl font-medium tracking-tight">
				Socials
			</h2>
			<div className="flex flex-wrap items-center gap-2.5 px-4 py-4">
				<SocialButton href="/resume.pdf" className="gap-2 px-2.5 py-1.5 h-fit">
					<FileTextIcon size={16} weight="regular" />
					<p className="text-sm">Resume</p>
				</SocialButton>
				<SocialButton
					href={withUtm("https://github.com/itzadetunji")}
					target="_blank"
					rel="noreferrer"
					aria-label="GitHub"
					className="size-8 rounded-md"
				>
					<GithubLogoIcon size={16} weight="regular" />
				</SocialButton>
				<SocialButton
					href={withUtm("https://www.linkedin.com/in/itzadetunji")}
					target="_blank"
					rel="noreferrer"
					aria-label="LinkedIn"
					className="size-8 rounded-md"
				>
					<LinkedinLogoIcon size={16} weight="regular" />
				</SocialButton>
				<SocialButton
					href={withUtm("https://x.com/itzadetunji")}
					target="_blank"
					rel="noreferrer"
					aria-label="X"
					className="size-8 rounded-md"
				>
					<TwitterLogoIcon size={16} weight="fill" />
				</SocialButton>
				<SocialButton
					href="mailto:hello@itzadetunji.com"
					className="gap-2 px-2.5 py-1.5 h-fit"
				>
					<EnvelopeSimpleIcon size={16} weight="regular" />
					<p className="text-sm">Email</p>
				</SocialButton>
			</div>
		</Section>
	);
}
