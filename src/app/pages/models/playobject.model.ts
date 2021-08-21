

export interface PlayObject {
    text: string,
    id: number,
    error?: boolean,
    letters: LetterObject[],
    success?: boolean,
    completed?: boolean;
}

export interface LetterObject {
    letter: string,
    id: number;

}

export interface Quote {
    quote: string,
    text?: string,
    author: string,
}