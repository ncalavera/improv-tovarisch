#!/usr/bin/env node

/**
 * Import Script for Enriched Format Data
 *
 * This script imports enriched format data back into the application
 * after research has been completed.
 *
 * Usage:
 *   node import-enriched-data.js <path-to-enriched-json>
 *
 * Example:
 *   node import-enriched-data.js formats-export-for-research.json
 */

const fs = require('fs');
const path = require('path');

// File paths
const ENRICHED_FILE = process.argv[2] || 'formats-export-for-research.json';
const TARGET_FILE = 'formats.json';

// Validation function
function validateFormat(format, index) {
  const errors = [];

  if (!format.id) errors.push(`Format ${index}: Missing id`);
  if (!format.name) errors.push(`Format ${index}: Missing name`);
  if (!format.shortDescription) errors.push(`Format ${index}: Missing shortDescription`);
  if (!format.fullDescription) errors.push(`Format ${index}: Missing fullDescription`);
  if (typeof format.minPlayers !== 'number') errors.push(`Format ${index}: Invalid minPlayers`);
  if (typeof format.maxPlayers !== 'number') errors.push(`Format ${index}: Invalid maxPlayers`);
  if (!format.duration) errors.push(`Format ${index}: Missing duration`);
  if (!['beginner', 'intermediate', 'advanced'].includes(format.difficulty)) {
    errors.push(`Format ${index}: Invalid difficulty`);
  }
  if (!Array.isArray(format.components)) errors.push(`Format ${index}: components must be array`);
  if (!Array.isArray(format.skills)) errors.push(`Format ${index}: skills must be array`);
  if (!format.focus) errors.push(`Format ${index}: Missing focus`);
  if (!Array.isArray(format.variations)) errors.push(`Format ${index}: variations must be array`);
  if (!Array.isArray(format.prerequisites)) errors.push(`Format ${index}: prerequisites must be array`);
  if (!Array.isArray(format.similarTo)) errors.push(`Format ${index}: similarTo must be array`);
  if (!Array.isArray(format.sourceVideos)) errors.push(`Format ${index}: sourceVideos must be array`);

  return errors;
}

// Clean function - removes research_notes field before import
function cleanFormat(format) {
  const cleaned = { ...format };
  delete cleaned.research_notes; // Remove this field as it's not in the original schema
  return cleaned;
}

// Main import function
async function importEnrichedData() {
  try {
    console.log('🔍 Reading enriched data from:', ENRICHED_FILE);

    // Read enriched file
    const enrichedData = JSON.parse(fs.readFileSync(ENRICHED_FILE, 'utf-8'));

    if (!enrichedData.formats || !Array.isArray(enrichedData.formats)) {
      throw new Error('Invalid format: missing or invalid "formats" array');
    }

    console.log(`📊 Found ${enrichedData.formats.length} formats`);

    // Validate all formats
    console.log('✅ Validating formats...');
    let allErrors = [];
    enrichedData.formats.forEach((format, index) => {
      const errors = validateFormat(format, index);
      allErrors = allErrors.concat(errors);
    });

    if (allErrors.length > 0) {
      console.error('❌ Validation errors found:');
      allErrors.forEach(err => console.error('  -', err));
      throw new Error('Validation failed');
    }

    console.log('✅ All formats valid!');

    // Backup existing file
    if (fs.existsSync(TARGET_FILE)) {
      const backupFile = `formats.backup.${Date.now()}.json`;
      console.log(`💾 Creating backup: ${backupFile}`);
      fs.copyFileSync(TARGET_FILE, backupFile);
    }

    // Clean formats (remove research_notes field)
    const cleanedFormats = enrichedData.formats.map(cleanFormat);

    // Write to target file
    console.log(`💾 Writing to ${TARGET_FILE}...`);
    fs.writeFileSync(
      TARGET_FILE,
      JSON.stringify(cleanedFormats, null, 2),
      'utf-8'
    );

    console.log('✅ Import successful!');
    console.log(`📝 Imported ${cleanedFormats.length} formats`);

    // Statistics
    const withVideos = cleanedFormats.filter(f => f.sourceVideos && f.sourceVideos.length > 0);
    const withNotes = cleanedFormats.filter(f => f.notes && f.notes.length > 50);
    const withPrerequisites = cleanedFormats.filter(f => f.prerequisites && f.prerequisites.length > 0);

    console.log('\n📊 Statistics:');
    console.log(`  - Formats with videos: ${withVideos.length}`);
    console.log(`  - Formats with detailed notes: ${withNotes.length}`);
    console.log(`  - Formats with prerequisites: ${withPrerequisites.length}`);

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Show usage if no file provided
if (!process.argv[2]) {
  console.log('Usage: node import-enriched-data.js <path-to-enriched-json>');
  console.log('Example: node import-enriched-data.js formats-export-for-research.json');
  process.exit(1);
}

// Run import
importEnrichedData();
