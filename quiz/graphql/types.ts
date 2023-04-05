import { GraphQLDateTime } from 'graphql-scalars';
import {
    objectType,
    inputObjectType,
    extendType,
    asNexusMethod,
    nonNull,
    arg
} from 'nexus';
import {
    Answer as AnswerP,
    Option as OptionP,
    Question as QuestionP,
    Poll as PollP,
    User as UserP,
    Set as SetP
} from 'nexus-prisma';

import doc from './docs';
import logger from '../logger';


function error(message: string): never {
    logger.error(`GQL Error: ${message}`);
    throw new Error(message);
}

export const GQLDate = asNexusMethod(GraphQLDateTime, 'date');

export const User = objectType({
    name: 'User',
    description: doc('User'),
    definition(t) {
        t.field(UserP.user_id);
        t.field(UserP.email);
        t.field(UserP.token);
        t.field(UserP.token_expiration);
        t.nonNull.list.nonNull.field("answers", {
            type: Answer,
            resolve: async (parent, _args, ctx) => {
                const { user_id } = parent;
                return ctx.prisma.answer.findMany({
                    where: {
                        user_id
                    }
                });
            }
        })
    }
});

export const Answer = objectType({
    name: 'Answer',
    description: doc('Answer'),
    definition(t) {
        t.field(AnswerP.answer_id);
        t.field(AnswerP.user_id);
        t.field(AnswerP.question_id);
        t.field(AnswerP.answer);
        t.nonNull.field('user', {
            type: User,
            resolve: async (parent, _args, ctx) => {
                const { user_id } = parent;
                const user = await ctx.prisma.user.findUnique({
                    where: {
                        user_id
                    }
                });
                if (!user) {
                    error(`user with id ${user_id} not found`)
                }
                return user;
            }
        });
        t.nonNull.field('question', {
            type: Question,
            resolve: async (parent, _args, ctx) => {
                const { question_id } = parent;
                const question = await ctx.prisma.question.findUnique({
                    where: {
                        question_id
                    }
                });
                if (!question) {
                    error(`question with id ${question_id} not found`);
                }
                return question;
            }
        });
    }
});

export const Option = objectType({
    name: 'Option',
    description: doc('Option'),
    definition(t) {
        t.field(OptionP.option_id);
        t.field(OptionP.question_id);
        t.field(OptionP.label);
        t.field(OptionP.valid);
        t.field('question', {
            type: Question,
            resolve: async (parent, _args, ctx) => {
                const { question_id } = parent;
                return ctx.prisma.question.findUnique({
                    where: {
                        question_id
                    }
                });
            }
        });
        t.nonNull.list.nonNull.field('answers', {
            type: Answer,
            resolve: async (parent, _args, ctx) => {
                const { question_id, option_id } = parent;
                return ctx.prisma.answer.findMany({
                    where: {
                        option_id,
                        question_id
                    }
                });
            }
        });
    }
});

export const Question = objectType({
    name: 'Question',
    description: doc('Question'),
    definition(t) {
        t.field(QuestionP.question_id);
        t.field(QuestionP.poll_id);
        t.field(QuestionP.intro_text);
        t.field(QuestionP.outro_text);
        t.nonNull.list.nonNull.field('answers', {
            type: Answer,
            resolve: async (parent, _args, ctx) => {
                const { question_id } = parent;
                return ctx.prisma.answer.findMany({
                    where: {
                        question_id
                    }
                });
            }
        });
        t.nonNull.field('poll', {
            type: Poll,
            resolve: async (parent, _args, ctx) => {
                const { poll_id } = parent;
                const poll = await ctx.prisma.poll.findUnique({
                    where: {
                        poll_id
                    }
                });
                if (!poll) {
                    error(`Poll with id ${poll_id} not found`);
                }
                return poll;
            }
        });
        t.nonNull.list.nonNull.field('options', {
            type: Option,
            resolve: async (parent, _args, ctx) => {
                const { question_id } = parent;
                return ctx.prisma.option.findMany({
                    where: {
                        question_id
                    }
                });
            }
        });
    }
});

export const Poll = objectType({
    name: 'Poll',
    description: doc('Poll'),
    definition(t) {
        t.field(PollP.poll_id);
        t.field(PollP.set_id);
        t.field(PollP.name);
        t.field(PollP.slug);
        t.nonNull.list.nonNull.field('questions', {
            type: Question,
            resolve: async (parent, _args, ctx) => {
                const { poll_id } = parent;
                return ctx.prisma.question.findMany({
                    where: {
                        poll_id
                    }
                });
            }
        });
    }
});

export const Set = objectType({
    name: 'Set',
    description: doc('Set'),
    definition(t) {
        t.field(SetP.set_id);
        t.field(SetP.name);
        t.nonNull.list.nonNull.field('polls', {
            type: Poll,
            resolve: (parent, args, ctx) => {
                const { set_id } = parent;
                return ctx.prisma.poll.findMany({
                    where: {
                        set_id
                    }
                });
            }
        });
    }
});

export const UserWhereInput = inputObjectType({
    name: 'UserWhereInput',
    definition(t) {
        t.int('user_id');
        t.string('email');
        t.field('filter', {
            type: 'StringFilterInput'
        });
    }
});

export const StringFilterInput = inputObjectType({
  name: 'StringFilterInput',
  definition(t) {
    t.string('contains');
  },
});

export const Query = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.nonNull.field('sets', {
            type: Set,
            resolve: async (_root, _args, ctx) => {
                return ctx.prisma.set.findMany();
            }
        });
        t.nonNull.list.nonNull.field('users', {
            type: User,
            args: {
                where: arg({
                    type: 'UserWhereInput'
                })
            },
            resolve: async (_root, { where }, ctx) => {
                let whereClause = {};
                if (where?.email) {
                    const {
                        email,
                        user_id
                    } = where;
                    whereClause = {
                        email,
                        user_id
                    };
                }
                if (where?.filter) {
                    const { contains } = where.filter;
                    whereClause = {
                        email: {
                            contains
                        }
                    }
                }
                const users = await ctx.prisma.user.findMany({
                    where: whereClause
                });
                return users.map((user) => ({
                    email: user.email,
                    token: user.token,
                    token_expiration: user.token_expiration,
                    user_id: user.user_id
                }));
            }
        });
        t.nonNull.list.nonNull.field('questions', {
            type: Question,
            resolve: async (_root, _args, ctx) => {
                return ctx.prisma.question.findMany();
            }
        });
    }
});
