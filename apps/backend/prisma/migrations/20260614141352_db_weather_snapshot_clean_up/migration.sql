/*
  Warnings:

  - You are about to drop the `WeatherSnapshot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WeatherSnapshot" DROP CONSTRAINT "WeatherSnapshot_placeId_fkey";

-- AlterTable
ALTER TABLE "WeatherDaySnapshot" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "WeatherSnapshot";
