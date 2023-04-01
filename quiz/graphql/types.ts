import { objectType, extendType, asNexusMethod } from 'nexus';
import { GraphQLDateTime } from 'graphql-scalars';

export const GQLDate = asNexusMethod(GraphQLDateTime, 'date')


type UserArgs = {
  id?: number;
  email?: string;
};

export const User = objectType({
    name: 'User',
    definition(t) {
        t.nonNull.int('user_id');
        t.nonNull.string('email');
        t.string('token');
        t.date('token_expiration');
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
    definition(t) {
        t.nonNull.int('answer_id');
        t.nonNull.int('user_id');
        t.nonNull.int('question_id');
        t.string('answer');
        t.nonNull.field('user', {
            type: User,
            resolve: async (parent, _args, ctx) => {
                const { user_id } = parent;
                return ctx.prisma.user.findUnique({
                    where: {
                        user_id
                    }
                });
            }
        });
        t.nonNull.field('question', {
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
    }
});

export const Option = objectType({
    name: 'Option',
    definition(t) {
        t.nonNull.int('option_id');
        t.nonNull.int('question_id');
        t.nonNull.string('label');
        t.nonNull.boolean('valid');
        t.nonNull.field('question', {
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
    definition(t) {
        t.nonNull.int('question_id');
        t.nonNull.int('poll_id');
        t.nonNull.string('intro_text');
        t.nonNull.string('outro_text');
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

export const Query = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('users', {
            type: User,
            resolve: async (_root, _args, ctx) => {
                return ctx.prisma.user.findMany();
            }
        });
        t.nonNull.list.field('questions', {
            type: Question,
            resolve: async (_root, _args, ctx) => {
                return ctx.prisma.question.findMany();
            }
        });
    }
});
