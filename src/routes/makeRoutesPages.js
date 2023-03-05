import { PrismaClient } from "@prisma/client"
import auth from "../middlewares/auth.js"
import checkPermissions from "../middlewares/checkPermissions.js"

const prisma = new PrismaClient()

const makeRoutesPages = ({ app }) => {
  const slugs = (title) => {
    return title.toLowerCase().split(" ").join("-")
  }

  app.post(
    "/pages",
    auth,
    checkPermissions("create", "page"),
    async (req, res) => {
      const { title, content, creatorId } = req.body
      const slug = slugs(title)
      const page = await prisma.page.create({
        data: {
          title,
          content,
          slug,
          creatorId: parseInt(creatorId),
        },
      })
      res.send({ payload: page })
    }
  )

  app.get("/pages", async (req, res) => {
    const pages = await prisma.page.findMany()
    res.send(pages)
  })

  app.get("/pages/:id", async (req, res) => {
    const page = await prisma.page.findUnique({
      where: {
        id: Number(req.params.id),
      },
    })
    res.send(page)
  })

  app.put(
    "/pages/:id",
    auth,
    checkPermissions("update", "page"),
    async (req, res) => {
      const page = await prisma.page.update({
        where: {
          id: Number(req.params.id),
        },
        data: req.body,
      })
      res.send({ payload: page })
    }
  )

  app.delete(
    "/pages/:id",
    auth,
    checkPermissions("delete", "page"),
    async (req, res) => {
      const page = await prisma.page.delete({
        where: {
          id: Number(req.params.id),
        },
      })
      res.send(page)
    }
  )
}

export default makeRoutesPages
