import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

// Use mysql2 pool directly for parameterized queries
const pool = mysql.createPool(DATABASE_URL);

async function seed() {
  // First check what sessions exist
  const [sessions] = await pool.query('SELECT id, title, genre, bpm FROM sessions');
  console.log('Existing sessions:', sessions);

  // Check if releases already exist
  const [existingReleases] = await pool.query('SELECT id, sessionId, title FROM releases');
  console.log('Existing releases:', existingReleases);

  if (Array.isArray(existingReleases) && existingReleases.length > 0) {
    console.log('Releases already seeded, skipping...');
    await pool.end();
    process.exit(0);
  }

  let sessionRows = Array.isArray(sessions) ? sessions : [];
  
  if (sessionRows.length === 0) {
    console.log('No sessions found. Creating sample sessions first...');
    
    await pool.query(`INSERT INTO sessions (title, producerId, genre, bpm, viewers, collaborators, isLive, color, description) VALUES
      ('Dark Side of Midnight', 1, 'Trap / Soul', 142, 1247, 3, 1, '#2EE62E', 'Late-night trap soul session'),
      ('Blue Hours', 2, 'R&B / Soul', 98, 847, 2, 1, '#3DD6C8', 'Smooth R&B collab'),
      ('Lagos Nights', 3, 'Afrobeats', 116, 623, 4, 1, '#F5A623', 'Afrobeats production session')
    `);
    
    console.log('Created 3 sample sessions');
  }

  // Re-fetch sessions
  const [freshSessions] = await pool.query('SELECT id, title, genre, bpm FROM sessions ORDER BY id LIMIT 3');
  sessionRows = Array.isArray(freshSessions) ? freshSessions : [];

  if (sessionRows.length === 0) {
    console.error('Still no sessions found after seeding');
    await pool.end();
    process.exit(1);
  }

  // Create releases for each session
  for (let i = 0; i < sessionRows.length; i++) {
    const s = sessionRows[i];
    console.log(`Creating release for session ${s.id}: ${s.title}`);

    let musicalKey = 'F# Minor';
    let duration = '3:47';
    if (i === 1) { musicalKey = 'Bb Major'; duration = '4:12'; }
    if (i === 2) { musicalKey = 'G Minor'; duration = '3:22'; }

    const [releaseResult] = await pool.query(
      'INSERT INTO releases (sessionId, title, genre, bpm, musicalKey, duration, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [s.id, s.title, s.genre || 'Trap / Soul', s.bpm || 142, musicalKey, duration, 'pending_signatures']
    );

    const releaseId = releaseResult.insertId;
    console.log(`  Created release ID: ${releaseId}`);

    // Define contributors per session
    let contributors;
    if (i === 0) {
      contributors = [
        { name: 'Metro Luz', handle: '@metroluz', role: 'Producer', split: 50, color: '#2EE62E', initials: 'ML', isHost: 1, signed: 1 },
        { name: 'KayDee', handle: '@kaydee', role: 'Co-Producer', split: 30, color: '#3DD6C8', initials: 'KD', isHost: 0, signed: 1 },
        { name: 'Ari Lennox', handle: '@arilennox', role: 'Vocalist', split: 20, color: '#F5A623', initials: 'AL', isHost: 0, signed: 0 },
      ];
    } else if (i === 1) {
      contributors = [
        { name: 'KayDee', handle: '@kaydee', role: 'Producer', split: 60, color: '#3DD6C8', initials: 'KD', isHost: 1, signed: 1 },
        { name: 'Noire', handle: '@noire', role: 'Vocalist', split: 40, color: '#9B59B6', initials: 'NO', isHost: 0, signed: 0 },
      ];
    } else {
      contributors = [
        { name: 'Ayo Beats', handle: '@ayobeats', role: 'Producer', split: 40, color: '#F5A623', initials: 'AY', isHost: 1, signed: 1 },
        { name: 'PapiGwap', handle: '@papigwap', role: 'Co-Producer', split: 25, color: '#2EE62E', initials: 'PG', isHost: 0, signed: 1 },
        { name: 'Vex', handle: '@vex', role: 'Vocalist', split: 20, color: '#FF4D4D', initials: 'VE', isHost: 0, signed: 0 },
        { name: 'mellowmind', handle: '@mellowmind', role: 'Keys', split: 15, color: '#3DD6C8', initials: 'ME', isHost: 0, signed: 0 },
      ];
    }

    for (const c of contributors) {
      await pool.query(
        'INSERT INTO release_contributors (releaseId, name, handle, role, splitPercent, hasSigned, signedAt, avatarColor, avatarInitials, isHost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [releaseId, c.name, c.handle, c.role, c.split, c.signed, c.signed ? new Date() : null, c.color, c.initials, c.isHost]
      );
    }

    console.log(`  Added ${contributors.length} contributors`);
  }

  console.log('Seed complete!');
  await pool.end();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error('Seed error:', err);
  await pool.end();
  process.exit(1);
});
