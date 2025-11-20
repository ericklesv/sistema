-- CreateTable
CREATE TABLE "shipments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shippingDate" DATETIME NOT NULL,
    "shippingCost" REAL NOT NULL DEFAULT 0,
    "taxCost" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usa_stock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "miniaturaBaseId" INTEGER,
    "shipmentId" INTEGER,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" REAL NOT NULL DEFAULT 0,
    "weight" REAL DEFAULT 0,
    "notes" TEXT,
    "addedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" DATETIME NOT NULL,
    CONSTRAINT "usa_stock_miniaturaBaseId_fkey" FOREIGN KEY ("miniaturaBaseId") REFERENCES "miniatura_base" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "usa_stock_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_usa_stock" ("addedDate", "brand", "id", "miniaturaBaseId", "name", "notes", "price", "quantity", "updatedDate", "weight") SELECT "addedDate", "brand", "id", "miniaturaBaseId", "name", "notes", "price", "quantity", "updatedDate", "weight" FROM "usa_stock";
DROP TABLE "usa_stock";
ALTER TABLE "new_usa_stock" RENAME TO "usa_stock";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
