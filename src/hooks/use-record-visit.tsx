"use client";

import { useCounter, useGetCounts } from "@itzadetunji/counter";
import { createContext, useContext, type ReactNode } from "react";

const COUNTER_APP_ID = "4dd5-c102";

const VisitsContext = createContext(0);

export function VisitProvider({ children }: { children: ReactNode }) {
	useCounter({
		appId: COUNTER_APP_ID,
		singleVisit: true,
		enabled: import.meta.env.PROD,
	});
	const { data } = useGetCounts({ appId: COUNTER_APP_ID });

	return (
		<VisitsContext value={data?.totalVisits ?? 0}>{children}</VisitsContext>
	);
}

export function useVisitCount() {
	return useContext(VisitsContext);
}
