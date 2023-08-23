import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportHeight: 768,
    viewportWidth: 1224,

    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)

          return null
        },
        seed() {
          console.log('seeding database')
          // run bash script to seed database
          // prisma/scripts/seed.sh

          


          


          return null
        },
      })
    },

  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
