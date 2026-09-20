export const WIPE_DURATION = 1200;
export const WIPE_EASING = "cubic-bezier(0.45, 0, 0.2, 1)";

export const WIPE_FROM_TOP_RIGHT = [
	"polygon(100% 0%, 100% 0%, 100% 0%)",
	"polygon(100% 0%, -180% 0%, 100% 280%)",
] as const;

export const WIPE_FROM_TOP_LEFT = [
	"polygon(0% 0%, 0% 0%, 0% 0%)",
	"polygon(0% 0%, 280% 0%, 0% 280%)",
] as const;

export const WIPE_FROM_BOTTOM_LEFT = [
	"polygon(0% 100%, 0% 100%, 0% 100%)",
	"polygon(0% 100%, 280% 100%, 0% -180%)",
] as const;
