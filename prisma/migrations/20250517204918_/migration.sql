/*
  Warnings:

  - You are about to drop the column `postId` on the `Image` table. All the data in the column will be lost.
  - Added the required column `userPostId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "userPostId" INTEGER NOT NULL,
    CONSTRAINT "Image_userPostId_fkey" FOREIGN KEY ("userPostId") REFERENCES "UserPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("id", "url") SELECT "id", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE TABLE "new_UserPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "theme" TEXT,
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
