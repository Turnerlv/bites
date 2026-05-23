/**
 * Simulates an idempotent webhook receiver.
 * @param {string} idempotencyKey - Unique event identifier
 * @param {Set} db - Our mock database instance
 * @param {Function} log - Callback function to stream logs back to the UI
 */
export async function processWebhook(idempotencyKey, db, log) {
    console.log(`→ Network: Webhook arrived with key [${idempotencyKey}]`);

    // Simulated network latency
    await new Promise(resolve => setTimeout(resolve, 600));

    console.log(`⚙ DB: Checking if key [${idempotencyKey}] already exists...`);

    if (db.has(idempotencyKey)) {
        console.log(`⚠ SYSTEM GUARD: Duplicate key detected. Safely ignoring payload to prevent duplicate side-effects.`);
        return { status: 200, body: "Duplicate event handled gracefully." };
    }

    console.log(`⚙ Core: Executing transaction business logic (e.g., provisioning account)...`);
    await new Promise(resolve => setTimeout(resolve, 400));

    // Commit to DB
    db.add(idempotencyKey);
    console.log(`✓ DB: Key [${idempotencyKey}] successfully written to unique index constraints.`);

    return { status: 201, body: "Webhook processed successfully." };
}