## Basics

### Call a function at the end of the app lifecycle

```javascript
import myServer from 'a-dev-server'
export default {
  hooks: [
    {
      event: 'end',
      action: (app, params, ctx) => {
        myServer(params)
      },
    },
  ],
}
```

### Mutating config

```javascript
export default {
  hooks: [
    {
      event: 'before:bundle',
      action: (app, params, ctx) => {
        app.config.svelte.foo = 'newValue'
      },
    },
  ],
}
```

## Concepts

#### Config Merging

Merging configs, recursively assigns object & array entries to the app object.

```javascript
export default {
  hooks: [
    {
      event: 'before:bundle',
      action: (app, params, ctx) => {
        app.merge({
          config: {
            svelte: {
              foo: 'newValue',
            },
          },
        })
      },
    },
  ],
}
```

#### Config sharing
Shared configs are configs where parsing has been delayed till the bundle event. The parser is added to `<config>$map` and the options to `<config>$options`.

Using a shared config provides access to the same set of options across multiple plugins.

```javascript
export default {
  hooks: [
    {
      event: 'config',
      action: (app, params, ctx) => {
        app.merge({
          config: {
            rollup: {
              plugins$map: { terser },
              plugins$options: { terser: { /** terser options */ } }
            }
          }
        })
      }
    }
  ]
}
```

## Examples

#### Adding a one-off Rollup plugin

```javascript
import alias from '@rollup/plugin-alias'

export default {
  hooks: [
    {
      event: 'config',
      action: (app, params, ctx) => {
        app.config.rollup.plugins.push(
          alias({
            entries: [
              { find: 'utils', replacement: '../../../utils' },
              { find: 'batman-1.0.0', replacement: './joker-1.5.0' },
            ]
          })
        )
      }
    }
  ]
}
```

#### Adding a shared Rollup plugin

```javascript
import alias from '@rollup/plugin-alias'

export default {
  hooks: [
    {
      event: 'config',
      action: (app, params, ctx) => {
        const rollup = {
          plugins: [],
          plugins$map: { alias },
          plugins$options: {
            alias: {
              entries: [
                { find: 'utils', replacement: '../../../utils' },
                { find: 'batman-1.0.0', replacement: './joker-1.5.0' },
              ],
            },
          },
        }

        app.merge({ config: { rollup } })
      },
    },
  ],
}
```
