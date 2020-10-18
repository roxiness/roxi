const { sortHooks } = require("..");

const hooks = [
  { hook: { order: [] }, plugin: { name: 'pluginB' } },
  { hook: { order: [] }, plugin: { name: 'pluginD' } },
  { hook: { order: { before: 'pluginD' } }, plugin: { name: 'pluginC' } },
  { hook: { order: [] }, plugin: { name: 'pluginE' } },
  { hook: { order: [{ after: 'pluginG' }] }, plugin: { name: 'pluginH' } },
  { hook: { order: [] }, plugin: { name: 'pluginF' } },
  { hook: { order: [{ last: true }] }, plugin: { name: 'last1' } },
  { hook: { order: [{ last: true }] }, plugin: { name: 'last2' } },
  { hook: { order: [{ after: 'last1' }] }, plugin: { name: 'afterLast1' } },
  { hook: { order: [] }, plugin: { name: 'pluginG' } },
  { hook: { order: { first: true } }, plugin: { name: 'first' } },
  { hook: { order: { before: 'first' } }, plugin: { name: 'beforeFirst' } },
]

it('sorts hooks', () => {
  const sortedHooks = sortHooks(hooks)

  expect(sortedHooks.map(hook => hook.plugin.name)).toEqual([
    'beforeFirst', 'first', 'pluginB', 'pluginC', 'pluginD', 'pluginE', 'pluginF', 'pluginG', 'pluginH',
    'last1',
    'afterLast1',
    'last2',
  ])
})

it('throws error for infinite loops', () => {
  const breaker1 = { hook: { order: [{ before: 'beforeBreaker2' }] }, plugin: { name: 'beforeBreaker1' } }
  const breaker2 = { hook: { order: [{ before: 'beforeBreaker1' }] }, plugin: { name: 'beforeBreaker2' } }
  expect(()=>{
    sortHooks([...hooks, breaker1, breaker2])
  }).toThrow('infinite loop')
})
