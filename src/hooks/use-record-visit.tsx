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

let hasRecordedVisit = false;

export function useRecordVisit() {
	const [visits, setVisits] = useState(0);

	useEffect(() => {
		if (hasRecordedVisit) {
			void getVisitCount().then(setVisits);
			return;
		}

		hasRecordedVisit = true;
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
