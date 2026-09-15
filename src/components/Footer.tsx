import { Link } from "@tanstack/react-router";

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<>
			<div
				aria-hidden
				className="stripe-divider mx-auto h-(--separator-height) w-full max-w-3xl border-x"
			/>
			<footer className="mx-auto w-full max-w-3xl border-x border-b px-4 py-8 text-center text-sm text-muted-foreground">
				<p>
					Designed and developed by{" "}
					<Link
						to="/"
						className="font-medium text-foreground underline decoration-foreground underline-offset-[3px] transition-colors hover:text-primary"
					>
						Adetunji
					</Link>
				</p>
				<p className="mt-1">© {year}. Built in the open.</p>
			</footer>
		</>
	);
}
