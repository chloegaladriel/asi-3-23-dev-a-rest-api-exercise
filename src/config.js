import { PrismaClient } from "@prisma/client"
import "dotenv/config"
import * as yup from "yup"

const prisma = new PrismaClient()

const validationSchema = yup.object().shape({
  port: yup.number().min(80).max(65535).required(),
  db: yup.string().required(),
  security: yup.object().shape({
    session: yup.object().shape({
      jwt: yup.object().shape({
        secret: yup.string().min(30).required(),
      }),
    }),
  }),
  pagination: yup.object().shape({
    limit: yup.object().shape({
      min: yup.number().min(1).required(),
      max: yup.number().min(1).required(),
      default: yup.number().min(yup.ref("min")).max(yup.ref("max")).required(),
    }),
  }),
})

let config = null

try {
  config = validationSchema.validateSync(
    {
      port: process.env.PORT || 3000,
      db: prisma,
      security: {
        session: {
          jwt: {
            secret: process.env.SECURITY_SESSION_JWT_SECRET,
            expiresIn: "1 day",
          },
          password: {
            saltlen: 32,
            iterations: 123943,
            keylen: 256,
            digest: "sha512",
          },
        },
      },
      pagination: {
        limit: {
          min: 1,
          max: 100,
          default: 10,
        },
      },
    },
    { abortEarly: false }
  )
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err.inner)
  throw new Error(`Invalid config.\n${err.errors.join("\n")}`)
}

export default config
