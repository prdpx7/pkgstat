import test from 'ava'
import pkgstat from '.'
test('somePkgWhichDoesNotExist in someLanguageWhichDoesNotExist', async t => {
  const data = await pkgstat('somePkgWhichDoesNotExist', 'someLanguageWhichDoesNotExist')
  t.is(data.statusCode, 404)
})

test('cleanslate pkg exists in python(pip)', async t => {
  const data = await pkgstat('cleanslate', 'python')
  t.is(data.author, 'Pradeep Khileri')
})

test('someXXXRandomXXXPkgName pkg does not exists in python(pip)', async t => {
  const data = await pkgstat('someXXXRandomXXXPkgName', 'python')
  t.is(data.statusCode, 404)
})

test('express pkg  exists in node(npm)', async t => {
  const data = await pkgstat('express', 'node')
  t.is(data.statusCode, 200)
})

test('someXXXRandomXXXPkgName pkg does not exists in node(npm)', async t => {
  const data = await pkgstat('someXXXRandomXXXPkgName', 'node')
  t.is(data.statusCode, 404)
})

test('tweep pkg in ruby(gem)', async t => {
  const data = await pkgstat('tweep', 'ruby')
  // console.log(data)
  t.is(data.statusCode, 200)
})

test('someXXXRandomXXXPkgName pkg does not exists in ruby(gem)', async t => {
  const data = await pkgstat('someXXXRandomXXXPkgName', 'ruby')
  t.is(data.statusCode, 404)
})
