# Iris Platform API

The Iris Platform Node library provides means for communicating with the Iris Platform REST API.

## Usage

The library needs to be configured with an API key for your Iris Platform account which can be found on [Iris Dashboard](https://dashboard.irisplatform.io). Pass the key into the constructor:

```javascript
const IrisPlatformAPI = require('iris-platform-node');

const iris = new IrisPlatformAPI('your-key-goes-here');
```

### Fetching broadcast or image metadata

Get the last few items:

```javascript
let broadcasts = await iris.broadcasts.findAll();

let images = await iris.images.findAll();
```

List items with pagination:

```javascript
let pager = await iris.broadcasts.findAll({}, {withPagination: true});
let broadcasts = [], pageResults;
while (pageResults = pager.next()) {
  broadcasts = broadcasts.concat(pageResults);
}

// (same for iris.images)
```

Get an image or broadcast by their id:

```javascript
let broadcast = await iris.broadcasts.findById('0a9860dd-359a-67c4-51d9-d87402770319');

// (same for iris.images)
```

### Deleting broadcasts or images

Get an image or broadcast by their id:

```javascript
await iris.broadcasts.deleteById('0a9860dd-359a-67c4-51d9-d87402770319');

// (same for iris.images)
```

## More information

[Iris Platform Docs](https://irisplatform.io/docs)
[Bambuser AB](https://bambuser.com)
