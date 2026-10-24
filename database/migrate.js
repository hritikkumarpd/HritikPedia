import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, transaction, exec, getDb } from '../packages/shared/src/db.js';
import { hashPassword } from '../packages/shared/src/auth.js';
import { ROLES } from '../packages/shared/src/permissions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log('=====================================================');
  console.log('⚡ HRITIKPEDIA DATABASE MIGRATION ENGINE');
  console.log('=====================================================');

  await getDb();

  // 1. Ensure migrations tracking table exists
  await exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Get applied migrations
  const appliedResult = await query('SELECT name FROM schema_migrations');
  const applied = new Set(appliedResult.rows.map((r) => r.name));

  // Read migrations directory
  const migrationsDir = path.resolve(__dirname, 'migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migration file(s).`);

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  ✓ Already applied: ${file}`);
      continue;
    }

    console.log(`  ▶ Applying migration: ${file}...`);
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    await exec(sql);
    await query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);

    console.log(`  ✓ Successfully applied: ${file}`);
  }

  // 2. Check if seeding is requested
  const isSeed = process.argv.includes('--seed');
  if (isSeed) {
    console.log('\n🌱 Running seed scripts...');
    const seedsDir = path.resolve(__dirname, 'seeds');
    if (fs.existsSync(seedsDir)) {
      const seedFiles = fs
        .readdirSync(seedsDir)
        .filter((f) => f.endsWith('.sql'))
        .sort();

      for (const sFile of seedFiles) {
        console.log(`  ▶ Applying seed: ${sFile}...`);
        const sSql = fs.readFileSync(path.join(seedsDir, sFile), 'utf8');
        await exec(sSql);
        console.log(`  ✓ Applied seed: ${sFile}`);
      }
    }

    // Provision Super Admin Account
    const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || 'admin@hritikpedia.com').toLowerCase().trim();
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'Admin@Hritikpedia2026';
    const superAdminName = process.env.SUPER_ADMIN_NAME || 'Hritik Super Admin';

    const checkAdmin = await query('SELECT id, email FROM users WHERE email = $1', [superAdminEmail]);
    if (checkAdmin.rows.length === 0) {
      console.log(`  ▶ Provisioning Super Admin: ${superAdminEmail}...`);
      const hashed = await hashPassword(superAdminPassword);
      await query(
        `INSERT INTO users (email, password_hash, name, role, is_active, email_verified, created_at)
         VALUES ($1, $2, $3, $4, TRUE, TRUE, NOW())`,
        [superAdminEmail, hashed, superAdminName, ROLES.SUPER_ADMIN]
      );
      console.log(`  ✓ Super Admin provisioned successfully: ${superAdminEmail}`);
    } else {
      console.log(`  ✓ Super Admin account already exists: ${superAdminEmail}`);
    }
  }

  console.log('\n🎉 Migration process completed successfully.');
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
