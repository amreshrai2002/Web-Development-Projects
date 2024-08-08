const http = require('http')
const { formidable, errors } = require('formidable')
const fs = require('fs')
const axios = require('axios')
const { getJson } = require('serpapi')
const { setEngine } = require('crypto')

const processData = require('./api.js')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const { writeFile } = require('fs/promises')
const app = express()

console.log(
  path.dirname(process.mainModule.filename),
  path.join(__dirname, 'public')
)

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

const IMGBB_API_KEY = `0b2119f3527849ff3a9e3dacceb166af`
const serpAPI_KEY =
  '6ca1ece92b3b4dc48eded265c85e858826f2edb436e5d2e4a8cb9056daa1bf55'

app.get('/', async (req, res) => {
  // if (req.method === 'OPTIONS') {
  //   res.writeHead(204) // No Content
  //   res.end()
  //   return
  // }
  res.setHeader('Access-Control-Allow-Origin', '*') // to allow any origin
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  ) // methods you want to allow
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization') // headers you want to allow
  const data = fs.readFileSync('index.html')
  res.end(data)
})

app.post('/upload', async (req, res) => {
  // if (req.method.toLowerCase() === 'post') {
  // processData(req, res)
  res.setHeader('Access-Control-Allow-Origin', '*') // to allow any origin
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  ) // methods you want to allow
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization') // headers you want to allow
  // console.log(req, res)
  const form = formidable({})
  let fields
  let files
  try {
    ;[fields, files] = await form.parse(req)
    console.log(fields, files)

    // if empty files
    if (Object.keys(files).length === 0) {
      throw new Error('No files were uploaded.')
    }

    const image = files.image[0]
    // Read the file data
    const fileData = fs.readFileSync(image.filepath)

    // convert file data to a base64 encoded string
    const base64Image = new Buffer.from(fileData).toString('base64')

    // Prepare the payload to imgBB
    const formData = new URLSearchParams()
    formData.append('image', base64Image)

    // send the request to imgBB
    const imgBBresponse = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const imagerUrl = imgBBresponse.data.data.url
    const response = await getJson({
      engine: 'google_lens',
      api_key: serpAPI_KEY,
      url: imagerUrl,
      location: 'Delhi,India',
    })
    console.log(response)
    // Send the response from imgBB
    // fs.writeFile('file.text' , JSON.stringify(response,null,2))
    res.end(JSON.stringify(response, null, 2))
    return
  } catch (err) {
    //Example to check for a very specific error
    if (err.code === errors.maxFieldsExceeded) {
      console.log('Max Fields Exceeded')
    }
    console.error(err)
    res.end(String(err))
    return
  }
  // }
})

app.use((req, res) => {
  res.end('404 not found')
})

// const server = http.createServer(async (req, res) => {
//   // Set CORS headers
//   res.setHeader('Access-Control-Allow-Origin', '*') // to allow any origin
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'OPTIONS, GET, POST, PUT, PATCH, DELETE'
//   ) // methods you want to allow
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization') // headers you want to allow

//   // Handle OPTIONS method (pre-flight request)
//   if (req.method === 'OPTIONS') {
//     res.writeHead(204) // No Content
//     res.end()
//     return
//   }

//   if (req.url === '/') {
//     const data = fs.readFileSync('index.html')
//     res.end(data)
//   } else if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
//     // parse a file upload
//     processData(req, res)
//     const form = formidable({})
//     let fields
//     let files
//     try {
//       ;[fields, files] = await form.parse(req)

//       // if empty files
//       if (Object.keys(files).length === 0) {
//         throw new Error('No files were uploaded.')
//       }

//       const image = files.image[0]
//       // Read the file data
//       const fileData = fs.readFileSync(image.filepath)

//       // convert file data to a base64 encoded string
//       const base64Image = new Buffer.from(fileData).toString('base64')

//       // Prepare the payload to imgBB
//       const formData = new URLSearchParams()
//       formData.append('image', base64Image)

//       // send the request to imgBB
//       const imgBBresponse = await axios.post(
//         `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//         }
//       )

//       const imagerUrl = imgBBresponse.data.data.url
//       const response = await getJson({
//         engine: 'google_lens',
//         api_key: serpAPI_KEY,
//         url: imagerUrl,
//         location: 'Delhi,India',
//       })

//       // Send the response from imgBB
//       res.writeHead(200, { 'Content-Type': 'application/json' })
//       res.end(JSON.stringify(response, null, 2))
//       return
//     } catch (err) {
//       //Example to check for a very specific error
//       if (err.code === errors.maxFieldsExceeded) {
//         console.log('Max Fields Exceeded')
//       }
//       console.error(err)
//       res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' })
//       res.end(String(err))
//       return
//     }
//   } else {
//     //   Handle 404 -Not Found
//     res.writeHead(404, { 'Content-Type': 'text/plain' })
//     res.end('404 not found')
//   }
// })

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000/')
})
