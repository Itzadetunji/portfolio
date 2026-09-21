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

export const WIPE_FROM_BOTTOM_TIP = [
	"polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)",
	"polygon(0% 0%, 100% 0%, 220% 130%, 50% -90%, -120% 130%)",
] as const;

/** Same cut as the fill, but a few pixels smaller so a stroke shows along the V. */
export const WIPE_FROM_BOTTOM_TIP_EDGE = [
	"polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)",
	"polygon(0% 0%, 100% 0%, calc(220% - 10px) calc(130% - 6px), 50% calc(-90% + 8px), calc(-120% + 10px) calc(130% - 6px))",
] as const;
