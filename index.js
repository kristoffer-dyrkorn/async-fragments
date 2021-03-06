const http = require('http')
const fs = require('fs')

const port = 3000

// Dummy implementation: Simulate reading files from disk with random latency
function readFragment(id, delayFactor) {
  return new Promise((resolve, reject) => {
    fs.readFile(`fragments/${id}.html`, 'utf8', (error, result) => {
      if (error) {
        reject(error)
      } else {
        responseTime = (1000 * Math.random() + delayFactor * 1000).toFixed(2)
        console.log(`Got fragment ${id} after ${responseTime} ms`)
        setTimeout(resolve, responseTime, result)
      }
    });
  });
}

async function requestHandler(request, response) {
  const startTime = Date.now()

  response.writeHead(200, { 'Content-Type': 'text/html' })

  // read fragments, concurrently
  const fragmentIds = [0,1,2,3]
  const fragmentPromises = fragmentIds.map((id, index) => {
    console.log(`Reading fragment ${id}`)
    return readFragment(id, index)
  })

  // write fragments to the client, sequentially
  for (const fragmentPromise of fragmentPromises) {
    response.write(await fragmentPromise)
    console.log("Sent fragment after " + (Date.now() - startTime) + " ms")
  }

  response.end()
  console.log("Total response time: " + (Date.now() - startTime) + " ms")
}

const server = http.createServer(requestHandler)

server.listen(port, (error) => {
  if (error) {
    return console.log('Error: ', error)
  }
  console.log(`Server listening on port ${port}`)
})