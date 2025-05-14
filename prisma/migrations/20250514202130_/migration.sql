-- CreateTable
CREATE TABLE "UserPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "tags" TEXT,
    "text" TEXT NOT NULL,
    "links" TEXT,
    "image" TEXT,
    "views" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "UserPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
