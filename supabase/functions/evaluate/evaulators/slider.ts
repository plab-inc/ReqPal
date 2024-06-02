interface CommonResult {
  score: number;
  isCorrect: boolean;
}

interface SliderAnswer {
  input: number,
  steps: number,
  maxValue: number,
  minValue: number
}

export const evaluateSlider = async (questionId: string, answer: SliderAnswer, supabase: any) => {

  const {data, error} = await supabase
    .from('questions')
    .select('solution, points')
    .eq("uuid", questionId)

  if (error) throw error;

  if (data.length <= 0) {
    throw new Error('Question not found.');
  }

  try {
    const question = data[0];

    const minValue = (+question.solution.correctValue - +question.solution.toleranceValue);
    const maxValue = (+question.solution.correctValue + +question.solution.toleranceValue);
    const correctValue = (+question.solution.correctValue);
    const result: CommonResult = {score: 0, isCorrect: false};

    if (answer.input === correctValue || answer.input >= minValue && answer.input <= maxValue) {
      result.isCorrect = true;
      result.score = question.points;
    }

    return result;
  } catch (error) {
    throw error;
  }
}