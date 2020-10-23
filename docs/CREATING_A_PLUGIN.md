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

#### Merging config

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

## Examples

#### Adding Rollup plugin

```javascript
import alias from '@rollup/plugin-alias'

export default {
  hooks: [
    {
      event: 'config',
      action: (app, params, ctx) => {
        const rollup = {
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
