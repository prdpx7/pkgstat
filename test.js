import test from 'ava';
import pkgstat from '.';
test('cleanslate pkg in python(pip)', async t =>{
    const data = await pkgstat('cleanslate','python');
    t.is(data.author,'Pradeep Khileri');
});
test('somePkgWhichDoesNotExist in someLanguageWhichDoesNotExist', async t =>{
    const data = await pkgstat('somePkgWhichDoesNotExist','someLanguageWhichDoesNotExist');
    t.is(data.status,404);
});
test('someXXXRandomXXXPkgName pkg does not exists in node(npm)', async t =>{
    const data = await pkgstat('someXXXRandomXXXPkgName','node');
    t.is(data.status,404);
});
test('rails pkg in ruby(gem)', async t => {
    const data = await pkgstat('rails', 'ruby');
    t.is(data.status, 200);
});