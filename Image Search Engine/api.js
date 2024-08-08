const { formidable, errors } = require('formidable')
const fs = require('fs')
const axios = require('axios')
const { getJson } = require('serpapi')
const { setEngine } = require('crypto')

const IMGBB_API_KEY = `0b2119f3527849ff3a9e3dacceb166af`
const serpAPI_KEY =
  '6ca1ece92b3b4dc48eded265c85e858826f2edb436e5d2e4a8cb9056daa1bf55'

const processData = async (req, res) => {
  const form = formidable({})
  let fields
  let files
  try {
    ;[fields, files] = await form.parse(req)

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

    // Send the response from imgBB
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(response, null, 2))
    return
  } catch (err) {
    //Example to check for a very specific error
    if (err.code === errors.maxFieldsExceeded) {
      console.log('Max Fields Exceeded')
    }
    console.error(err)
    res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' })
    res.end(String(err))
    return
  }
}

module.exports = processData
