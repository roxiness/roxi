const { keysAsFunctionsRecursive } = require("..");

const fn = async val => ({ ...val, touched: true })
const getBaseObj = () => ({
  aPlugin: {
    string: 'abc',
    number: 123,
    obj: { foo: 'bar' },
    target$map: { fn },
    target: {
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

it('processes children first', async () => {
  const config = getBaseObj()
  config.aPlugin.target.fn.child = { fn: { isTarget: true, touched: false } }
  config.aPlugin.target.fn.child$map = { fn }


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
