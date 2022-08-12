# Post Back Testing

A simple way to test your post back

- Testing if api is online

```sh

$ curl https://my-dev-post-back.herokuapp.com | jq '.'

```

- Call the public end point to save your data
- Provide any string as param to your key

```sh

$ curl -X POST https://my-dev-post-back.herokuapp.com/your-key \
-H "Content-Type: application/json" \
-d '{ "data": "hello world" }' | jq '.'

```

- Provide your key to get the data.
- It will be available for only 5 minutes

```sh

$ curl https://my-dev-post-back.herokuapp.com/your-key | jq '.'

```
