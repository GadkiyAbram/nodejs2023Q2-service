-- CreateTable
CREATE TABLE "artists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grammy" BOOLEAN NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artistId" TEXT,
    "albumId" TEXT,
    "duraction" INTEGER NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favartists" (
    "name" TEXT NOT NULL,

    CONSTRAINT "favartists_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "favalbums" (
    "name" TEXT NOT NULL,

    CONSTRAINT "favalbums_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "favtracks" (
    "name" TEXT NOT NULL,

    CONSTRAINT "favtracks_pkey" PRIMARY KEY ("name")
);
