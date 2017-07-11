# elicit

Elicit is a JavaScript library intended to speed up the consumption
of HTML pages by allowing for their quick transform into usable formats.

## Installation

```shell
$ npm install elicitjs
```
## Basic Usage

Let's suppose there's a webpage, `http://somewebpage.com` with the following
markup:

```html
<html>
  <div>
    <a href='http://link1.com'>link1 text</a>
  </div>
  <div>
    <a href='http://link2.com'>link2 text</a>
  </div>
  <div>
    <a href='http://link3.com'>link3 text</a>
  </div>
  <div>
    <a href='http://link4.com'>link4 text</a>
  </div>
</html>
```

To pull out all of these links in a useful format, we can do the following:

```js
const elicit = require('elicitjs');

elicit('http://somewebpage.com')
  .collection('div', {
    title: 'a',
    href: 'a/href'
  })
  .tap(console.log)

/**
 * [
 *   { title: 'link1 text', href: 'http://link1.com'},
 *   { title: 'link2 text', href: 'http://link2.com'},
 *   { title: 'link3 text', href: 'http://link3.com'},
 *   { title: 'link4 text', href: 'http://link4.com'}
 * ]
 */
```