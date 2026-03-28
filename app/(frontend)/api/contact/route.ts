import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // TODO: Send email via Resend and/or store in DB
    // For now, log and return success
    console.log('[Contact]', { name, email, subject, message: message.slice(0, 100) })

    return NextResponse.json({ message: 'Message sent! We\'ll reply within 1–2 business days.' })
  } catch {
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
