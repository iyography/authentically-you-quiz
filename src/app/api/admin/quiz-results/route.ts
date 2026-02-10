import { NextRequest, NextResponse } from 'next/server';
import { loadQuizResults, getQuizStats } from '@/lib/quiz-storage';

export async function GET(request: NextRequest) {
  // No authentication required - open access
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