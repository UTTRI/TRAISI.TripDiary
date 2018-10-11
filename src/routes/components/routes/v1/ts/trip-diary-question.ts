import {Staisi} from "../../survey/survey"

/**
 * Trip Diary Question
 */
class TripDiaryQuestion implements Staisi.ISurveyQuestion {
    questionId: string;
    questionType: string;

    bootstrap(): boolean {
        throw new Error("Method not implemented.");
    }

    clearResponse(): boolean {
        throw new Error("Method not implemented.");
    }

    getResponse(): string {
        throw new Error("Method not implemented.");
    }

}
