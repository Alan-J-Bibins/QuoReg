import { createClient } from "@libsql/client";

export const turso = createClient({
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function initializeDatabase(): Promise<void> {
    try {
        await turso.execute(`
            CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            author TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ); 
        `);
    } catch (error) {
        throw new Error(`Database initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function getRandomQuote(): Promise<Quote | null> {
    try {
        const result = await turso.execute("SELECT * FROM quotes ORDER BY RANDOM() LIMIT 1;");
        if (result.rows.length > 0) {
            const { id, author, text } = result.rows[0];
            return { id, text, author } as Quote;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error(`Database initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function newQuote(newQuoteText: string, newQuoteAuthor: string) {
    try {
        await turso.execute({
            sql: "INSERT INTO quotes (text, author) VALUES (?, ?)",
            args: [newQuoteText, newQuoteAuthor]
        })
        console.log("YO BRO")
    } catch (error) {
        throw new Error(`Database initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}
