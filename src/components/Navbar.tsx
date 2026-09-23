"use client";

import {
	GithubLogoIcon,
	ListIcon,
	MoonIcon,
	SunIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ThemeRocketTransition } from "#/components/ThemeRocketTransition";
import { Button } from "#/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { withUtm } from "#/lib/utm";

const links = [
	{ to: "/projects", label: "Projects", type: "route" },
	{
		href: "mailto:hello@itzadetunji.com",
		label: "Contact",
		type: "external",
	},
] as const;

export function Navbar() {
	const [isDark, setIsDark] = useState(true);
	const [flight, setFlight] = useState<{ toDark: boolean } | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);

	function toggleTheme() {
		if (flight) return;
		setFlight({ toDark: !isDark });
	}

	function handleThemeApply() {
		if (flight) setIsDark(flight.toDark);
	}

	function handleFlightComplete() {
		setFlight(null);
	}

	const iconBtn =
		"relative inline-flex size-10 items-center justify-center text-muted-foreground hover:text-foreground";
	const navLinkClass = "text-sm text-muted-foreground hover:text-foreground";

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background">
			<nav className="mx-auto grid h-14 max-w-3xl grid-cols-[1fr_auto_auto] items-center border-x px-4 sm:grid-cols-[1fr_auto_1fr]">
				<Link
					to="/"
					className="navbar-brand font-pixelify justify-self-start text-xl tracking-tight text-foreground"
				>
					Adetunji
				</Link>

				<div className="hidden items-center gap-6 sm:flex">
					{links.map((link) =>
						link.type === "route" ? (
							<Link
								key={link.to}
								to={link.to}
								className={navLinkClass}
								activeProps={{
									className: "text-foreground",
								}}
							>
								{link.label}
							</Link>
						) : (
							<a key={link.href} href={link.href} className={navLinkClass}>
								{link.label}
							</a>
						),
					)}
				</div>

				<div className="flex items-center justify-self-end sm:col-start-3">
					<div
						className="mr-2 hidden h-4 w-px bg-border sm:block"
						aria-hidden
					/>
					<a
						href={withUtm("https://github.com/itzadetunji")}
						target="_blank"
						rel="noreferrer"
						aria-label="GitHub profile"
						className={iconBtn}
					>
						<GithubLogoIcon size={18} weight="regular" />
					</a>
					<button
						type="button"
						onClick={toggleTheme}
						disabled={!!flight}
						aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
						className={`${iconBtn} disabled:opacity-100`}
					>
						{isDark ? (
							<MoonIcon size={18} weight="regular" />
						) : (
							<SunIcon size={18} weight="regular" />
						)}
					</button>
				</div>

				<div className="sm:hidden">
					<Popover open={menuOpen} onOpenChange={setMenuOpen}>
						<PopoverTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								aria-label="Open menu"
								className="justify-self-end"
							>
								<ListIcon size={18} weight="regular" />
							</Button>
						</PopoverTrigger>
						<PopoverContent align="end" className="w-44 gap-1 rounded-xl p-2">
							{links.map((link) =>
								link.type === "route" ? (
									<Link
										key={link.to}
										to={link.to}
										onClick={() => setMenuOpen(false)}
										className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
										activeProps={{
											className: "text-foreground",
										}}
									>
										{link.label}
									</Link>
								) : (
									<a
										key={link.href}
										href={link.href}
										onClick={() => setMenuOpen(false)}
										className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
									>
										{link.label}
									</a>
								),
							)}
						</PopoverContent>
					</Popover>
				</div>
			</nav>
			<ThemeRocketTransition
				active={!!flight}
				toDark={flight?.toDark ?? !isDark}
				onApply={handleThemeApply}
				onComplete={handleFlightComplete}
			/>
		</header>
	);
}
