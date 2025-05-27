-- CreateTable
CREATE TABLE "User_refresh_token" (
    "cod_user_refresh_token" SERIAL NOT NULL,
    "cod_user" INTEGER NOT NULL,
    "regresh_token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_refresh_token_pkey" PRIMARY KEY ("cod_user_refresh_token")
);

-- AddForeignKey
ALTER TABLE "User_refresh_token" ADD CONSTRAINT "User_refresh_token_cod_user_fkey" FOREIGN KEY ("cod_user") REFERENCES "User"("cod_user") ON DELETE RESTRICT ON UPDATE CASCADE;
