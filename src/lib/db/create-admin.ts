// Creates (or updates the password for) an admin user.
// Usage: npm run create-admin -- "name@example.com" "a strong password" "Full Name" [OWNER|STAFF]
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { adminUsers } from "./schema";

async function main() {
  const [email, password, name, role] = process.argv.slice(2);

  if (!email || !password || !name) {
    console.error(
      'Usage: npm run create-admin -- "email@example.com" "password" "Full Name" [OWNER|STAFF]',
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const resolvedRole = role === "STAFF" ? "STAFF" : "OWNER";

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  const passwordHash = await bcrypt.hash(password, 12);
  const normalizedEmail = email.trim().toLowerCase();

  const [existing] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, normalizedEmail))
    .limit(1);

  if (existing) {
    await db
      .update(adminUsers)
      .set({ passwordHash, name, role: resolvedRole, updatedAt: new Date() })
      .where(eq(adminUsers.id, existing.id));
    console.log(`Updated existing admin: ${normalizedEmail}`);
  } else {
    await db.insert(adminUsers).values({
      email: normalizedEmail,
      passwordHash,
      name,
      role: resolvedRole,
    });
    console.log(`Created admin: ${normalizedEmail} (${resolvedRole})`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
