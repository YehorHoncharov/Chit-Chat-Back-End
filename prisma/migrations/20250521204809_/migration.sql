/*
  Warnings:

  - You are about to drop the column `tags` on the `UserPost` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserPostTags" (
    "userPostId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    PRIMARY KEY ("userPostId", "tagId"),
    CONSTRAINT "UserPostTags_userPostId_fkey" FOREIGN KEY ("userPostId") REFERENCES "UserPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserPostTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "theme" TEXT,
    "text" TEXT NOT NULL,
    "links" TEXT,
    "views" INTEGER,
    "likes" INTEGER,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "UserPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserPost" ("authorId", "id", "likes", "links", "name", "text", "theme", "views") SELECT "authorId", "id", "likes", "links", "name", "text", "theme", "views" FROM "UserPost";
DROP TABLE "UserPost";
ALTER TABLE "new_UserPost" RENAME TO "UserPost";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
