import { marked } from 'marked';
import { Response } from 'express';
import { Poll, Question, Option, Set, Answer } from "@prisma/client";


import { random_pick, is_boolean } from './utils';
import strings from './strings.json';

type QuestionWithOptions = Question & {Option: Option[]};

type Questions = Array<QuestionWithOptions & {Answer: Pick<Answer, 'option_id' | 'answer'>[]}>;
type Quiz = Poll & {set: Set} & {Question: Questions}

type UserAnswer = {
    index: number;
    valid: boolean;
    prompt: string;
    outro: string;
    text: string | null;
} | {
    outro: string;
    text: string | null;
} | undefined;


export function format_answer(question: QuestionWithOptions, valid: boolean): {
    valid: boolean;
    prompt: string;
    outro: string;
};

export function format_answer(question: QuestionWithOptions): {
    outro: string;
};

export function format_answer(question: QuestionWithOptions, valid?: boolean) {
    const outro = marked.parse(question.outro_text);
    if (is_boolean(valid)) {
        return {
            valid,
            prompt: random_pick(valid ? strings.valid : strings.invalid),
            outro
        };
    } else {
        return {
            outro
        };
    }
}

export function render_quiz(res: Response, quiz: Quiz, index: number) {
    const questions = quiz.Question;
    const title = quiz.set.name;
    const question = questions[index];
    if (!question) {
        return res.send('404');
    }
    let answer: UserAnswer;
    if (question.Answer.length) {
        const user_answer = question.Answer[0];
        const index = question.Option.findIndex(option => {
            return option.option_id === user_answer.option_id;
        });
        let valid;
        if (index !== -1) {
            valid = question.Option[index].valid;
            answer = {
                index,
                ...format_answer(question, valid),
                valid,
                text: user_answer.answer
            };
        } else {
            answer = {
                ...format_answer(question),
                text: user_answer.answer
            };
        }
    }
    res.render('pages/question', {
        question: marked.parse(question.intro_text),
        title,
        index,
        answer,
        poll: quiz.poll_id,
        slug: quiz.slug,
        progress: {
            index,
            max: questions.length
        },
        options: question.Option.map(({ label }, i) => {
            const char = String.fromCharCode(97 + i);
            return {
                icon: `letter_${char}`,
                label
            };
        })
    });
}
