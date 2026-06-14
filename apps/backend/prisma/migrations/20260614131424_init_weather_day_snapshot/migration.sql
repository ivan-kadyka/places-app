-- CreateTable
CREATE TABLE "WeatherDaySnapshot" (
    "id" TEXT NOT NULL,
    "providerType" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "snapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "WeatherDaySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeatherDaySnapshot_placeId_updatedAt_idx" ON "WeatherDaySnapshot"("placeId", "updatedAt" DESC);

-- AddForeignKey
ALTER TABLE "WeatherDaySnapshot" ADD CONSTRAINT "WeatherDaySnapshot_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
