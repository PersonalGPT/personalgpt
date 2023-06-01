# personalgpt-server
Server for PersonalGPT

## Routes

### `GET /api/v1/conversations`

#### Response

**Status:** `200 OK`

**Body:**
```json
[
  {
    "id": "4de3290c-0767-4d5e-89ff-078d8c7ed110",
    "createdAt": 1683328503724,
    "title": "hello, I need your help",
  },
  {
    "id": "e013f4b4-6f36-4b70-af12-29d6a09ddbb5",
    "createdAt": 1683330716888,
    "title": "hello, I need your help",
  }
]
```

### `GET /api/v1/conversations/:id`

#### Request

**Params:** `:id => f61575f6-753e-435b-ac64-9bd7ccdafbe3`

#### Response

**Status:** `200 OK`

**Body:**
```json
{
  "id": "f61575f6-753e-435b-ac64-9bd7ccdafbe3",
  "createdAt": 1683315804431,
  "title": "where is mars",
  "messages": [
    {
      "role": "user",
      "content": "where is mars"
    },
    {
      "role": "assistant",
      "content": "Mars is the fourth planet from the sun in our solar system and is located approximately 142 million miles away from Earth."
    }
  ]
}
```

### `POST /api/v1/conversations`

#### Request

**Body:**
```json
{
  "prompt": "hello, I need your help"
}
```

#### Response

**Status:** `201 Created`

**Body:**
```json
{
  "id": "e013f4b4-6f36-4b70-af12-29d6a09ddbb5",
  "createdAt": 1683328503724,
  "title": "hello, I need your help",
  "messages": [
    {
      "role": "user",
      "content": "hello, I need your help"
    }
  ]
}
```


### `POST /api/v1/chat`

#### Request

**Body:**
```json
{
  "id": "e013f4b4-6f36-4b70-af12-29d6a09ddbb5",
  "messages": [
    { "role": "user", "content": "Hello, I need your help" }
  ]
}
```

#### Response

Response payload is an event stream.

**Status:** `200 OK`

**Body:**
```
Sure, how can I assist you?
```

**Timeline:**
```
* Received 9 B chunk
* Received 6 B chunk
* Received 9 B chunk
* Received 9 B chunk
* Received 7 B chunk
* Received 12 B chunk
* Received 9 B chunk
* Received 6 B chunk
* Received 5 B chunk
```
