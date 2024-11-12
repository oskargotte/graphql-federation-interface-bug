## Reproduction of bug when using @interfaceObject in combination with fragments and __typename
Two subgraphs implements the example schemas from https://www.apollographql.com/docs/graphos/schema-design/federated-schemas/entities/interfaces#example-schemas  
### Setup
Start subgraphs and router at http://localhost:4000/ with
```bash
docker-compose up
```

## Running test queries
Go to the sandbox page at http://localhost:4000/ to run queries or use the following curl commands
### ✅ Without any fragments
```bash
curl 'http://localhost:4000/' \
  -H 'content-type: application/json' \
  --data-raw '{"query":"query {topRatedMedia { id title review } }"}'
```

### ✅ With __Media__ interface fragment
```bash
curl 'http://localhost:4000/' \
  -H 'content-type: application/json' \
  --data-raw '{"query":"query {topRatedMedia { id title ... on Media { review }}}"}'
```

### ✅ With __Book__ type fragment
```bash
curl 'http://localhost:4000/' \
  -H 'content-type: application/json' \
  --data-raw '{"query":"query {topRatedMedia { id title ... on Book { review }}}"}'
```

### ✅ With __Media__ interface fragment and __typename
To show that the actual type of each element is __Book__ 
```bash
curl 'http://localhost:4000/' \
  -H 'content-type: application/json' \
  --data-raw '{"query":"query {topRatedMedia { __typename id title ... on Media { __typename review }}}"}'
```
=> `{"data":{"topRatedMedia":[{"__typename":"Book","id":"1","title":"TITLE 1","review":1},{"__typename":"Book","id":"2","title":"TITLE 2","review":2}]}}`


### ❌ With __Book__ type fragment and __typename in the fragment
Where the fields from the __Book__ fragment are missing even though the elements are __Books__ 
```bash
curl 'http://localhost:4000/' \
  -H 'content-type: application/json' \
  --data-raw '{"query":"query {topRatedMedia { id title ... on Book { __typename review }}}"}'
```
=> `{"data":{"topRatedMedia":[{"id":"1","title":"TITLE 1"},{"id":"2","title":"TITLE 2"}]}}`



### ❌ With __Book__ type fragment and __typename inside and outside the fragment as the Apollo Client constructs te queries
Where the data is null without any error but an extension message specifying the problem 
```bash
curl 'http://localhost:4000/' \
  -H 'content-type: application/json' \
  --data-raw '{"query":"query {topRatedMedia { __typename id title ... on Book { __typename review }}}"}'
```
=> `{"data":null,"extensions":{"valueCompletion":[{"message":"Cannot return null for non-nullable array element of type Media at index 0","path":["topRatedMedia",0]},{"message":"Cannot return null for non-nullable field [Media!]!.topRatedMedia","path":["topRatedMedia"]}]}}%`
