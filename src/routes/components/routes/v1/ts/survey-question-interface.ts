export interface ISurveyQuestion {

    /* The id of the question */
    questionId: string;

    /* The type of question (name) */
    questionType: string;

    /* To clear the current state / response of the question */
    clearResponse(): boolean;

    /* To return the current state / response of the question */
    getResponse(): string;

    /* Intializes the question (bootstrap modules , etc) */
    bootstrap(questionId: string): boolean;


}


