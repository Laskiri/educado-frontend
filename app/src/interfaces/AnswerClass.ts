export class Answer {
    text: string = "";
    feedback: string = "";
    isCorrect: boolean = false; 
    
    constructor(){};


    /**
     * 
     * @param text - The text to set the answer to
     */
    public setText(text: string) {
        this.text = text;
    }

    /**
     * 
     * @param feedback - The feedback to set the answer to
     */
    public setFeedback(feedback: string) {
        this.feedback = feedback;
    }

    /**
     * 
     * @param isCorrect - The boolean to set the answer to
     */
    public setIsCorrect(isCorrect: boolean) {
        this.isCorrect = isCorrect;
    }

    public setAll(text: string, feedback: string, isCorrect: boolean) {
        this.text = text;
        this.feedback = feedback;
        this.isCorrect = isCorrect;
    }
    

}