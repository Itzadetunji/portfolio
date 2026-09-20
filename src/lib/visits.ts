import { createClient, type Client } from "@libsql/client";
import { createServerFn } from "@tanstack/react-start";

let client: Client | null | undefined;
let schemaReady = false;

function getTurso() {
	if (client !== undefined) return client;

	const url = process.env.TURSO_DATABASE_URL;
	const authToken = process.env.TURSO_AUTH_TOKEN;

	if (!url || !authToken) {
		client = null;
		return client;
	}

	client = createClient({ url, authToken });
	return client;
}

async function ensureSchema(turso: Client) {
	if (schemaReady) return;

	await turso.executeMultiple(`
		CREATE TABLE IF NOT EXISTS visits (
			id INTEGER PRIMARY KEY CHECK (id = 1),
			count INTEGER NOT NULL DEFAULT 0
		);
		INSERT OR IGNORE INTO visits (id, count) VALUES (1, 0);
	`);
	schemaReady = true;
}

function readCount(value: unknown) {
	const count = Number(value);
	return Number.isFinite(count) ? count : 0;
}

export const getVisitCount = createServerFn({ method: "GET" }).handler(
	async () => {
		const turso = getTurso();
		if (!turso) return 0;

		try {
			await ensureSchema(turso);
			const result = await turso.execute(
				"SELECT count FROM visits WHERE id = 1",
			);
			return readCount(result.rows[0]?.count);
		} catch {
			return 0;
		}
	},
);

export const recordVisit = createServerFn({ method: "POST" }).handler(
	async () => {
		const turso = getTurso();
		if (!turso) return 0;

		try {
			await ensureSchema(turso);
			const result = await turso.execute(
				"UPDATE visits SET count = count + 1 WHERE id = 1 RETURNING count",
			);
			return readCount(result.rows[0]?.count);
		} catch {
			return 0;
		}
	},
);
