const UTM_SOURCE = "itzadetunji.com";

export function withUtm(url: string) {
	const parsed = new URL(url);
	parsed.searchParams.set("utm_source", UTM_SOURCE);
	return parsed.toString();
}
