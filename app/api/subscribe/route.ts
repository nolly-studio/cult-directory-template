import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/db/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string

    if (!email || !email.includes('@')) {
      return NextResponse.redirect('/toolkit?error=invalid-email', 302)
    }

    const supabase = createClient()
    
    // Insert into newsletter subscribers
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        source: 'toolkit-page',
        subscribed_at: new Date().toISOString()
      })

    if (error) {
      console.error('Newsletter subscription error:', error)
      // If email already exists, still redirect to success
      if (error.code === '23505') {
        return NextResponse.redirect('/toolkit?success=true', 302)
      }
      return NextResponse.redirect('/toolkit?error=subscription-failed', 302)
    }

    // Redirect to success page
    return NextResponse.redirect('/toolkit?success=true', 302)
    
  } catch (error) {
    console.error('Subscription API error:', error)
    return NextResponse.redirect('/toolkit?error=server-error', 302)
  }
}