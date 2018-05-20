const http = require('http')
const fs = require('fs');

const port = 3000

// Dummy implementation: Simulate reading files from disk with random latency
function readInput(id, delayFactor) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${id}.html`, 'utf8', (error, result) => {
      if (error) {
        reject(error);
      } else {
        responseTime = (1000 * Math.random() + delayFactor * 1000).toFixed(2)
        console.log(`Got fragment ${id} after ${responseTime} ms`)
        setTimeout(resolve, responseTime, result);
      }
    });
  });
}

async function requestHandler(request, response) {
  console.time("Total response time")

  response.writeHead(200, { 'Content-Type': 'text/html' })

  // read fragments, concurrently
  const fragmentIds = [0,1,2,3]
  const fragmentPromises = fragmentIds.map((id, index) => {
    console.log(`Reading fragment ${id}`)
    return readInput(id, index)
  })

  const startTime = new Date().getTime()

  // write fragments to the client, sequentially
  for (let fragmentPromise of fragmentPromises) {
    response.write(await fragmentPromise)
    console.log("Sent fragment after " + (new Date().getTime() - startTime) + " ms")
  }

  response.end()
  console.timeEnd("Total response time")
}

const server = http.createServer(requestHandler)

server.listen(port, (error) => {
  if (error) {
    return console.log('Error: ', error)
  }
  console.log(`Server listening on port ${port}`)
})