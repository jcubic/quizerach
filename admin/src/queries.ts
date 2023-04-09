import { gql } from './__generated__/gql';

export const POLL_SET = gql(`
query poll_set_and_users {
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
  users {
    user_id
    email
    answers {
      question {
        poll {
          poll_id
        }
      }
      option {
        valid
      }
    }
  }
}
`);
