-- CreateTable
CREATE TABLE "ready_stock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "miniaturaBaseId" INTEGER,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "addedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" DATETIME NOT NULL,
    CONSTRAINT "ready_stock_miniaturaBaseId_fkey" FOREIGN KEY ("miniaturaBaseId") REFERENCES "miniatura_base" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
