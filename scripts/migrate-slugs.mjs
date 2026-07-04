/**
 * ONE-TIME MIGRATION SCRIPT
 * --------------------------
 * Populates the `slug` field for existing 'question_paper' documents in
 * MongoDB that don't have one.
 *
 * SAFETY:
 * - Runs in DRY-RUN mode by default — it only prints what it WOULD do.
 * - Pass --apply to actually write changes to the database.
 * - Always back up your database before running with --apply.
 *
 * USAGE:
 *   node scripts/migrate-slugs.mjs              # dry run (safe, no writes)
 *   node scripts/migrate-slugs.mjs --apply      # actually applies the migration
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import Document from '../models/document.js';

const APPLY = process.argv.includes('--apply');
const CHUNK_SIZE = 500; // write in batches instead of one giant bulkWrite

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function runMigration() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI is not defined in your environment variables.');
    process.exit(1);
  }

  console.log(APPLY ? '⚠️  Running in APPLY mode — changes WILL be written.' : 'ℹ️  Running in DRY-RUN mode — no changes will be written. Pass --apply to write.');
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Database connected.');

  try {
    console.log('\nFinding question papers that need a slug...');
    const documentsToUpdate = await Document.find({
      type: 'question_paper',
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' },
      ],
    }).lean();

    if (documentsToUpdate.length === 0) {
      console.log('👍 All question papers already have slugs. No migration needed.');
      return;
    }

    console.log(`Found ${documentsToUpdate.length} documents missing a slug.`);

    // Load every slug already in use, so new slugs can't collide with
    // documents that aren't part of this migration batch.
    const existingSlugDocs = await Document.find(
      { slug: { $exists: true, $ne: null, $nin: [''] } },
      { slug: 1 }
    ).lean();
    const usedSlugs = new Set(existingSlugDocs.map((d) => d.slug));

    const skipped = [];
    const bulkOps = [];
    const preview = [];

    for (const doc of documentsToUpdate) {
      if (!doc.subject_name || !doc.code || !doc.exam_period) {
        skipped.push({
          _id: doc._id.toString(),
          reason: 'missing subject_name, code, or exam_period',
          data: {
            subject_name: doc.subject_name,
            code: doc.code,
            exam_period: doc.exam_period,
          },
        });
        continue;
      }

      let baseSlug = slugify(`${doc.subject_name}-${doc.code}-${doc.exam_period}`);

      if (!baseSlug) {
        skipped.push({
          _id: doc._id.toString(),
          reason: 'slugify produced an empty string',
          data: { subject_name: doc.subject_name, code: doc.code, exam_period: doc.exam_period },
        });
        continue;
      }

      // Disambiguate collisions against both existing DB slugs and slugs
      // already assigned earlier in this same run.
      let finalSlug = baseSlug;
      let suffix = 2;
      while (usedSlugs.has(finalSlug)) {
        finalSlug = `${baseSlug}-${suffix}`;
        suffix += 1;
      }
      usedSlugs.add(finalSlug);

      preview.push({ _id: doc._id.toString(), slug: finalSlug, collided: finalSlug !== baseSlug });

      bulkOps.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { slug: finalSlug } },
        },
      });
    }

    console.log(`\nPreview (${preview.length} slugs to assign):`);
    for (const p of preview) {
      console.log(`  - ${p._id}: "${p.slug}"${p.collided ? '  (deduped — collision with an existing slug)' : ''}`);
    }

    if (skipped.length > 0) {
      console.log(`\n⚠️  Skipped ${skipped.length} document(s) due to missing/invalid data:`);
      for (const s of skipped) {
        console.log(`  - ${s._id}: ${s.reason}`, s.data);
      }
      console.log('  These need manual data cleanup before they can get a slug.');
    }

    if (!APPLY) {
      console.log('\nℹ️  Dry run complete. No changes were written. Re-run with --apply to write these changes.');
      return;
    }

    if (bulkOps.length === 0) {
      console.log('\nNothing to write.');
      return;
    }

    console.log(`\nWriting ${bulkOps.length} update(s) in batches of ${CHUNK_SIZE}...`);
    let matched = 0;
    let modified = 0;

    for (const batch of chunk(bulkOps, CHUNK_SIZE)) {
      const result = await Document.bulkWrite(batch, { ordered: false });
      matched += result.matchedCount;
      modified += result.modifiedCount;
      console.log(`  - Batch done: matched ${result.matchedCount}, modified ${result.modifiedCount}`);
    }

    console.log('\nBulk write complete:');
    console.log(`  - Total matched: ${matched}`);
    console.log(`  - Total modified: ${modified}`);
    console.log('\n✅ Migration complete!');
    console.log('\nNext step: confirm a unique index exists on `slug` in your Document schema');
    console.log('(e.g. slug: { type: String, unique: true, index: true }) so future writes');
    console.log('can never create a duplicate slug again.');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    if (error.code === 11000) {
      console.error('  - Duplicate key violation (code 11000): a generated slug collided with');
      console.error('    one already in the database that this script did not know about.');
      console.error('    Re-run the script — it re-reads existing slugs each time — or resolve');
      console.error('    the conflicting document manually.');
    }
    process.exitCode = 1;
  } finally {
    console.log('\nClosing database connection.');
    await mongoose.connection.close();
  }
}

runMigration().catch((err) => {
  console.error('An unexpected error occurred during the migration process:', err);
  mongoose.connection.close();
  process.exitCode = 1;
});
