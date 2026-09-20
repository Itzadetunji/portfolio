export const SITE_URL = "https://itzadetunji.com";
export const SITE_NAME = "Adetunji";
export const SITE_TITLE = "Adetunji — Software Engineer";
export const OG_IMAGE = `${SITE_URL}/images/itzadetunji.webp`;

export const iconLinks = [
	{ rel: "icon", href: "/favicon.ico", sizes: "any" },
	{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
	{ rel: "manifest", href: "/manifest.webmanifest" },
] as const;

type SeoInput = {
	title: string;
	description: string;
	path: string;
	image?: string;
};

export function seo({
	title,
	description,
	path,
	image = OG_IMAGE,
}: SeoInput) {
	const url = `${SITE_URL}${path === "/" ? "" : path}`;
	const fullTitle = path === "/" ? title : `${title} — ${SITE_NAME}`;

	return {
		meta: [
			{ title: fullTitle },
			{ name: "description", content: description },
			{ name: "author", content: "Adetunji Adeyinka" },
			{ property: "og:title", content: fullTitle },
			{ property: "og:description", content: description },
			{ property: "og:url", content: url },
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: SITE_NAME },
			{ property: "og:image", content: image },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: fullTitle },
			{ name: "twitter:description", content: description },
			{ name: "twitter:image", content: image },
			{ name: "twitter:creator", content: "@itzadetunji" },
		],
		links: [{ rel: "canonical", href: url }],
	};
}

export function personJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Adetunji Adeyinka",
		url: SITE_URL,
		image: OG_IMAGE,
		jobTitle: "Software Engineer",
		email: "mailto:hello@itzadetunji.com",
		sameAs: [
			"https://github.com/itzadetunji",
			"https://www.linkedin.com/in/itzadetunji",
			"https://x.com/itzadetunji",
		],
	};
}
