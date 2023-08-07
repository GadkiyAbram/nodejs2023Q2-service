-- AddForeignKey
ALTER TABLE "favtracks" ADD CONSTRAINT "favtracks_id_fkey" FOREIGN KEY ("id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
