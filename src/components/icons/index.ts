import type { ComponentType, SVGProps } from "react";
import { NextjsIcon } from "./nextjs-icon";
import { PdfLibIcon } from "./pdf-lib-icon";
import { ReactIcon } from "./react-icon";
import { TailwindIcon } from "./tailwind-icon";
import { TypeScriptIcon } from "./typescript-icon";
import { ViteIcon } from "./vite-icon";

export { LogoIcon } from "./logo-icon";
export { NextjsIcon } from "./nextjs-icon";
export { PdfLibIcon } from "./pdf-lib-icon";
export { ReactIcon } from "./react-icon";
export { TailwindIcon } from "./tailwind-icon";
export { TypeScriptIcon } from "./typescript-icon";
export { ViteIcon } from "./vite-icon";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export type TechId =
	| "typescript"
	| "react"
	| "vite"
	| "tailwind"
	| "nextjs"
	| "pdflib";

export const TECH: Record<
	TechId,
	{
		label: string;
		icon: Icon;
		color: string;
		darkColor?: string;
	}
> = {
	typescript: {
		label: "TypeScript",
		icon: TypeScriptIcon,
		color: "#3178C6",
	},
	react: {
		label: "React",
		icon: ReactIcon,
		color: "#61DAFB",
	},
	vite: {
		label: "Vite",
		icon: ViteIcon,
		color: "#9135FF",
	},
	tailwind: {
		label: "TailwindCSS",
		icon: TailwindIcon,
		color: "#06B6D4",
	},
	nextjs: {
		label: "Next.js",
		icon: NextjsIcon,
		color: "#000000",
		darkColor: "#E1E3E5",
	},
	pdflib: {
		label: "pdf-lib",
		icon: PdfLibIcon,
		color: "currentColor",
	},
};
