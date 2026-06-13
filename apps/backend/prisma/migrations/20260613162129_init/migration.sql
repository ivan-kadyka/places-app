-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "openMeteoId" INTEGER,
    "name" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "elevation" DOUBLE PRECISION,
    "timezone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherSnapshot" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "dailyData" JSONB NOT NULL,

    CONSTRAINT "WeatherSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Place_name_countryCode_idx" ON "Place"("name", "countryCode");

-- CreateIndex
CREATE INDEX "WeatherSnapshot_placeId_fetchedAt_idx" ON "WeatherSnapshot"("placeId", "fetchedAt" DESC);

-- CreateIndex
CREATE INDEX "WeatherSnapshot_expiresAt_idx" ON "WeatherSnapshot"("expiresAt");

-- AddForeignKey
ALTER TABLE "WeatherSnapshot" ADD CONSTRAINT "WeatherSnapshot_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
