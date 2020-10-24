const { keysAsFunctionsRecursive } = require("..");

const fn = async val => ({ ...val, touched: true })
const getBaseObj = () => ({
  aPlugin: {
    string: 'abc',
    number: 123,
    obj: { foo: 'bar' },
    target$map: { fn },
    target$options: {
      fn: { isTarget: true, touched: false }
    }
  }
})

it('converts objects to arrays', async () => {
  const config = getBaseObj()
  const result = await keysAsFunctionsRecursive(config)

  expect(result).toEqual({
    aPlugin: {
      string: 'abc',
      number: 123,
      obj: { foo: 'bar' },
      target: [
        {
          "isTarget": true,
          "touched": true,
        },
      ]
    }
  })
})

// target$options will not exist if child is parsed last.
it('processes children first', async () => {
  const config = getBaseObj()
  config.aPlugin.target$options.fn.child$options = { fn: { isTarget: true, touched: false } }
  config.aPlugin.target$options.fn.child$map = { fn }


  const result = await keysAsFunctionsRecursive(config)

  expect(result).toEqual({
    aPlugin: {
      string: 'abc',
      number: 123,
      obj: { foo: 'bar' },
      target: [
        {
          isTarget: true,
          touched: true,
          child: [{
            isTarget: true,
            touched: true,
          }]
        },
      ]
    }
  })
})
