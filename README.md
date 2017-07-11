# elicit

Elicit is a JavaScript library intended to speed up the consumption
of DOM pages by allowing for their quick transform into more usable formats.

## Installation

```shell
$ npm install elicitjs
```
## Basic Usage

Let's suppose there's a webpage, `http://somewebpage.com` with the following
markup:

```html
<div class="author">
  <span class="name">Dennis Reynolds</span>
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
  <span class="name">Stephen King</span>
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
const elicit = require('elicitjs');

// Returns a promise
elicit('http://somewebpage.com')
  .collection('.author', {
    name: '.name',
    age: '.age'
  });
```

Resolves to:

```js
[
  { name: 'Dennis Reynolds', age: '41'},
  { name: 'Stephen King', age: '69'}
]
```

All elicit queries return [bluebird Promises](https://github.com/petkaantonov/bluebird).

### Attributes

Elicit is built on top of [cheerio](https://github.com/cheeriojs/cheerio) and hence it uses the familiar jQuery selector format. 
However, it's also possible to get an element's attribute by appending the attribute's name to the end of a selector (following a `/`).

This makes getting the `src` attribute of each author's image easy:

```js
elicit('http://somewebpage.com')
  .collection('.author', {
    name: '.name',
    age: '.age',
    image: 'img/src'
  });
```

Resolves to:

```js
[
  { name: 'Dennis Reynolds', age: '41', image: 'dennis.jpg'},
  { name: 'Stephen King', age: '69', image: 'stephen.jpg'}
]
```

When querying for simple types of values (`string`s and `number`s),
if no attribute is specified in the selector then elicit will automatically grab the element's inner text.

### Nesting

Using elicit, we can construct much more complex queries. By passing
a callback in place of a selector, we have the ability to customise inner queries.

Let's say we also want to retrieve each of the author's books:

```js
elicit('http://somewebpage.com')
  .collection('.author', {
    name: '.name',
    age: (author) => author.number('.age'),
    books: (author) => author.collection('.book', {
      title: '.title',
      year: (book) => book.number('.year')
    })
  });
```

Resolves to:

```js
[
  { 
    name: 'Dennis Reynolds',
    age: 41,
    books: [
      {
        title: 'The Dennis System',
        year: 2009
      },
      {
        title: 'Chardee MacDennis: A Guide',
        year: 2011
      }
    ]
  },
  { 
    name: 'Stephen King',
    age: 69,
    books: [
      {
        title: 'Clown Town',
        year: 1990
      }
    ]
  }
]
```

Every callback is passed a [`Scope`](#using-scopes) object (the same object that is returned from the main `elicit` function).
It has methods allowing you to query the document (relative to the scope) for different things.

### Implicit query creation

As seen above, it's possible to take shortcuts to describe queries.

Anywhere a string is found in place of an inner query, it will be used as the `selector` parameter in a string query:

```js
let scope = elicit('http://somewebpage.com');

scope.collection('.author', '.name')
// => ['Dennis Reynolds', 'Stephen King']

scope.collection('.author', (author) => author.string('.name'))
// => ['Dennis Reynolds', 'Stephen King']
```

Likewise, anywhere an object is found in place of an inner query, it will be used as the `pick`
parameter in a object query.

```js
let scope = elicit('http://somewebpage.com');

scope.collection('.author', {name: '.name'})
// => [{name: 'Dennis Reynolds'}, {name: 'Stephen King'}]

scope.collection('.author', (author) => author.object({name: '.name'}))
// => [{name: 'Dennis Reynolds'}, {name: 'Stephen King'}]
```

## Creating a scope

The library's main function is actually an alias for `elicit.request`; this is one of three functions that
allow for the creation of [`Scope`](#using-scopes) objects:

### `elicit.request(request, [options])`

Issues a request using [`request-promise`](http://github.com/) with the given
request object or uri string.

#### Parameters
- `request` *`string|object`* Either a uri or a request object that will be passed to `request-promise`. 
- `[options]` *`object`* An object of configuration options.
  - `[client]` *`function`* A client function to use in place of `request-promise`. It will be passed
  a request object or uri and should return a promise that resolves to a `string` or `cheerio` object.

#### Returns
- [*`Scope`*](#using-scopes) A scope wrapping the response of the request.

### `elicit.file(file)`

Reads from the file located at the given filename.

#### Parameters
- `file` *`{string}`* The filename. 

#### Returns
- [*`Scope`*](#using-scopes) A scope wrapping the file's contents.

### `elicit.body(body)`

Load a DOM document directly from a cheerio object or string.

#### Parameters
- `body` *`{cheerio|string}`* Either an existing cheerio object
or a DOM string. 

#### Returns
- [*`Scope`*](#using-scopes) A scope wrapping the body.

## Using Scopes

A Scope is an object that wraps a document (or part of a document) and allows you to query the document for different types of values:

- [`scope.string`](#string)
- [`scope.number`](#number)
- [`scope.collection`](#collection)
- [`scope.object`](#object)
- [`scope.raw`](#raw)
- [`scope.regex`](#regex)
- [`scope.context`](#context)
- [`scope.link`](#link)
- [`scope.follow`](#follow)

All of the following examples will be using the same sample markup as before.

### `scope.string(selector, [options])`

Queries the document for a `string` using the given selector.
Any retrieved non-string value will be coerced into a `string`.

#### Parameters
- `selector` *`{string}`* A selector to find the string in the document.
- `[options]` *`{object}`* An object of configuration options.
  - `[default='']` *`{string}`* The default value to return if no string is found.
  - `[throwOnMissing=false]` *`{boolean}`* A flag that dictates whether or not to throw an error if no string is found.
  - `[format=[]]` *`{function|function[]}`* A function or array of functions used to format the retrieved string.

#### Returns
- *`Promise<string>`* A promise that resolves to a string.

#### Example

```js
let scope = elicit.request('http://somewebpage.com');

scope.string('.author:nth-child(1) .name');
```

Resolves to:

```js
'Dennis Reynolds'
```

### `scope.number(selector, [options])`

Queries the document for a `number` using the given selector.
Any retrieved non-number value will be coerced into a `number`.

#### Parameters
- `selector` *`{string}`* A selector to find the number in the document.
- `[options]` *`{object}`* An object of configuration options.
  - `[default=NaN]` *`{number}`* The default value to return if no number is found.

#### Returns
- *`Promise<number>`* A promise that resolves to a number.

#### Example

```js
let scope = elicit.request('http://somewebpage.com');

scope.number('.author:nth-child(1) .age');
```

Resolves to:

```js
41
```

### `scope.collection(selector, inner, [options])`

This will query the document for an `array` of values such that each value is the result of the `inner` query
executed on a child document.

The set of child documents is pointed to by the `selector` parameter.

#### Parameters
- `selector` *`{string}`* A selector to find the number in the document.
- `inner` *`{string|object|function}`* The inner query.
- `[options]` *`{object}`* An object of configuration options.
  - `[default=[]]` *`{any[]}`* The default value to return if no child documents are found.
  - `[filter]` *`{function}`* A function used to filter the resulting array. Every item in the array
  is passed through this function and the values for which the function is truthy are kept.

#### Returns
- *`Promise<any[]>`* A promise resolving to an array of the inner query results.

#### Example

```js
let scope = elicit.request('http://somewebpage.com');

scope.collection('.author', (author) => author.number('.age'));
```

Resolves to:

```js
[41, 69]
```

### `scope.object(pick, [options])`

This will map the values (inner queries) in the `pick` parameter to their results
and return a promise that resolves to the mapped `object`.

#### Parameters
- `pick` *`{object}`* The object of queries to map.
- `[options]` *`{object}`* An object of configuration options.

#### Returns
- *`Promise<object>`* A promise that resolves to the collection.

#### Example

```js
let scope = elicit.request('http://somewebpage.com');

scope.object({
  name: (document) => document.string('.author:nth-child(1) .name')
  age: (document) => document.number('.author:nth-child(1) .age')
});
```

Resolves to:

```js
{
  name: 'Dennis Reynolds',
  age: 41
}
```

### `scope.raw(fn, [options])`

This will call the `fn` with the underlying cheerio object
and the intended cheerio context. It will return a promise resolving to this function's result.

#### Parameters
- `fn` *`{function}`* The raw function to be called and passed the cheerio instance.
- `[options]` *`{object}`* An object of configuration options.

#### Returns
- *`Promise<any>`* A promise that resolves to the result of the raw function.

#### Example

```js
let scope = elicit.request('http://somewebpage.com');

scope.raw(($, context) => $('.author:nth-child(2) .name').text());
```

Resolves to:

```js
'Stephen King'
```