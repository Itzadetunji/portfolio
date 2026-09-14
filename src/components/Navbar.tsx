"use client";

import { GithubLogoIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

const links = [
	{ to: "/projects", label: "Projects" },
	{ to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
	const [isDark, setIsDark] = useState(true);

	function toggleTheme() {
		const next = !isDark;
		setIsDark(next);
		document.documentElement.classList.toggle("dark", next);
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background">
			<nav className="mx-auto grid h-14 max-w-5xl grid-cols-[1fr_auto_1fr] items-center px-4">
				<Link
					to="/"
					className="font-pixelify justify-self-start text-xl tracking-tight text-foreground"
				>
					Adetunji
				</Link>

				<div className="flex items-center gap-6">
					{links.map((link) => (
						<Link
							key={link.to}
							to={link.to}
							className="text-sm text-muted-foreground hover:text-foreground"
							activeProps={{
								className: "text-foreground",
							}}
						>
							{link.label}
						</Link>
					))}
				</div>

				<div className="flex items-center justify-self-end">
					<div className="mr-2 h-4 w-px bg-border" aria-hidden />
					<a
						href="https://github.com/itzadetunji"
						target="_blank"
						rel="noreferrer"
						aria-label="GitHub profile"
						className="relative inline-flex size-10 items-center justify-center text-muted-foreground hover:text-foreground"
					>
						<GithubLogoIcon className="size-4.5" weight="regular" />
					</a>
					<button
						type="button"
						onClick={toggleTheme}
						aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
						className="relative inline-flex size-10 items-center justify-center text-muted-foreground hover:text-foreground"
					>
						{isDark ? (
							<MoonIcon className="size-4.5" weight="regular" />
						) : (
							<SunIcon className="size-4.5" weight="regular" />
						)}
					</button>
				</div>
			</nav>
		</header>
	);
}
