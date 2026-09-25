"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { getVisitCount, recordVisit } from "#/lib/visits";

const VisitsContext = createContext(0);

const VISIT_RECORDED_KEY = "itzadetunji:visit-recorded";

/** In-memory guard for React Strict Mode double-mount in the same load. */
let hasRecordedVisit = false;

function hasRecordedInBrowser() {
	try {
		return localStorage.getItem(VISIT_RECORDED_KEY) === "1";
	} catch {
		return false;
	}
}

function markRecordedInBrowser() {
	try {
		localStorage.setItem(VISIT_RECORDED_KEY, "1");
	} catch {
		// Private mode / blocked storage — in-memory guard still applies this load.
	}
}

export function useRecordVisit() {
	const [visits, setVisits] = useState(0);

	useEffect(() => {
		if (hasRecordedVisit || hasRecordedInBrowser()) {
			void getVisitCount().then(setVisits);
			return;
		}

		hasRecordedVisit = true;
		markRecordedInBrowser();
		void recordVisit().then(setVisits);
	}, []);

	return visits;
}

export function VisitProvider({ children }: { children: ReactNode }) {
	const visits = useRecordVisit();

	return <VisitsContext value={visits}>{children}</VisitsContext>;
}

export function useVisitCount() {
	return useContext(VisitsContext);
}
