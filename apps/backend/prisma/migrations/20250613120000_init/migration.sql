-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "openMeteoId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "admin1" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "elevation" DOUBLE PRECISION,
    "timezone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherSnapshot" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "dailyData" JSONB NOT NULL,

    CONSTRAINT "WeatherSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_openMeteoId_key" ON "Location"("openMeteoId");

-- CreateIndex
CREATE INDEX "Location_name_countryCode_idx" ON "Location"("name", "countryCode");

-- CreateIndex
CREATE INDEX "WeatherSnapshot_locationId_fetchedAt_idx" ON "WeatherSnapshot"("locationId", "fetchedAt" DESC);

-- CreateIndex
CREATE INDEX "WeatherSnapshot_expiresAt_idx" ON "WeatherSnapshot"("expiresAt");

-- AddForeignKey
ALTER TABLE "WeatherSnapshot" ADD CONSTRAINT "WeatherSnapshot_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
