/*
  Warnings:

  - You are about to drop the column `regresh_token` on the `User_refresh_token` table. All the data in the column will be lost.
  - Added the required column `refresh_token` to the `User_refresh_token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User_refresh_token" DROP COLUMN "regresh_token",
ADD COLUMN     "refresh_token" TEXT NOT NULL;
