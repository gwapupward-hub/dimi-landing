import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Seed creators
const creators = [
  { id: 1, name: "PapiGwap", genre: "Trap / Soul", followers: 12400, isLive: 1 },
  { id: 2, name: "KayDee", genre: "R&B", followers: 8700, isLive: 1 },
  { id: 3, name: "Ayo Beats", genre: "Afrobeats", followers: 6200, isLive: 1 },
  { id: 4, name: "Vex", genre: "Drill", followers: 5100, isLive: 1 },
  { id: 5, name: "mellowmind", genre: "Lo-Fi", followers: 4800, isLive: 0 },
  { id: 6, name: "DRMTK", genre: "Trap", followers: 3900, isLive: 0 },
  { id: 7, name: "Noire", genre: "R&B", followers: 3200, isLive: 0 },
  { id: 8, name: "SampleKid", genre: "Boom Bap", followers: 2800, isLive: 0 },
  { id: 9, name: "Zephyr", genre: "House", followers: 1670, isLive: 0 },
];

for (const c of creators) {
  await conn.execute(
    `INSERT INTO creators (id, name, genre, followers, isLive) VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE genre=VALUES(genre), followers=VALUES(followers), isLive=VALUES(isLive)`,
    [c.id, c.name, c.genre, c.followers, c.isLive]
  );
}
console.log(`✓ Seeded ${creators.length} creators`);

// Seed additional sessions (non-live) to complement the 3 live ones
const additionalSessions = [
  { title: "Concrete Dreams", producerId: 4, genre: "Drill", bpm: 140, viewers: 412, collaborators: 1, isLive: 1, color: "#FF4D6D" },
  { title: "Sunset Tape", producerId: 5, genre: "Lo-Fi", bpm: 80, viewers: 389, collaborators: 2, isLive: 0, color: "#A47DFF" },
  { title: "808 Cathedral", producerId: 6, genre: "Trap", bpm: 150, viewers: 298, collaborators: 3, isLive: 0, color: "#2EE62E" },
  { title: "Phantom Keys", producerId: 7, genre: "R&B / Soul", bpm: 88, viewers: 276, collaborators: 1, isLive: 0, color: "#3DD6C8" },
  { title: "Dust & Gold", producerId: 8, genre: "Boom Bap", bpm: 92, viewers: 198, collaborators: 2, isLive: 0, color: "#2EE62E" },
  { title: "Neon Drift", producerId: 9, genre: "House", bpm: 124, viewers: 167, collaborators: 1, isLive: 0, color: "#FF4D6D" },
];

for (const s of additionalSessions) {
  // Check if session with this title already exists
  const [existing] = await conn.execute("SELECT id FROM sessions WHERE title = ?", [s.title]);
  if (existing.length > 0) {
    console.log(`  ⤳ Session "${s.title}" already exists, skipping`);
    continue;
  }
  await conn.execute(
    `INSERT INTO sessions (title, producerId, genre, bpm, viewers, collaborators, isLive, color)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [s.title, s.producerId, s.genre, s.bpm, s.viewers, s.collaborators, s.isLive, s.color]
  );
  console.log(`  ✓ Seeded session: ${s.title}`);
}

console.log("✓ Done seeding rooms data");
await conn.end();
