interface MultipleChoiceAnswer {
  id: number;
  input: boolean;
  description: string;
}

interface MultipleChoiceResult {
  score: number;
  results: SingleMultipleChoiceResult[];
}

interface SingleMultipleChoiceResult {
  id: number;
  isCorrect: boolean;
}

export const evaluateMultipleChoice = async (questionId: string, answers: MultipleChoiceAnswer[], supabase: any): Promise<MultipleChoiceResult | SingleMultipleChoiceResult> => {

  const {data, error} = await supabase
    .from('questions')
    .select('*')
    .eq("uuid", questionId)

  if (error) throw error;

  if (data.length <= 0) {
    throw new Error('Question not found.');
  }

  if (answers.length <= 0) {
    throw new Error('No answers were provided.');
  }

  try {
    const question = data[0];
    const result: MultipleChoiceResult = {score: 0, results: []};
    const pointsPerRightAnswer = question.points / question.solution.length;

    question.solution.forEach(s => {
      const toCompare: MultipleChoiceAnswer = answers.find(answer => answer.id === s.id);
      if (toCompare) {
        const comparedResult: boolean = toCompare.input === s.solution;
        result.results.push({id: s.id, isCorrect: comparedResult})
        if (comparedResult) {
          result.score += pointsPerRightAnswer;
        }
      }
    })

    if (result.score > 0) {
      result.score = Number(result.score.toFixed(2));
    }

    return result;
  } catch (error) {
    throw error;
  }
}