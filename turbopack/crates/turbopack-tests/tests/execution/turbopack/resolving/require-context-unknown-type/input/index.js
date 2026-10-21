// A context that matches a file without a module type must report an error at
// the `require.context()` call. The value of this test is the `issues/` snapshot.
const ctx = require.context('./content', false, /\.txt$/)

it('should list the file', () => {
  expect(ctx.keys()).toEqual(['./gamma.txt'])
})
