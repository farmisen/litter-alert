import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

import type { APIRoute } from "astro"
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

    // connect to the spreadsheet
    const doc = new GoogleSpreadsheet(
      import.meta.env.GOOGLE_SHEET_ID,
      serviceAccountAuth
    )
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]

    // add the data to the sheet
    const data = await request.json()
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
