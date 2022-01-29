import stdlib from '@grakkit/stdlib-paper'
import { WebServer } from './webServer'

/**
 * This will initialize a webserver on port 4000 during development mode.
 * When this receives a response at `/reload`, it'll start reloading the
 * server.
 *
 * This is not recommended for production use.
 */
export function initializeAutoReload() {
  WebServer.start()

  if (process.env.NODE_ENV === 'development') {
    WebServer.listen(4000)

    WebServer.get('/reload', (req, res) => {
      res.send('done')

      reload()
    })

    console.log('Grakkit-Boilerplate-Util: Development Mode')
  } else {
    console.log('Grakkit-Boilerplate-Util: Production Mode')
  }
}

function reload() {
  if (process.env.NODE_ENV === 'development') {
    WebServer.stop()
  }

  stdlib.reload()
  console.log('Grakkit-Boilerplate-Util: Reloaded')
}
