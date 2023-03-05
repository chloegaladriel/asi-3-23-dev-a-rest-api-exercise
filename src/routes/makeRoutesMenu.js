import { PrismaClient } from "@prisma/client"
import auth from "../middlewares/auth.js"

const prisma = new PrismaClient()

const makeRoutesMenu = ({ app }) => {
  app.post("/menu", auth, async (req, res) => {
    const { name } = req.body
    const menu = await prisma.navigationMenu.create({
      data: {
        name,
      },
    })
    res.send({ payload: menu })
  })

  app.get("/menu", async (req, res) => {
    const menu = await prisma.navigationMenu.findMany()
    res.send(menu)
  })

  app.get("/menu/:id", async (req, res) => {
    const menu = await prisma.navigationMenu.findUnique({
      where: {
        id: Number(req.params.id),
      },
    })
    res.send(menu)
  })

  app.put("/menu/:id", auth, async (req, res) => {
    const menu = await prisma.navigationMenu.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    })
    res.send({ payload: menu })
  })

  app.delete("/menu/:id", auth, async (req, res) => {
    const menu = await prisma.navigationMenu.delete({
      where: {
        id: Number(req.params.id),
      },
    })
    res.send(menu)
  })
}

export default makeRoutesMenu
