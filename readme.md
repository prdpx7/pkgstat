# pkgstat

> Get metadata of package from node, python and ruby.

[![Build Status](https://travis-ci.org/prdpx7/pkgstat.svg?branch=master)](https://travis-ci.org/prdpx7/pkgstat) 
[![MITlicensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/prdpx7/pkgstat/master/LICENSE)

## Install
```
$ npm install --save pkgstat
```
## Usage
```js
const pkgstat = require('pkgstat');
pkgstat("django", "python")
    .then(resp => {
        console.log(resp);
        /*
        { 
            name: 'Django',
            author: 'Django Software Foundation',
            description: 'A high-level Python Web framework....',
            url: 'http://pypi.python.org/pypi/Django',
            source: 'https://www.djangoproject.com/',
            license: 'BSD',
            version: '1.11rc1',
            statusCode: 200 
        }
        */
    });
pkgstat("somePkgWhichDoesNotExist","node")
    .then(resp => {
        console.log(resp);
        //{statusCode: 404}
    });
pkgstat("request","ruby")
    .then(resp => {
        console.log(resp);
        /*
        {
            name: 'request',
            author: 'Markus Schirp',
            description: 'HTTP request porofication',
            url: 'https://rubygems.org/gems/request',
            source: null,
            license: 'MIT',
            version: '0.0.6',
            statusCode: 200 
        }
        */
    });
```
