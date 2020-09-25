const { deepAssign } = require("..");

// todo put in a test


// console.log(deepAssign(obj1, obj2))
it('merges objects correctly', async () => {
  const obj1 = {
    shallow: 'foo',
    willBeNull: true,
    deep: {
      foo: 'bar',
      arr: [1, 2, 3]
    }
  }
  const obj2 = {
    shallow: 'bar',
    willBeNull: null,
    deep: {
      baz: 'bar',
      arr: [3, 4, 5]
    }
  }
  const expected = {
    shallow: 'bar',
    willBeNull: null,
    deep: {
      foo: 'bar',
      baz: 'bar',
      arr: [1, 2, 3, 3, 4, 5]
    }
  }

  const res = deepAssign(obj1, obj2)

  expect(res).toEqual(obj1)
  expect(res).toEqual(expected)
})
