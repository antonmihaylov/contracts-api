import { createApp } from './app'

async function init() {
  const PORT = process.env.PORT ?? 3001
  const app = createApp()

  try {
    app.listen(PORT, () => {
      console.log(`Express App Listening on Port ${PORT}`)
      console.log(`Swagger UI available at http://localhost:${PORT}/swagger`)
    })
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`)
    process.exit(1)
  }
}

void init()
