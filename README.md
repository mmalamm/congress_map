# Senwatch: Interactive Senator Map

## Summary

Senwatch is an interactive map of the U.S. which allows users to click on a state and then see information about the senators of that state.

## Architecture and Technologies

Senwatch is implemented using a minimalistic structure consisting of only a front end utilizing several different API calls for content population.
### D3.js

### jQuery
for AJAX requests, with JSONP for CORS and cURL for request headers

## API Resources

#### ProPublica API
for contact information of senators
#### Wikipedia API
for images of senators. Required use of JSONP for CORS via getJSON jQuery method
#### Twitter API
for senators' Twitter feeds
