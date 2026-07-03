/**
 * ONE-TIME MIGRATION SCRIPT
 * --------------------------
 * This script populates the `slug` field for existing 'question_paper' documents
 * in your MongoDB database that do not have one.
 *
 * USAGE:
 * 1. Make sure you have `dotenv` installed (`npm install dotenv`).
 * 2. Ensure your `.env.local` file has the correct `MONGODB_URI`.
 * 3. Run this script from your project's root directory:
 *    `node scripts/migrate-slugs.mjs`
 *
 * NOTE: It's always a good practice to back up your database before running a migration.
 */

import dotenv from 'dotenv';
// By default, `dotenv` loads `.env`. We need to explicitly tell it to load `.env.local`
// to match Next.js's behavior for local development secrets.
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import Document from '../models/document.js';

// This utility must match the one used in your application code.
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")       // Replace spaces with -
    .replace(/[^\w-]+/g, "")    // Remove all non-word chars
    .replace(/--+/g, "-")       // Replace multiple - with single -
    .replace(/^-+/, "")         // Trim - from start of text
    .replace(/-+$/, "");        // Trim - from end of text
}

async function runMigration() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI is not defined in your environment variables.');
    process.exit(1);
  }

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
        { slug: '' }
      ]
    }).lean(); // Use .lean() for faster reads as we don't need Mongoose documents here

    if (documentsToUpdate.length === 0) {
      console.log('👍 All question papers already have slugs. No migration needed.');
      return;
    }

    console.log(`Found ${documentsToUpdate.length} documents to migrate.`);

    // Using bulkWrite for performance. This is much faster than saving one by one.
    const bulkOps = documentsToUpdate.map(doc => {
      const newSlug = slugify(`${doc.subject_name}-${doc.code}-${doc.exam_period}`);
      console.log(`  - Preparing update for ${doc._id}: slug will be "${newSlug}"`);
      return {
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { slug: newSlug } }
        }
      };
    });

    if (bulkOps.length > 0) {
        console.log('\nExecuting bulk update operation...');
        const result = await Document.bulkWrite(bulkOps);
        console.log('\nBulk write operation result:');
        console.log(`  - Matched: ${result.matchedCount}`);
        console.log(`  - Modified: ${result.modifiedCount}`);
    }

    console.log(`\n✅ Migration complete!`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    if (error.code === 11000) {
        console.error('  - This error code (11000) indicates a duplicate key violation. It means the migration tried to create a slug that already exists for another document. You may need to manually resolve this conflict.');
    }
  } finally {
    console.log('\nClosing database connection.');
    await mongoose.connection.close();
  }
}

runMigration().catch(err => {
    console.error("An unexpected error occurred during the migration process:", err);
    mongoose.connection.close();
});