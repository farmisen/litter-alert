import { GoogleSpreadsheet } from "google-spreadsheet"
import { google } from "googleapis"
import { JWT } from "google-auth-library"

import type { APIRoute } from "astro"
import { Readable } from "stream"
export const prerender = false

export const post: APIRoute = async ({ request }) => {
  try {
    // Initialize auth - https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
    const auth = {
      email: import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: import.meta.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.file"
      ]
    }
    const serviceAccountAuth = new JWT(auth)

    // create google drive client
    const drive = google.drive({ version: "v3", auth: serviceAccountAuth })

    // extract data from request
    const { timestamp, description, severity, location, media } = await request.json()

    // make a unique filename
    const now = new Date()
    const imageTimestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(
      2,
      "0"
    )}-${String(now.getMinutes()).padStart(2, "0")}-${String(now.getSeconds()).padStart(
      2,
      "0"
    )}.${now.getMilliseconds()}`
    const imageName = `photo_${imageTimestamp}.jpg`

    // extract the base64 data from the dataUri
    const base64Data = media.split(";base64,").pop()

    // upload image to drive
    const response = await drive.files.create({
      requestBody: {
        name: imageName,
        mimeType: "image/jpeg",
        parents: [import.meta.env.GOOGLE_DRIVE_FOLDER_ID]
      },
      media: {
        mimeType: "image/jpeg",
        body: Readable.from(Buffer.from(base64Data, "base64"))
      },
      fields: "id,webViewLink"
    })

    // get the image url
    const imageUrl = response.data.webViewLink

    // connect to the spreadsheet
    const doc = new GoogleSpreadsheet(
      import.meta.env.GOOGLE_SHEET_ID,
      serviceAccountAuth
    )
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]

    // add the data to the sheet
    const data = {
      timestamp,
      description,
      severity,
      location,
      ...(!!imageUrl && { media: imageUrl })
    }
    await sheet.addRow(data)

    // return a success message
    return {
      body: JSON.stringify({
        message: "Submitted successfully"
      })
    }
  } catch (e) {
    console.error(e)
    // return an error message
    return {
      body: JSON.stringify({
        error: e.message
      })
    }
  }
}
