'use strict'
const got = require('got')
const npm = 'https://registry.npmjs.org/pkg_name'
const pypi = 'https://pypi.python.org/pypi/pkg_name/json'
const rubygems = 'https://rubygems.org/api/v1/gems/pkg_name.json'
function extractMetaData (jsonData, language) {
  var pkgMeta = {}
  if (language === 'ruby') {
    pkgMeta.name = jsonData.name
    pkgMeta.author = jsonData.authors
    pkgMeta.description = jsonData.info
    pkgMeta.url = jsonData.project_uri
    pkgMeta.source = jsonData.source_code_uri
    pkgMeta.license = jsonData.licenses.join(', ')
    pkgMeta.version = jsonData.version
  } else if (language === 'python') {
    pkgMeta.name = jsonData.info.name
    pkgMeta.author = jsonData.info.author
    pkgMeta.description = jsonData.info.summary
    pkgMeta.url = jsonData.info.package_url
    pkgMeta.source = jsonData.info.home_page
    pkgMeta.license = jsonData.info.license
    pkgMeta.version = jsonData.info.version
  } else if (language === 'node') {
    jsonData = jsonData.versions[jsonData['dist-tags'].latest]
    pkgMeta.name = jsonData.name || 'Unknown'
    pkgMeta.version = jsonData.version || 'Unknown'
    pkgMeta.author = jsonData.author ? jsonData.author.name : 'Unknown'
    pkgMeta.description = jsonData.description || 'Unknown'
    pkgMeta.url = 'https://www.npmjs.com/package/' + jsonData.name
    pkgMeta.source = jsonData.repository ? jsonData.repository.url : 'Unknown'
    pkgMeta.license = jsonData.license || 'Unknown'
  }
  pkgMeta.statusCode = 200
  return pkgMeta
}
function setPkgURL (name, language) {
  language = language.toLowerCase()
  var url = ''
  if (language === 'ruby') {
    url = rubygems.replace('pkg_name', name)
  } else if (language === 'node') {
    url = npm.replace('pkg_name', name)
  } else if (language === 'python') {
    url = pypi.replace('pkg_name', name)
  } else { url = 'http://example.com/404' }
  return url
}
module.exports = (name, language) => {
  const url = setPkgURL(name, language)
  const headers = {'User-Agent': 'got-node-module'}
  return got(url, {json: true, headers})
            .then(resp => {
              return extractMetaData(resp.body, language)
            })
            .catch(err => {
              // console.log(err)
              return {statusCode: err.statusCode}
            })
}
