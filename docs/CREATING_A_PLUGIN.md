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
