CREATE FUNCTION calculate_user_score_mc(question_id INTEGER, user_results JSON, id_user UUID) RETURNS INTEGER
    LANGUAGE plpgsql
AS $$
DECLARE
    correctAnswers INT := 0;
    totalAnswers INT := 0;
    percentage FLOAT := 0;
    maxPoints INT := 0;
    userScore INT := 0;
    currentPoints INT := 0;
BEGIN
    IF user_results IS NOT NULL THEN
        IF (user_results->>'wholeAnswerIsCorrect')::BOOLEAN = TRUE THEN
            percentage := 1.0;
        ELSE
            totalAnswers := json_array_length(user_results->'results');
            FOR i IN 0..totalAnswers-1 LOOP
                    IF (user_results->'results'->i->>'answerIsCorrect')::BOOLEAN = TRUE THEN
                        correctAnswers := correctAnswers + 1;
                    END IF;
                END LOOP;

            IF correctAnswers > 0 AND totalAnswers > 0 THEN
                percentage := correctAnswers::FLOAT / totalAnswers;
            END IF;
        END IF;
    END IF;

    SELECT points INTO maxPoints
    FROM questions
    WHERE id = question_id;

    userScore := ROUND(maxPoints * percentage);

    SELECT points INTO currentPoints FROM user_points WHERE user_id = id_user;

    IF currentPoints IS NOT NULL THEN
        UPDATE user_points
        SET points = currentPoints + userScore
        WHERE user_id = id_user;
    ELSE
        INSERT INTO user_points (user_id, points)
        VALUES (id_user, userScore);
    END IF;
    RETURN userScore;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION calculate_user_score_true_false(question_id INTEGER, user_result BOOLEAN, id_user UUID) RETURNS INTEGER
    LANGUAGE plpgsql
AS $$
DECLARE
    maxPoints INT := 0;
    userScore INT := 0;
    currentPoints INT := 0;
BEGIN

    SELECT points INTO maxPoints
    FROM questions
    WHERE id = question_id;

    IF user_result = TRUE THEN
        userScore := maxPoints;
    ELSE
        userScore := 0;
    END IF;

    SELECT points INTO currentPoints FROM user_points WHERE user_id = id_user;

    IF currentPoints IS NOT NULL THEN
        UPDATE user_points
        SET points = currentPoints + userScore
        WHERE user_id = id_user;
    ELSE
        INSERT INTO user_points (user_id, points)
        VALUES (id_user, userScore);
    END IF;
    RETURN userScore;
END;
$$ LANGUAGE plpgsql;