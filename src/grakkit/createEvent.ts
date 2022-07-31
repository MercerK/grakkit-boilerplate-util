/**
 * As part of a showcase to demonstrate new typings, this was forked from stdlib and
 * updated to support the different approach. As a result, this may change or be
 * removed in the future.
 */

/** A valid event priority. */
type GrakkitPriority = 'HIGH' | 'HIGHEST' | 'LOW' | 'LOWEST' | 'MONITOR' | 'NORMAL'

/** A set of listeners attached to an event. */
type GrakkitCascade = Set<
  ((event: any) => void) | { script: (event: any) => void; priority: GrakkitPriority }
>

const Bukkit = Java.type('org.bukkit.Bukkit')
const EventPriority = Java.type('org.bukkit.event.EventPriority')
const Listener = Java.type('org.bukkit.event.Listener')

const manager =  Bukkit.getPluginManager()
const plugin = manager.getPlugin('grakkit')

const session = {
  event: new Map<string, GrakkitCascade>(),
}

const IListener = new (Java.extend(Listener, {}))()

// @ts-expect-error
type EventListener<X> = (event: InstanceType<X>) => void
type ScriptEventListener<X> = {
  // @ts-expect-error
  script: (event: InstanceType<X>) => void
  priority: GrakkitPriority
}

/**
 * A similar implement to grakkit's event, however, this supports the
 * new typing implementatioon. 
 */
export function createEvent<X>(
  eventClass: X,
  ...listeners: (EventListener<X> | ScriptEventListener<X>)[]
) {
  let list: GrakkitCascade
  // @ts-expect-error [DEBUG - Need to figure out name]
  const name: string = eventClass.class.toString()

  // Cache
  if (session.event.has(name)) {
    // @ts-expect-error [Grakkit typing error?]
    list = session.event.get(name)
  } else {
    list = new Set()
    session.event.set(name, list)
  }

  const targets: Set<GrakkitPriority> = new Set()
  for (const listener of listeners) {
    if (typeof listener === 'function') {
      targets.has('HIGHEST') || targets.add('HIGHEST')
    } else {
      targets.has(listener.priority) || targets.add(listener.priority)
    }
  }

  for (const listener of list) {
    if (typeof listener === 'function') {
      targets.has('HIGHEST') && targets.delete('HIGHEST')
    } else {
      targets.has(listener.priority) && targets.delete(listener.priority)
    }
  }
  for (const target of targets) {
    manager.registerEvent(
      // @ts-expect-error [DEBUG]
      eventClass.class,
      IListener,
      EventPriority.valueOf(target),
      (x: any, signal: any) => {
        // @ts-expect-error [DEBUG]
        if (signal instanceof eventClass) {
          try {
            for (const listener of list) {
              if (typeof listener === 'function') {
                target === 'HIGHEST' && listener(signal)
              } else {
                target === listener.priority && listener.script(signal)
              }
            }
          } catch (error) {
            console.error(`An error occured while attempting to handle the "${name}" event!`)
            // @ts-expect-error
            console.error(error.stack || error.message || error)
          }
        }
      },
      plugin
    )
  }
  for (const listener of listeners) list.has(listener) || list.add(listener)
}
