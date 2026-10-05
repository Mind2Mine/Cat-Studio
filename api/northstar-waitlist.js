// Vercel Node.js function. Configure MAILERLITE_API_TOKEN in Vercel, never in browser code.
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Please submit the waitlist form using POST.' });
  }
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) {
    return res.status(415).json({ success: false, error: 'Please send the email as JSON.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ success: false, error: 'Please send a valid email address.' });
  }
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }

  const token = process.env.MAILERLITE_API_TOKEN;
  if (!token) {
    return res.status(503).json({ success: false, error: 'The waitlist is temporarily unavailable. Please try again later.' });
  }

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      // This endpoint creates or updates the subscriber and adds the existing group.
      body: JSON.stringify({ email, groups: ['200519278760297554'] }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      // Never forward upstream details, credentials, or subscriber data to the browser.
      return res.status(response.status === 429 ? 429 : 502).json({
        success: false,
        error: response.status === 429
          ? 'Too many signup attempts. Please try again in a few minutes.'
          : 'We couldn’t add you to the waitlist. Please try again later.',
      });
    }
    return res.status(200).json({ success: true });
  } catch {
    return res.status(502).json({ success: false, error: 'We couldn’t reach the waitlist service. Please try again later.' });
  }
};
