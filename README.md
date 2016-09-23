## Super bare-bones graphQL example app w/ Express.js*

### Schema Fields: All fields are string responses
- hello: simple, static  response
- time: dynamic  response
- myName: response with dynamic response based on args
- airportStatus: promise-based, response from API call out

Try the query out to test the various field resolutions:
```
{
  hello,
  time,
  myName(firstName: "Davey", lastName: "Osborne"),
  airportStatus(airportCode: "SAT")
}
```

*disclaimer: minimal effort made here.
