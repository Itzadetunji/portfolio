type Listener = () => void;

let hideSiteFooter = false;
const listeners = new Set<Listener>();

export function setHideSiteFooter(next: boolean) {
	if (hideSiteFooter === next) return;
	hideSiteFooter = next;
	for (const listener of listeners) listener();
}

export function subscribeHideSiteFooter(listener: Listener) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

export function getHideSiteFooter() {
	return hideSiteFooter;
}
