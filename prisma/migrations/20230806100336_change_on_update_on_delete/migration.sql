-- DropForeignKey
ALTER TABLE "albums" DROP CONSTRAINT "albums_artistId_fkey";

-- DropForeignKey
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_albumId_fkey";

-- DropForeignKey
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_artistId_fkey";

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;
