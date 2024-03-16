import clients from '../../../utils/clients'
import type { PrismaClient } from '@prisma/client'
import BadRequestError from '../../../utils/errors/BadRequestError'

const prisma: PrismaClient = clients.prisma

export function matchBytes (buffer: Buffer, hex: string, offset: number): boolean {
  hex = hex.replace(' ', '')
  const buffer2: Buffer = Buffer.from(hex, 'hex')
  const buffer2Len = hex.length / 2
  return buffer.compare(buffer2, 0, buffer2Len, offset, buffer2Len) === 0
}

interface SignatureWithParent {
  hex: string
  offset: number
  extension: string
  mime: string
}

export async function validateFileByMeta (file: Express.Multer.File): Promise<boolean> {
  if (file.size === 0) throw new BadRequestError('Size dari file tidak boleh 0 (tidak ada content)', { file: file.originalname, message: 'Size tidak boleh 0' })
  const temp: string[] = file.originalname.split('.')
  const extension: string = temp[temp.length - 1]
  const mime: string = file.mimetype

  const signatures: SignatureWithParent[] = await prisma.$queryRaw`
    SELECT S.hex AS hex, S.offset AS offset, E.name AS extension, M.name AS mime
    FROM "Signature" AS S
    JOIN "Extension" AS E
    ON S.extension_id = E.id
    JOIN "Mime" AS M
    ON E.mime_id = M.id
    WHERE E.name = ${extension} AND M.name = ${mime}
    ORDER BY length(hex) DESC, S.offset
  `
  for (const signature of signatures) {
    if (matchBytes(file.buffer, signature.hex, signature.offset)) {
      return true
    }
  }

  return false
}

export interface CompleteReport {
  file: string
  validity: boolean
  metas: Array<{ mime: string, extensions: string[] }>
}

export async function scanFiles (files: Express.Multer.File[]): Promise<CompleteReport[]> {
  let counter: number = files.length
  let offset: number = 0
  const limit: number = 100
  const reports: CompleteReport[] = []

  while (counter > 0) {
    const signatures: SignatureWithParent[] = await prisma.$queryRaw`
      SELECT S.hex AS hex, S.offset AS offset, E.name AS extension, M.name AS mime
      FROM "Signature" AS S
      JOIN "Extension" AS E
      ON S.extension_id = E.id
      JOIN "Mime" AS M
      ON E.mime_id = M.id
      ORDER BY length(hex) DESC, S.offset
      OFFSET ${offset * limit}
      LIMIT ${limit}
    `

    let indexFile: number = 0
    for (const file of files) {
      const temp: string[] = file.originalname.split('.')
      const extension: string = temp[temp.length - 1]
      const mime: string = file.mimetype

      if (await validateFileByMeta(file)) {
        reports.push({
          file: file.originalname,
          validity: true,
          metas: [{ mime, extensions: [extension] }]
        })
        files.splice(indexFile, 1)
      }
    }

    for (const signature of signatures) {
      indexFile = 0
      for (const file of files) {
        if (matchBytes(file.buffer, signature.hex, signature.offset)) {
          const metas: Array<{ mime: string, extensions: string }> = await prisma.$queryRaw`
            SELECT M.name AS mime, STRING_AGG(E.name, ',') AS extensions
            FROM "Signature" AS S
            JOIN "Extension" AS E 
            ON S.extension_id = E.id
            JOIN "Mime" AS M
            ON E.mime_id = M.id
            WHERE S.hex = ${signature.hex} AND S.offset = ${signature.offset}
            GROUP BY mime
          `
          reports.push({
            file: file.originalname,
            validity: false,
            metas: metas.map((meta) => ({ mime: meta.mime, extensions: meta.extensions.split(',') }))
          })
          files.splice(indexFile, 1)
          counter--
        }
        indexFile++
      }
    }
    if (signatures.length < limit) break
    offset++
  }

  for (const file of files) {
    reports.push({
      file: file.originalname,
      validity: false,
      metas: []
    })
  }
  return reports
}
