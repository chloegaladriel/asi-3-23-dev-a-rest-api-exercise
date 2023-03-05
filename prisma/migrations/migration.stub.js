import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const up = async () => {}

export const down = async () => {}

prisma.$disconnect()
