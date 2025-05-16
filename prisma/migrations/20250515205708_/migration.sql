/*
  Warnings:

  - You are about to drop the column `image` on the `UserPost` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "imageId" INTEGER NOT NULL,
    CONSTRAINT "Image_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "UserPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "tags" TEXT,
    "text" TEXT NOT NULL,
    "links" TEXT,
    "views" INTEGER,
    "likes" INTEGER,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "UserPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserPost" ("authorId", "id", "likes", "links", "name", "tags", "text", "theme", "views") SELECT "authorId", "id", "likes", "links", "name", "tags", "text", "theme", "views" FROM "UserPost";
DROP TABLE "UserPost";
ALTER TABLE "new_UserPost" RENAME TO "UserPost";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
