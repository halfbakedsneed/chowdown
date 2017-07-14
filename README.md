# chowdown

[![Build Status](https://travis-ci.org/halfbakedsneed/chowdown.svg?branch=master)](https://travis-ci.org/halfbakedsneed/chowdown)
[![Dependencies](https://david-dm.org/halfbakedsneed/chowdown.svg)](https://david-dm.org/halfbakedsneed/chowdown)
[![Coverage](https://coveralls.io/repos/github/halfbakedsneed/chowdown/badge.svg?branch=master)](https://coveralls.io/github/halfbakedsneed/chowdown?branch=master)

A JavaScript library that allows for the quick transformation of DOM documents into useful formats.

## <a name="table-of-contents"></a> Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
  - [Attributes](#attributes)
  - [Nesting](#nesting)
  - [Querying](#querying)
- [Creating Scopes](#creating-scopes)
  - [chowdown.request](#request)
  - [chowdown.file](#file)
  - [chowdown.body](#body)
- [Using Scopes](#using-scopes)
  - [scope.string](#string)
  - [scope.number](#number)
  - [scope.collection](#collection)
  - [scope.object](#object)
  - [scope.raw](#raw)
  - [scope.regex](#regex)
  - [scope.context](#context)
  - [scope.link](#link)
  - [scope.follow](#follow)

## <a name="installation"></a> Installation

```shell
$ npm install chowdown
```
## <a name="basic-usage"></a> Basic Usage

Let's suppose there's a webpage, `http://somewebpage.com` with the following
markup:

<a name="sample-markup"></a>

```html
<div class="author">
  <a href="/dennis" class="name">Dennis Reynolds</a>
  <span class="age">41</span>
  <img src="dennis.jpg"/>
  <div class="book">
    <span class="title">The Dennis System</span>
    <span class="year">2009</span>
  </div>
  <div class="book">
    <span class="title">Chardee MacDennis: A Guide</span>
    <span class="year">2011</span>
  </div>
</div>
<div class="author">
  <a href="/stephen" class="name">Stephen King</a>
  <span class="age">69</span>
  <img src="stephen.jpg"/>
  <div class="book">
    <span class="title">Clown Town</span>
    <span class="year">1990</span>
  </div>
</div>
```

To quickly pull out the name and age of each author into an
array of objects, we can do the following:

```js
const chowdown = require('chowdown');

// Returns a promise
chowdown('http://somewebpage.com')
  .collection('.author', {
    name: '.name',
    age: '.age'
  });
```

This will resolve to:

```js
[
  { name: 'Dennis Reynolds', age: '41'},
  { name: 'Stephen King', age: '69'}
]
```

All chowdown queries return an instance of a [bluebird](https://github.com/petkaantonov/bluebird) Promise.

### <a name="attributes"></a> Attributes

Chowdown is built on top of [cheerio](https://github.com/cheeriojs/cheerio) and hence it uses the familiar jQuery selector format. 
However, chowdown's selectors also make it possible to get a DOM element's attribute by appending the attribute's name to the end of a selector (following a `/`).

This makes getting the `src` attribute of each author's image easy:

```js
chowdown('http://somewebpage.com')
  .collection('.author', {
    name: '.name',
    age: '.age',
    image: 'img/src'
  });
```

This will resolve to:

```js
[
  { name: 'Dennis Reynolds', age: '41', image: 'dennis.jpg'},
  { name: 'Stephen King', age: '69', image: 'stephen.jpg'}
]
```

If no attribute is specified in the selector when querying for simple types of values (i.e a `string` or a `number`), then chowdown will automatically grab the element's inner text.

### <a name="nesting"></a> Nesting

Using chowdown, we can construct much more complex queries. By passing
a callback in place of a selector, we have the ability to customise inner queries.

If we wanted to retrieve each of the author's books, we could do the following:

```js
chowdown('http://somewebpage.com')
  .collection('.author', {
    name: '.name',
    age: '.age',
    books: (author) => author.collection('.book', {
      title: '.title',
      year: '.year'
    })
  });
```

This will resolve to:

```js
[
  { 
    name: 'Dennis Reynolds',
    age: '41',
    books: [
      {
        title: 'The Dennis System',
        year: '2009'
      },
      {
        title: 'Chardee MacDennis: A Guide',
        year: '2011'
      }
    ]
  },
  { 
    name: 'Stephen King',
    age: '69',
    books: [
      {
        title: 'Clown Town',
        year: '1990'
      }
    ]
  }
]
```

Every callback is passed a [`Scope`](#using-scopes) object (the same type of object that is returned from the main `chowdown` function).
It has methods allowing you to query the document (relative to a context) for different things.

### <a name="querying"></a> Querying

As seen above, it's possible to take shortcuts to describe queries. Anywhere a
string is found in place of a function, it will be used as the `selector` parameter in a [string query](#string):

```js
let scope = chowdown('http://somewebpage.com');

scope.collection('.author', '.name')
// => Resolves to: ['Dennis Reynolds', 'Stephen King']

scope.collection('.author', (author) => author.string('.name'))
// => Resolves to: ['Dennis Reynolds', 'Stephen King']
```

Likewise, anywhere an object is found in place of a function, it will be used as the `pick`
parameter in an [object query](#object).

```js
let scope = chowdown('http://somewebpage.com');

scope.collection('.author', {name: '.name'})
// => Resolves to: [{name: 'Dennis Reynolds'}, {name: 'Stephen King'}]

scope.collection('.author', (author) => author.object({name: '.name'}))
// => Resolves to: [{name: 'Dennis Reynolds'}, {name: 'Stephen King'}]
```

## <a name="creating-scopes"></a> Creating Scopes

The library's main function is actually an alias for `chowdown.request`; this is one of three functions that
allow for the creation of [`Scope`](#using-scopes) objects:

### <a name="request"></a> chowdown.request(request, [options])
----

Issues a request using [`request-promise`](https://github.com/request/request-promise) with the given
request object or uri string and returns a [`Scope`](#using-scopes) created from the response.

#### Parameters
- `request` `{string|object}` Either a uri or a request object that will be passed to `request-promise`. 
- `[options]` `{object}` An object of configuration options.
  - `[client=rp]` `{function}` A client function to use in place of `request-promise`. It will be passed
  a request object or uri and should return a promise that resolves to a `string` or `cheerio` object.

#### Returns
- [`Scope`](#using-scopes) A scope wrapping the response of the request.

### <a name="file"></a> chowdown.file(file)
----

Reads from the file located at `file` and returns a [`Scope`](#using-scopes)
created from the contents of the file.

#### Parameters
- `file` `{string}` The filename. 

#### Returns
- [`Scope`](#using-scopes) A scope wrapping the file's contents.

### <a name="body"></a> chowdown.body(body)
----

Load a DOM document directly from a cheerio object or string and returns
a [`Scope`](#using-scopes) created from this document.

#### Parameters
- `body` `{cheerio|string}` Either an existing cheerio object
or a DOM string. 

#### Returns
- [`Scope`](#using-scopes) A scope wrapping the body.

## <a name="using-scopes"></a> Using Scopes

A Scope is an object that wraps a document (or part of a document) and allows for the querying of different types of values:

- [scope.string](#string)
- [scope.number](#number)
- [scope.collection](#collection)
- [scope.object](#object)
- [scope.raw](#raw)
- [scope.regex](#regex)
- [scope.context](#context)
- [scope.link](#link)
- [scope.follow](#follow)

__All of the following examples use the same sample uri and markup as [before](#sample-markup).__

### <a name="string"></a> scope.string(selector, [options])
----

Queries the document for a `string` using the given `selector`.
Any retrieved non-string value will be coerced into a `string`.

#### Parameters
- `selector` `{string}` A selector to find the string in the document.
- `[options]` `{object}` An object of configuration options.
  - `[default='']` `{string}` The default value to return if no string is found.
  - `[throwOnMissing=false]` `{boolean}` A flag that dictates whether or not to throw an error if no string is found.
  - `[format=[]]` `{function|function[]}` A function or array of functions used to format the retrieved string.

#### Returns
- `Promise<string>` A promise that resolves to a string.

#### Example

```js
let scope = chowdown.request('http://somewebpage.com');

scope.string('.author:nth-child(1) .name');
```

This will resolve to:

```js
'Dennis Reynolds'
```

### <a name="number"></a> scope.number(selector, [options])
----

Queries the document for a `number` using the given `selector`.
Any retrieved non-number value will be coerced into a `number`.

#### Parameters
- `selector` `{string}` A selector to find the number in the document.
- `[options]` `{object}` An object of configuration options.
  - `[default=NaN]` `{number}` The default value to return if no number is found.
  - See [scope.string](#string) for other possible options.

#### Returns
- `Promise<number>` A promise that resolves to a number.

#### Example

```js
let scope = chowdown.request('http://somewebpage.com');

scope.number('.author:nth-child(1) .age');
```

This will resolve to:

```js
41
```

### <a name="collection"></a> scope.collection(selector, inner, [options])
-----

This will query the document for an `array` of values such that each value in the array is the result of the `inner` query
executed on a child document. The set of child documents is pointed to by the `selector` parameter.

#### Parameters
- `selector` `{string}` A selector to find the number in the document.
- `inner` `{string|object|function}` The inner query.
- `[options]` `{object}` An object of configuration options.
  - `[default=[]]` `{any[]}` The default value to return if no child documents are found.
  - `[filter]` `{function}` A function used to filter the resulting array. Every item in the array
  is passed through this function and the values for which the function is truthy are kept.
  - See [scope.string](#string) for other possible options.

#### Returns
- `Promise<any[]>` A promise resolving to an array of the inner query results.

#### Example

```js
let scope = chowdown.request('http://somewebpage.com');

scope.collection('.author', (author) => author.number('.age'));
```

This will resolve to:

```js
[41, 69]
```

### <a name="object"></a> scope.object(pick, [options])
----

Queries the document for an object by mapping the results of inner queries (the values in the `pick` parameter) to their
corresponding keys.

#### Parameters
- `pick` `{object}` The object of queries to map.
- `[options]` `{object}` An object of configuration options.
  - See [scope.string](#string) for possible options.

#### Returns
- `Promise<object>` A promise that resolves to the collection.

#### Example

```js
let scope = chowdown.request('http://somewebpage.com');

scope.object({
  name: (document) => document.string('.author:nth-child(1) .name'),
  age: (document) => document.number('.author:nth-child(1) .age')
});
```

This will resolve to:

```js
{
  name: 'Dennis Reynolds',
  age: 41
}
```

### <a name="raw"></a> scope.raw(fn, [options])
----

This will call `fn` with the underlying cheerio function
and a cheerio context. It will return a promise that resolves to the result of this call.

#### Parameters
- `fn` `{function}` The raw function to be called and passed the cheerio instance.
- `[options]` `{object}` An object of configuration options.
  - `[default=undefined]` `{any}` The default value to return if undefined is returned from the function.
  - See [scope.string](#string) for other possible options.

#### Returns
- `Promise<any>` A promise that resolves to the result of the raw function.

#### Example

```js
let scope = chowdown.request('http://somewebpage.com');

scope.raw(($, context) => $('.author:nth-child(2) .name').text());
```

This will resolve to:

```js
'Stephen King'
```

### <a name="regex"></a> scope.regex(selector, pattern, [group], [options])
----

This will query the document for a `string` using the given `selector` and 
perform a regex match on it using `pattern`.

#### Parameters
- `selector` `{string}` A selector to find the string in the document.
- `pattern` `{RegExp}` The pattern used to match on the retrieved string.
- `[group]` `{number}` The number of a matched group to return.
- `[options]` `{object}` An object of configuration options.
  - `[default=[]]` `{any[]}` The default value to return if no matches are made.
  - See [scope.string](#string) for other possible options.

#### Returns
- `Promise<string|string[]>` A promise that resolves to the matched group(s).

#### Example

```js
let scope = chowdown.request('http://somewebpage.com');

scope.regex('.author:nth-child(2)', /(Stephen) (.*)/);
```

This will resolve to (roughly):

```js
['Stephen King', 'Stephen', 'King']
```

If we want a specific group:

```js
scope.regex('.author:nth-child(2)', /(Stephen) (.*)/, 2);
```

This will resolve to:

```js
'King'
```

### <a name="context"></a> scope.context(selector, inner, [options])
----

This will query the document for a child document using the given `selector` and 
return the result of the `inner` query executed on this child document.

#### Parameters
- `selector` `{string}` A selector to find the child document.
- `inner` `{string|object|function}` The inner query to execute on the child document.
- `[options]` `{object}` An object of configuration options.
  - `[default=undefined]` `{any}` The default value to return if the context can't be found.
  - See [scope.string](#string) for other possible options.

#### Returns
- `Promise<any>` A promise that resolves to the result of the `inner` query
executed on the child document.

#### Example

```js
let scope = chowdown.request('http://somewebpage.com');

scope.context('.author:nth-child(1) .book:nth-of-type(1)', (book) =>
  book.object({
    title: '.title',
    year: (book) => book.number('.year')
  })
);
```

This will resolve to:

```js
{
  title: 'The Dennis System',
  year: 2009
}
```

### <a name="uri"></a> scope.uri(selector, [base], [options])
----

This will query the document for a uri using the given `selector` and 
resolve it relative to the given `base` uri. Will automatically attempt to grab the `href` attribute of the
element specified by `selector`.

#### Parameters
- `selector` `{string}` A selector to find the uri.
- `[base]` `{string}` The base uri for the retrieved uri.
- `[options]` `{object}` An object of configuration options.
  - See [scope.string](#string) for possible options.

#### Returns
- `Promise<any>` A promise that resolves to the constructed uri.

#### Example

```js
let scope = chowdown.request('http://somewebpage.com');

scope.uri('.author:nth-child(1) .name', 'http://somewebpage.com');
```

This will resolve to:

```js
'http://somewebpage.com/dennis'
```

### <a name="follow"></a> scope.follow(uri, inner, [options])
----

This will follow the uri pointed to by the `uri` query and execute the `inner` query
on the document at this uri.

#### Parameters
- `uri` `{string|object|function}` A query to find the uri.
- `inner` `{string|object|function}` A query to execute on the documet at the uri.
- `[options]` `{object}` An object of configuration options.
  - `[default=undefined]` `{any}` The default value to return if there's an error accessing the page.
  - `[client=rp]` `{function}` A client function to use in place of `request-promise`. It will be passed
  a request object or uri and should return a promise that resolves to a `string` or `cheerio` object.
  - `[request]` `{object}` An object of other request options to pass to `client`.
  - See [scope.string](#string) for other possible options.

#### Returns
- `Promise<any>` The result of the `inner` query executed on the document at `uri`.

#### Example

In the [sample markup](#sample-markup) (for the uri `http://somewebpage.com`), we can see the first author's `div` contains a link to `http://somewebpage.com/dennis`.
Let's assume the markup at this uri is as follows:

```html
<a id="favourite-food">DeVitos</a>
```

We can use a follow query to read such important information like this:

```js
let scope = chowdown.request('http://somewebpage.com');

scope.follow(
  (doc) => doc.uri('.author:nth-child(1) .name'),
  (otherPage) => otherPage.string('#favourite-food')
);
```

This will resolve to:

```js
'DeVitos'
```

## <a name="testing"></a> Testing

To run the tests included with chowdown, run the following
from the root of the package:

```shell
$ npm run test
```

## <a name="License"></a> License (ISC)

See the [LICENSE file](LICENSE) for details.
