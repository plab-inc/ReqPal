interface QualificationAnswer {
  products: { id: string, input: number }[]
  catalogId: string,
  productIds: string[],
  requirementId: string,
  askForQualification: boolean
}

interface QualificationResult {
  score: number,
  results: {id: string, isCorrect: boolean}[]
}

export const evaluateQualification = async (questionId: string, answer: QualificationAnswer, supabase: any): Promise<QualificationResult> => {

  if(!answer.askForQualification) {
    throw new Error("Error: Answer does not ask for a qualification check.")
  }

  if(answer.products.length <= 0) {
    throw new Error("Answers are missing product values.")
  }

  const {data, error} = await supabase
    .from('questions')
    .select('solution, options, points')
    .eq("uuid", questionId)

  if (error) throw error;

  if (data.length <= 0) {
    throw new Error('Question not found.');
  }

  try {
    const question = data[0];
    const toleranceValue : number = question.solution.toleranceValue;
    const result: QualificationResult = {score: 0, results: []};
    const pointsPerRightAnswer : number = question.points / answer.products.length;

    for (const productAnswer of answer.products) {
      const {data, error} = await supabase
        .from('product_requirements')
        .select('qualification')
        .eq("product_id", productAnswer.id)
        .eq("requirement_id", answer.requirementId)

      if(error) throw error;

      if(data.length <= 0) {
        throw new Error("No solution found for product and requirement.")
      }

      const qualification : number = data[0].qualification;
      const minValue : number = (+qualification - +toleranceValue);
      const maxValue : number = (+qualification + +toleranceValue);
      const comparedResult = productAnswer.input === qualification || (productAnswer.input >= minValue && productAnswer.input <= maxValue);

      if(comparedResult) {
        result.score += pointsPerRightAnswer;
      }
      result.results.push({id: productAnswer.id, isCorrect: comparedResult});
    }
    return result;
  } catch (error) {
    throw error;
  }
}