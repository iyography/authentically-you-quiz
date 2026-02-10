import { NextRequest, NextResponse } from 'next/server';
import { loadQuizResults, getQuizStats } from '@/lib/quiz-storage';

function checkAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin-session');
  
  if (!sessionCookie) return false;
  
  try {
    const decoded = Buffer.from(sessionCookie.value, 'base64').toString();
    const [email, timestamp] = decoded.split(':');
    
    const allowedEmails = ['davidiya3@gmail.com', 'authenticallyou.ca@gmail.com'];
    
    if (!allowedEmails.includes(email) || !timestamp) return false;
    
    // Check if session is expired (24 hours)
    const sessionAge = Date.now() - parseInt(timestamp);
    if (sessionAge > 24 * 60 * 60 * 1000) return false;
    
    return true;
  } catch (error) {
    return false;
  }
}

export async function GET(request: NextRequest) {
  // Check authentication
  if (!checkAuth(request)) {
    return new NextResponse('Authentication required', {
      status: 401,
    });
  }
  try {
    const { searchParams } = new URL(request.url);
    const statsOnly = searchParams.get('stats') === 'true';
    
    if (statsOnly) {
      const stats = getQuizStats();
      return NextResponse.json(stats);
    } else {
      const results = loadQuizResults();
      return NextResponse.json(results);
    }
  } catch (error) {
    console.error('Error loading quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to load quiz results' },
      { status: 500 }
    );
  }
}