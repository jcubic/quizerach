import { gql } from './__generated__/gql';

export const POLL_SET = gql(`
query PollSet {
  sets {
    name
    polls {
      name
      questions {
        question_id
        intro_text
        outro_text
        options {
          option_id
          label
          valid
        }
      }
    }
  }
}
`);
