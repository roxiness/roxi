const { keysAsFunctions } = require("..");

it('merges objects correctly', async () => {
  const plugins = {
    simple: 'foo',
    doubleUse: 'foo',
    'doubleUse.alt': 'foo.alt',
    badNoFn: 'foo',
    _correctNoFn: 'foo'
  }
  const map = {
    simple: val => `${val}-simple`,
    doubleUse: val => `${val}-doubleUse`
  }

  const result = await keysAsFunctions(plugins, map)

  expect(result).toEqual([
    'foo-simple',
    'foo-doubleUse',
    'foo.alt-doubleUse',
    'foo',
    'foo',
  ])
})
