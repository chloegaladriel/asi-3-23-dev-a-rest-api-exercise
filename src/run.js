import express from "express"
import handleError from "./middlewares/handleError.js"
import makeRoutesMenu from "./routes/makeRoutesMenu.js"
import makeRoutesPages from "./routes/makeRoutesPages.js"
import makeRoutesSign from "./routes/makeRoutesSign.js"
import makeRoutesUsers from "./routes/makeRoutesUsers.js"

const run = async (config) => {
  const app = express()

  app.use(express.json())

  makeRoutesSign({ app })
  makeRoutesUsers({ app })
  makeRoutesPages({ app })
  makeRoutesMenu({ app })

  app.use(handleError)
  app.use((req, res) => {
    res.status(404).send({ error: [`cannot POST ${req.url}`] })
  })

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on :${config.port}`)
  })
}

export default run
