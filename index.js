'use strict'
const got = require('got')
const npm = 'https://registry.npmjs.org/pkg_name'
const npmdlCountApi = 'https://api.npmjs.org/downloads/range/'
const pypi = 'https://pypi.python.org/pypi/pkg_name/json'
const rubygems = 'https://rubygems.org/api/v1/gems/pkg_name.json'

function lastThirtyDays () {
  var milliseconds = 30 * 24 * 60 * 60 * 1000
  var startDate = new Date(Date.now() - milliseconds)
  var endDate = new Date(Date.now())
  return {
    'start': startDate.toISOString().substr(0, 10),
    'end': endDate.toISOString().substr(0, 10)
  }
}
function extractMetaData (jsonData, language, totalDownloadsLastMonth, error) {
  var pkgMeta = {}

  if (language === 'ruby') {
    pkgMeta.name = jsonData.name
    pkgMeta.author = jsonData.authors
    pkgMeta.description = jsonData.info
    pkgMeta.url = jsonData.project_uri
    pkgMeta.source = jsonData.source_code_uri
    pkgMeta.license = jsonData.licenses ? jsonData.licenses.join(', ') : 'None'
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
    pkgMeta.totalDownloadsLastMonth = totalDownloadsLastMonth || 'NA'
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
function calculateDownloadCounts (pkgName, respMetadata) {
  const dates = lastThirtyDays()
  const headers = {'User-Agent': 'got-node-module'}
  const url = npmdlCountApi + `${dates.start}:${dates.end}/${pkgName}`
  return got(url, {json: true, headers})
          .then(resp => {
            var arrDownloads = resp.body.downloads
            var totalDownloadsLastMonth = arrDownloads.reduce((x, y) => {
              return {downloads: x.downloads + y.downloads}
            })
            return extractMetaData(respMetadata, 'node', totalDownloadsLastMonth.downloads)
          })
          .catch(err => {
            // console.log(err)
            return extractMetaData(respMetadata, 'node', 'NA', err)
          })
}
module.exports = (name, language) => {
  const url = setPkgURL(name, language)
  const headers = {'User-Agent': 'got-node-module'}
  return got(url, {json: true, headers})
            .then(resp => {
              // console.log(resp)
              if (language === 'node') {
                return calculateDownloadCounts(name, resp.body)
              } else {
                return extractMetaData(resp.body, language)
              }
            })
            .catch(err => {
              // console.log(err)
              return {statusCode: err.statusCode}
            })
}
