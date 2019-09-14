countapi-js
==========

[![npm](https://img.shields.io/npm/v/countapi-js)](https://www.npmjs.com/package/countapi-js)
[![Travis (.org)](https://img.shields.io/travis/mlomb/countapi-js)](https://travis-ci.org/mlomb/countapi-js)

![Count API logo](https://countapi.xyz/logo.png "Count API logo")

This is the official promise-based wrapper for [CountAPI](https://countapi.xyz). CountAPI is a free counting service, you can use it to track page hits, and custom events.

Installation
------------
```
npm install countapi-js --save
```

Example
--------
First, include the package

```js
const countapi = require('countapi-js');

// or with ES6
import countapi from 'countapi-js';
```

Counting the number of visits *per page*

```js
countapi.visits().then((result) => {
  console.log(result.value);
});
```
Refresh the page multiple times and check the console!

If you want to track the number of visits through the whole site instead

```js
countapi.visits('global').then((result) => {
  console.log(result.value);
});
```

Or custom events
```js
document.getElementById("magic-button").addEventListener("click", () => {
  countapi.event('magic-button').then((result) => {
    alert(`The magic button has been pressed ${result.value} times.`);
  });
})
```

Keys and namespaces
--------
Namespaces are meant to avoid name collisions. Its recommend use the domain of the application as namespace to avoid collision with other websites. By default, the **visits** and **event** functions will use the current domain as namespace and the provided arguments as key.
If the namespace is not specified the key is assigned to the *default* namespace.

Keys and namespaces must match **^[A-Za-z0-9_\-.]{3,64}$**.

Available methods
--------


> ℹ️ **Note**: When requesting existing keys, if the key doesn't exists the status returned will be 404 (the promise will not fail).

### get
**countapi.get(namespace, key)**  
**countapi.get(key)**

Get the value of a key.

```js
countapi.get('mysite.com', 'test').then((result) => { ... });
```
*result* may look like
```js
{
    status: 200,
    path: "mysite.com/test",
    value: 136
}
```

### set
**countapi.set(namespace, key, value)**  
**countapi.set(key, value)**

Set the value of a key.

> ℹ️ **Note**: To set a key, it **must** be created with *enable_reset* set to true.

```js
countapi.set('mysite.com', 'test', 42).then((result) => { ... });
```
*result* may look like
```js
{
    status: 200,
    path: "mysite.com/test",
    old_value: 136,
    value: 42
}
```

> ℹ️ **Note**: If the key has *enable_reset* set to false, *status* will be 403 and the *old_value* will match *value* (the key stays the same), also the promise will NOT fail.

### update
**countapi.update(namespace, key, amount)**  
**countapi.update(key, amount)**

Updates a key with **+/-** amount.

> ℹ️ **Note**: *amount* **must** be within *update_lowerbound* and *update_upperbound* specified during the creation of the key.

```js
// subtract 3
countapi.update('mysite.com', 'test', -3).then((result) => { ... });
```
*result* may look like
```js
{
    status: 200,
    path: "mysite.com/test",
    value: 42
}
```

> ℹ️ **Note**: If the amount provided is invalid you will get status 403.

### hit
**countapi.hit(namespace, key)**  
**countapi.hit(key)**

A shorthand for update with amount=1. And useful if you don't want to create a key manually, since if you request a key that doesn't exists, a key with *enable_reset*=false, *update_lowerbound*=0 and *update_upperbound*=1 will be created automatically.

```js
countapi.hit('mysite.com', 'visits').then((result) => { ... });
```
*result* may look like
```js
{
    status: 200,
    path: "mysite.com/visits",
    value: 27
}
```

### visits / event
**countapi.visits()**  
**countapi.visits(page)**
**countapi.event(name)**

Useful shorthands for *hit* using as namespace the current hostname.
For *.visits* you may pass *page* to provide your own page identifier. If *page* is not provided it will be extracted from the current URL.
For *.event* you have to pass a event name.

Examples for those are shown in the [example section](#Example).

### create
**countapi.create()**  
**countapi.create(options)**

Create a key. All parameters are optional.

| **name**          | **default** | **description**                                                                               |
|-------------------|-------------|-----------------------------------------------------------------------------------------------|
| key               | New UUID    | Name of the key                                                                               |
| namespace         | default     | Namespace to store the key                                                                    |
| value             | 0           | The initial value                                                                             |
| enable_reset      | 0           | Allows the key to be resetted with **set**                                                    |
| update_lowerbound | -1          | Restrict update to not subtract more than this number. This number **must** be negative or zero. |
| update_upperbound | 1           | Restrict update to not add more than this number. This number **must** be positive or zero.      |

```js
countapi.create(options).then((result) => { ... });
```
*result* may look like
```js
{
    status: 200,
    path: "default/6d5891ff-ebda-48fb-a760-8549d6a3bf3a",
    namespace: "default",
    key: "6d5891ff-ebda-48fb-a760-8549d6a3bf3a",
    value: 0
}
```

If there is a problem creating the key, the promise will be rejected with meaningful information.

### info
**countapi.info(namespace, key)**  
**countapi.info(key)**

Retrive information about a key.

```js
countapi.info('test').then((result) => { ... });
```
*result* may look like
```js
{
    status: 200,
    path: "default/test",
    namespace: "default",
    key: "test",
    ttl: 15769998014,
    created: 1553794487479,
    update_lowerbound: 0,
    update_upperbound: 1,
    enable_reset: false,
    value: 69
}
```

### stats
**countapi.stats()**

Get some CountAPI stats.

```js
countapi.stats().then((result) => { ... });
```
*result* may look like
```js
{
    keys_created: 111111,
    keys_updated: 111111,
    requests: 111111,
    version: "xxxxxx"
}
```

Further documentation
--------
Visit https://countapi.xyz for the full API documentation.

Testing
--------

```
npm test
```

Dependencies
--------

- [cross-fetch](https://github.com/lquixada/cross-fetch): A light and cross-platform fetch API

License
--------
[MIT](LICENSE)