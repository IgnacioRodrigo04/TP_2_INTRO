-- CreateTable
CREATE TABLE "Skins" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL DEFAULT 100,
    "tipo" TEXT NOT NULL,
    "rareza" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,

    CONSTRAINT "Skins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Historial" (
    "id" SERIAL NOT NULL,
    "kda" TEXT NOT NULL,
    "partidas_totales" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "partidas_ganadas" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "partidas_perdidas" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "winrate" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "Historial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "plata" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "rango" TEXT NOT NULL,
    "coleccion" INTEGER[],
    "historial" INTEGER[],

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);
