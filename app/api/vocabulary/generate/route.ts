import { NextRequest, NextResponse } from 'next/server';
import { generateVocabularyWord } from '@/lib/watsonx';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { word } = body;

    if (!word?.trim()) {
      return NextResponse.json({ error: 'Word is required' }, { status: 400 });
    }

    const wordData = await generateVocabularyWord(word.trim());
    return NextResponse.json({ word: wordData });
  } catch (error) {
    console.error('Vocabulary generate error:', error);
    return NextResponse.json({
      word: {
        meaning: `The definition of "${req.url}" — please try again.`,
        pronunciation: `/${req.url}/`,
        partOfSpeech: 'noun',
        synonyms: [],
        antonyms: [],
        exampleSentence: 'Example not available.',
        interviewUsage: 'Usage example not available.',
        difficulty: 'medium',
        category: 'professional',
      },
    }, { status: 200 });
  }
}
