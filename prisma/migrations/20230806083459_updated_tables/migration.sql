-- AddForeignKey
ALTER TABLE "favartists" ADD CONSTRAINT "favartists_id_fkey" FOREIGN KEY ("id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favalbums" ADD CONSTRAINT "favalbums_id_fkey" FOREIGN KEY ("id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
