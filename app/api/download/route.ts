'use server'

import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  const filePath = path.join(process.cwd(), 'public', 'App', 'Arivon.apk')

  try {
    // Make sure the file exists and get its size
    const stat = await fs.promises.stat(filePath)

    // Stream the file to the response to avoid buffering the entire file in memory
    const stream = fs.createReadStream(filePath)

    return new Response(stream as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="Arivon.apk"',
        'Content-Length': String(stat.size),
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'APK not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
