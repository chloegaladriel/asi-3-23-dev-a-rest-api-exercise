import { PrismaClient } from "@prisma/client"
import auth from "../middlewares/auth.js"

const prisma = new PrismaClient()

const makeRoutesUsers = ({ app }) => {
  app.get("/users", auth, async (req, res) => {
    const users = await prisma.user.findMany()
    res.send(users)
  })

  app.get("/users/:id", auth, async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    })
    res.send(user)
  })

  app.put("/users/:id", auth, async (req, res) => {
    const user = await prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    })
    res.send({ payload: user })
  })

  app.delete("/users/:id", auth, async (req, res) => {
    const user = await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    })
    res.send(user)
  })
}
export default makeRoutesUsers
