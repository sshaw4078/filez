import db from "#db/client";
import { createFolder } from "#db/queries/folders";
import { createFile } from "#db/queries/files";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const folderNames = ["Documents", "Pictures", "Music"];

  for (const folderName of folderNames) {
    const folder = await createFolder(folderName);

    for (let i = 1; i <= 5; i++) {
      await createFile(
        `${folderName.toLowerCase()}_file_${i}.txt`,
        i * 100,
        folder.id,
      );
    }
  }
}