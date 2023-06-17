import groupBy from 'lodash/groupBy';

import type { Poll_Set_And_UsersQuery } from './__generated__/graphql';

type MappingFunction<T> = ([key, value]: [string, T]) => ([string, any]);

function map_object<T>(obj: {[key: string]: T}, callback: MappingFunction<T>) {
    return Object.fromEntries(Object.entries(obj).map(callback));
}

type Users = Poll_Set_And_UsersQuery["users"];
type Answers = Poll_Set_And_UsersQuery["users"][0]["answers"];
type Answer = Answers[0];

export function map_users(users: Users) {
    return users.map(user => {
        const { user_id, email, answers: data } = user;
        const answers = map_object(groupBy(data, (answer: Answer) => {
            return answer.question.poll.poll_id;
        }), function([poll_id, answers]) {
            return [poll_id, answers.map(answer => {
                return answer.option?.valid || true;
            })];
        });
        return { user_id, email, answers };
    });
}
