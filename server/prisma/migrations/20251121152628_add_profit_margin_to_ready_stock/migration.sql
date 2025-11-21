-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "whatsapp" TEXT,
    "role" TEXT NOT NULL DEFAULT 'client',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "pre_sales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "photoUrl" TEXT,
    "addedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "situation" TEXT DEFAULT 'Esperando lançamento',
    "totalValue" REAL NOT NULL DEFAULT 0,
    "paidValue" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "pre_sales_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "garage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "photoUrl" TEXT,
    "addedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalValue" REAL NOT NULL DEFAULT 0,
    "paidValue" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "garage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "usa_stock" (
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

-- CreateTable
CREATE TABLE "shipments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shippingDate" DATETIME NOT NULL,
    "shippingCost" REAL NOT NULL DEFAULT 0,
    "taxCost" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "miniatura_base" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "photoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ready_stock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "miniaturaBaseId" INTEGER,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "cost" REAL NOT NULL DEFAULT 0,
    "profitMargin" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "addedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" DATETIME NOT NULL,
    CONSTRAINT "ready_stock_miniaturaBaseId_fkey" FOREIGN KEY ("miniaturaBaseId") REFERENCES "miniatura_base" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "miniatura_base_code_key" ON "miniatura_base"("code");
