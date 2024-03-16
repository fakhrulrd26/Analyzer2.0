import fs from 'fs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedImportant (): Promise<void> {
  const data: object = JSON.parse(fs.readFileSync('./prisma/magic.json', 'utf-8'))

  for (const [key, value] of Object.entries(data)) {
    await prisma.mime.upsert({
      where: {
        name: value.mime
      },
      update: {
        extensions: {
          create: {
            name: key,
            signatures: {
              create: value.signs
            }
          }
        }
      },
      create: {
        name: value.mime,
        extensions: {
          create: {
            name: key,
            signatures: {
              create: value.signs
            }
          }
        }
      }
    })
  }
}

async function seedCountry (): Promise<void> {
  const countries: Array<{ code: string, name: string }> = JSON.parse(fs.readFileSync('./prisma/countries.json', 'utf-8'))

  for (const country of countries) {
    await prisma.country.create({
      data: {
        code: country.code,
        name: country.name
      }
    })
  }
}

async function main (): Promise<void> {
  await seedImportant()
  await seedCountry()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
