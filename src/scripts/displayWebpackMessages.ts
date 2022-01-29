import { Stats } from 'webpack'
import { formatWebpackMessages } from './formatWebpackMessages'

export function displayWebpackMessages(stats: Stats) {
  console.log(
    formatWebpackMessages(
      stats.toJson({
        all: false,
        warnings: true,
        errors: true,
      })
    )
  )

  console.log('Compiled successfully')
}
