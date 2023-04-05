import { useQuery } from "@apollo/client";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

import { gql } from './__generated__/gql';
import './App.css';


const POLL_SET = gql(`
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

function App() {
    const { loading, error, data } = useQuery(POLL_SET);

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error || !data) {
        return <p className="error">{error?.message ?? 'no data'}</p>;
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
                      <Tabs>
                        <TabList>
                          {poll.questions.map((question, index) => {
                              const { question_id: id } = question;
                              return (
                                  <Tab key={`tab-${id}`}>{index}</Tab>
                              );
                          })}
                        </TabList>
                        <TabPanels>
                          {poll.questions.map(question => {
                              const { question_id: id } = question;
                              return (
                                  <TabPanel key={`panel-${id}`}>
                                    <fieldset>
                                      <legend>Question {index + 1}</legend>
                                      <dl>
                                        <dt>Question:</dt>
                                        <dd><textarea value={question.intro_text} onChange={() => {}} /></dd>
                                        <dt>Options:</dt>
                                        <dd>
                                          <ul>
                                            {question.options.map(option => {
                                                return (
                                                    <li key={option.option_id}>
                                                      <input value={option.label} onChange={() => {}} />
                                                      <input type="radio"
                                                             name={`q-${id}`}
                                                             checked={option.valid}
                                                             onChange={() => {}}
                                                      />
                                                    </li>
                                                );
                                            })}
                                          </ul>
                                        </dd>
                                        <dt>Answer:</dt>
                                        <dd><textarea value={question.outro_text} onChange={() => {}} /></dd>
                                      </dl>
                                    </fieldset>
                                  </TabPanel>
                              );
                          })}
                        </TabPanels>
                      </Tabs>
                    </li>
                );
            })}
          </ul>
        </div>
    );
}

export default App;
