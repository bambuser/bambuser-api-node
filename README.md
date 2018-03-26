<div>
  <br/><br />
  <p align="center">
    <a href="https://irisplatform.io" target="_blank" align="center">
        <img src="https://irisplatform.io/static/images/company/iris-by-bambuser-black-horisontal.png" width="280">
    </a>
  </p>
  <br /><br />
  <h1>Iris Platform REST API client for Node.js</h1>
</div>

The Iris Platform Node library provides means for communicating with the Iris Platform REST API.

## Usage

The library needs to be configured with an API key for your Iris Platform account which can be found on [Iris Dashboard](https://dashboard.irisplatform.io/developer). Pass the key into the constructor:

```javascript
const IrisPlatformAPI = require('iris-platform-node');

const iris = new IrisPlatformAPI('your-key-goes-here');
```

Optionally, pass more options:

```javascript
const iris = new IrisPlatformAPI({
  apiKey: 'your-key-goes-here',
  daId: 'your-signing-key',
  daSecret: 'your-signing-secret'
});
```

| Key | Type | Description |
| -------- | ------ | --- |
| apiKey   | string | Your Iris Platform API key |
| daId     | string | (optional) The id part of your signing key |
| daSecret | string | (optional) The secret part of your signing key |

You can find your API key and signing key on [https://dashboard.irisplatform.io/developer](https://dashboard.irisplatform.io/developer).


### Fetching broadcast or image metadata

Get the last few items:

[API Reference](https://irisplatform.io/docs/api/get-broadcast-metadata/)

```javascript
let broadcasts = await iris.broadcasts.get();

let images = await iris.images.get();
```

Get items with options:

You can find all available options in the [REST API documentation](https://irisplatform.io/docs/api/get-broadcast-metadata/).

```javascript
let broadcasts = await iris.broadcasts.get({
  byAuthors: 'John Doe'
});

// (same for iris.images)
```

List items with pagination:

```javascript
let pager = await iris.broadcasts.get({}, {withPagination: true});
let broadcasts = [], pageResults;
while (pageResults = await pager.next()) {
  broadcasts = broadcasts.concat(pageResults);
}

// (same for iris.images)
```

Get an image or broadcast by their id:

```javascript
let broadcast = await iris.broadcasts.getById('0a9860dd-359a-67c4-51d9-d87402770319');

// (same for iris.images)
```

### Deleting broadcasts or images

Get an image or broadcast by their id:

[API Reference](https://irisplatform.io/docs/api/removing-media/)

```javascript
await iris.broadcasts.deleteById('0a9860dd-359a-67c4-51d9-d87402770319');

// (same for iris.images)
```

### Get a link to a broadcast player

To use this method you must configure the API client with your signing keys.

```javascript
let broadcasts = await iris.broadcasts.get();
let playerUrl = iris.broadcasts.getPlayerURL(broadcasts[0].id);
```

### Create a clip from a broadcast

[API Reference](https://irisplatform.io/docs/api/create-clips/)

```javascript
let start = 5;
let end = 145;
await iris.broadcasts.createClip('0a9860dd-359a-67c4-51d9-d87402770319', start, end);
```

## More information

* [Iris Platform Docs](https://irisplatform.io/docs)

* [Bambuser AB](https://bambuser.com)
