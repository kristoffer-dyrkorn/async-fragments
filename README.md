## about
Proof of concept on progressive HTML page rendering using async fragment fetching. 

## install
`yarn install`

## run
`yarn run nodemon`

## tips
Response chunking (for progressive rendering) is not compatible with gzipping. Gzipping works on complete responses.

Inspired by https://www.ebayinc.com/stories/blogs/tech/async-fragments-rediscovering-progressive-html-rendering-with-marko/

See https://nodejs.org/api/http.html#http_response_write_chunk_encoding_callback for info on chunched writes

