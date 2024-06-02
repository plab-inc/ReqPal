import { supabaseClient } from '../util/supabaseClient.ts';

interface CommonResult {
  score: number;
  isCorrect: boolean;
}

export const evaluateTrueOrFalse = async (questionId: number, answer: string): Promise<CommonResult> => {
  const { data, error } = await supabaseClient
    .from('questions')
    .select('*')
    .eq("uuid", questionId);

  console.log("evaluating true or false");

  if (error) throw error;

  if (data.length > 0) {
    const question = data[0];

    let result: CommonResult = { isCorrect: false, score: 0 };

    if (question.solution === answer) {
      result.isCorrect = true;
      result.score = question.points;
    }

    return result;
  } else {
    throw new Error('Question not found');
  }
}
