import stdlib from '@grakkit/stdlib-paper'
import { WebServer } from './webServer'

interface AutoReloadOpts {
  /**
   * This will trigger before the reload event. This is useful for starting
   * existing services.
   */
  onStop?: () => void

  /**
   * If you don't like the default messages, you can disable them.
   */
  disableMessages?: boolean

  /**
   * If you really want this in prod...
   */
  allowProductionUse?: boolean
}

/**
 * This will initialize a webserver on port 4000 during development mode.
 * When this receives a response at `/reload`, it'll start reloading the
 * server.
 *
 * This is not recommended for production use.
 */
export function initializeAutoReload(opts?: AutoReloadOpts) {
  const { onStop, disableMessages = false, allowProductionUse = false } = opts ?? {}
  const isDev = process.env.NODE_ENV === 'development'
  const allowReload = allowProductionUse ? true : isDev

  if (allowReload) {
    WebServer.start()
    WebServer.listen(4000)

    WebServer.get('/reload', (req, res) => {
      res.send('done')

      onStop?.()

      reload(opts)
    })

    if (!disableMessages) console.log('Grakkit-Boilerplate-Util: Development Mode')
  } else {
    if (!disableMessages) console.log('Grakkit-Boilerplate-Util: Production Mode')
  }
}

function reload(opts?: AutoReloadOpts) {
  const { disableMessages = false } = opts ?? {}
  WebServer.stop()

  stdlib.reload()
  if (!disableMessages) console.log('Grakkit-Boilerplate-Util: Reloaded')
}
