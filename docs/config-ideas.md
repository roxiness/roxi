## Array mapping

### Template

\- too verbose

\- assigning to value is weird

```javascript
rollup = {
    input: 'src/main.js',
    plugins: [
        {
            name: 'livereload',
            condition: (app, params, ctx) => !app.state.production && !ctx.isNollup
            value: 'dist'
        },
        {
            name: 'spassr',
            condition: (app, params, ctx) => !app.state.production && !ctx.isNollup
            value: {}
        },
        {
            name: 'spassr.ssr',
            condition: (app, params, ctx) => !app.state.production && !ctx.isNollup
            value: {ssr: true}
        }
    ]
}
```

### Editing

```javascript
app.config.rollup.plugins.find(
  (p) => p.name === 'spassr.ssr',
).value.inlineDynamicImports = true
```

---

## Object key mapping - included logic

\- too verbose

\- assigning to value is weird

### Template

```javascript
rollup = {
    input: 'src/main.js',
    plugins: {
        livereload: {
            condition: (app, params, ctx) => !app.state.production && !ctx.isNollup
            value: 'dist',
        },
        spassr: {
            condition: (app, params, ctx) => !app.state.production && !ctx.isNollup
            value: {}
        },
        'spassr.ssr': {
            condition: (app, params, ctx) => !app.state.production && !ctx.isNollup
            value: {ssr: true}
        }
    }
}
```

### Editing

```javascript
app.config.rollup.plugins.spassr.value.inlineDynamicImports = true
```

---

## Object key mapping - abstracted logic

\+ no accidental enabling plugin by assigning values

\+ values are not lost if disabled by one plugin and reenabled by another

\- more boilerplate

\- less straightforward

### Template

```javascript
rollup = {
  input: 'src/main.js',
  plugins: {
    livereload: 'dist',
    spassr: {}
    'spassr.ssr': {ssr: true},
  },
  conditions: {
      livereload: !production && !isNollup,
      spassr: !production && !isNollup,
      'spassr.ssr': !production && !isNollup,
  },
}
```

### Editing

```javascript
app.config.rollup.plugins.spassr.inlineDynamicImports = true
```

---

## Object key mapping - rollup logic

\+ less boilerplate

\+ simple logic, aligns with rollup's

\- assigning values to a plugin enables it

\- values are lost if disabled by one plugin and reenabled by another

```javascript
rollup = {
  input: 'src/main.js',
  plugins: {
    livereload: !production && !isNollup && 'dist',
    spassr: !production && !isNollup && {}
    'spassr.ssr': !production && !isNollup && {ssr: true},
  },
}
```

### Editing

```javascript
app.config.rollup.plugins.spassr.inlineDynamicImports = true
```


## Compiling

All of the examples above would be compiled in the same fashion

```javascript
import { spassr } from 'spassr'
import livereload from 'livereload'

const { rollup } = app.config
const map = { spassr, livereload }

rollup.plugins = app.normalizeConfigArray(rollup.plugins, map)
```
