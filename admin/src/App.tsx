import './App.css';
import { useQuery } from "@apollo/client";
import { gql } from './__generated__/gql';

const POLL_SET = gql(`
query PollSet {
  sets {
    name
    polls {
      name
      questions {
        intro_text
        outro_text
        options {
          label
          valid
        }
      }
    }
  }
}
`);

function App() {
    const { loading, error, data } = useQuery(POLL_SET);

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error || !data) {
        return <p className="error">{error.message}</p>;
    }
    const { sets: [set] } = data;

    return (
        <div className="App">
          <h1>Quizerach: Admin</h1>
          {<h2>Set: {set.name}</h2>}
          <ul>
            {set.polls.map((poll, index) => {
                return (
                    <li key={`${index} ${poll.name}`}>
                      <h3>{poll.name}</h3>
                      <ul>
                        {poll.questions.map(question => {
                            return (
                                <li>
                                  <dl>
                                    <dt>Question:</dt>
                                    <dd><textarea value={question.intro_text}/></dd>
                                    <dt>Answer:</dt>
                                    <dd><textarea value={question.outro_text}/></dd>
                                  </dl>
                                </li>
                            );
                        })}
                      </ul>
                    </li>
                );
            })}
          </ul>
        </div>
    );
}

export default App;
