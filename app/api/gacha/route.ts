import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const index = searchParams.get('index') || '1';
  const size = searchParams.get('size') || '50';

  if (!token) {
    return NextResponse.json({ code: 401, message: 'No token provided' }, { status: 400 });
  }

  // Handle case where user might paste the entire cookie string "token=xxx; other=yyy"
  let parsedToken = token;
  if (token.includes('token=')) {
    const match = token.match(/token=([^;]+)/);
    if (match && match[1]) {
      parsedToken = match[1];
    }
  }

  try {
    const res = await fetch(`https://account.yo-star.com/api/game/gachas?key=ark&index=${index}&size=${size}&lang=en`, {
      headers: {
        'Cookie': `token=${parsedToken}`,
        'lang': 'en',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ code: 500, message: error.message }, { status: 500 });
  }
}
