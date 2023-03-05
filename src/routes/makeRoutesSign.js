import { PrismaClient } from "@prisma/client"
import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"
import { InvalidCredentialsError } from "../errors.js"
import hashPassword from "../hashPassword.js"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import {
  emailValidator,
  firstNameValidator,
  lastNameValidator,
  passwordValidator,
} from "../validators.js"

const prisma = new PrismaClient()

const makeRoutesSign = ({ app }) => {
  app.post(
    "/sign-up",
    validate({
      body: {
        firstName: firstNameValidator.required(),
        lastName: lastNameValidator.required(),
        email: emailValidator.required(),
        password: passwordValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { firstName, lastName, email, password, roleId } = req.data.body
      const [passwordHash, passwordSalt] = hashPassword(password)
      const user = await prisma.user.create({
        data: {
          email,
          password,
          firstName,
          lastName,
          passwordHash,
          passwordSalt,
          roleId: parseInt(roleId),
        },
      })

      res.send({ payload: user })
    })
  )
  app.post(
    "/sign-in",
    validate({
      body: {
        email: emailValidator.required(),
        password: passwordValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { email, password } = req.data.body
      const user = await prisma.user.findUnique({ where: { email } })
      const role = await prisma.user.findUnique({ where: { id: user.roleId } })

      if (!user) {
        throw new InvalidCredentialsError()
      }

      const [passwordHash] = hashPassword(password, user.passwordSalt)

      if (user.passwordHash !== passwordHash) {
        throw new InvalidCredentialsError()
      }

      const jwt = jsonwebtoken.sign(
        {
          payload: {
            user: {
              id: user.id,
              fullName: `${user.firstName} ${user.lastName}`,
            },
            role: {
              permissions: role.permissions,
            },
          },
        },
        config.security.session.jwt.secret,
        { expiresIn: config.security.session.jwt.expiresIn }
      )
      res.send({ payload: jwt })
    })
  )
}

export default makeRoutesSign
