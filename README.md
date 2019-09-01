<div>
  <br/><br />
  <p align="center">
    <a href="https://bambuser.com" target="_blank" align="center">
        <img src="https://bambuser.com/wp-content/themes/bambuser/assets/images/logos/bambuser-logo-horizontal-black.png" width="280">
    </a>
  </p>
  <br /><br />
  <h1>Bambuser REST API client for Node.js</h1>
</div>

The Bambuser Node library provides means for communicating with the Bambuser REST API.

## Usage

The library needs to be configured with an API key for your Bambuser account which can be found on the [dashboard](https://dashboard.bambuser.com/developer). Pass the key into the constructor:

```javascript
const BambuserAPI = require('bambuser-api-node');

const bambuser = new BambuserAPI('your-key-goes-here');
```

Optionally, pass more options:

```javascript
const bambuser = new BambuserAPI({
  apiKey: 'your-key-goes-here',
  daId: 'your-signing-key',
  daSecret: 'your-signing-secret'
});
```

| Key | Type | Description |
| -------- | ------ | --- |
| apiKey   | string | Your Bambuser API key |
| daId     | string | (optional) The id part of your signing key |
| daSecret | string | (optional) The secret part of your signing key |

You can find your API key and signing key on [dashboard.bambuser.com/developer](https://dashboard.bambuser.com/developer).


### Fetching broadcast or image metadata

Get the last few items:

[API Reference](https://bambuser.com/docs/api/get-broadcast-metadata/)

```javascript
const broadcasts = await bambuser.broadcasts.get();

const images = await bambuser.images.get();
```

Get items with options:

You can find all available options in the [REST API documentation](https://bambuser.com/docs/api/get-broadcast-metadata/).

```javascript
const broadcasts = await bambuser.broadcasts.get({
  byAuthors: 'John Doe'
});

// (same for bambuser.images)
```

List items with pagination:

```javascript
const pager = await bambuser.broadcasts.get({}, {withPagination: true});
let broadcasts = [], pageResults;
while (pageResults = await pager.next()) {
  broadcasts = broadcasts.concat(pageResults);
}

// (same for bambuser.images)
```

Get an image or broadcast by their id:

```javascript
const broadcast = await bambuser.broadcasts.getById('0a9860dd-359a-67c4-51d9-d87402770319');

// (same for bambuser.images)
```

### Deleting broadcasts or images

Get an image or broadcast by their id:

[API Reference](https://bambuser.com/docs/api/removing-media/)

```javascript
await bambuser.broadcasts.deleteById('0a9860dd-359a-67c4-51d9-d87402770319');

// (same for bambuser.images)
```

### Get a link to a broadcast player

To use this method you must configure the API client with your signing keys.

```javascript
const broadcasts = await bambuser.broadcasts.get();
const playerUrl = bambuser.broadcasts.getPlayerURL(broadcasts[0].id);
```

### Create a clip from a broadcast

[API Reference](https://bambuser.com/docs/api/create-clips/)

```javascript
let start = 5;
let end = 145;
const { newBroadcastId } = await bambuser.broadcasts.createClip('0a9860dd-359a-67c4-51d9-d87402770319', start, end);

// Wait for the new broadcast (clip) to become ready
let broadcast;
const waitForNewBroadcast = async () => {
  try {
    broadcast = await bambuser.broadcasts.getById(newBroadcastId);
  } catch (err) {
    if (err instanceof BambuserAPI.errors.ResourceNotFound) {
      // Still not ready, wait a short time before checking again
      await new Promise(r => setTimeout(r, 5000));
      return await waitForNewBroadcast();
    }
    throw err;
  }
};
await waitForNewBroadcast();
console.log(broadcast);
```

## More information

* [Bambuser Docs](https://bambuser.com/docs)

* [Bambuser AB](https://bambuser.com)
