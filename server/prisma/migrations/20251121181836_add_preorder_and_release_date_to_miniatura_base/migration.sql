-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_miniatura_base" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "photoUrl" TEXT,
    "isPreOrder" BOOLEAN NOT NULL DEFAULT false,
    "releaseDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_miniatura_base" ("brand", "code", "createdAt", "id", "name", "photoUrl") SELECT "brand", "code", "createdAt", "id", "name", "photoUrl" FROM "miniatura_base";
DROP TABLE "miniatura_base";
ALTER TABLE "new_miniatura_base" RENAME TO "miniatura_base";
CREATE UNIQUE INDEX "miniatura_base_code_key" ON "miniatura_base"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
