import { useQuery } from "@apollo/client";
import {
    Heading,
    Flex,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Textarea,
    Radio,
    Stack,
    FormControl,
    Input
} from '@chakra-ui/react';

import { gql } from './__generated__/gql';


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
    if (error) {
        return <p className="error">{error.message}</p>;
    }
    if (!data) {
        return <p className="error">no data</p>;
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
                      <Heading>{poll.name}</Heading>
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
                          {poll.questions.map((question, index) => {
                              const { question_id: id } = question;
                              return (
                                  <TabPanel key={`panel-${id}`}>
                                    <fieldset>
                                      <legend>Question {index + 1}</legend>
                                      <dl>
                                        <dt>Question:</dt>
                                        <dd><Textarea
                                                size='xl'
                                                resize={'vertical'}
                                                value={question.intro_text}
                                                onChange={() => {}} />
                                        </dd>
                                        <dt>Options:</dt>
                                        <dd>
                                          <Stack spacing={5}>
                                            {question.options.map(({ label, valid }, index) => (
                                                <FormControl key={index}>
                                                  <Flex gap={2}>
                                                    <Input
                                                        value={label}
                                                        onChange={() => {}}
                                                        placeholder="Enter option label"
                                                    />
                                                    <Radio
                                                        name="option"
                                                        value={label}
                                                        isChecked={valid}
                                                        onChange={() => {}}
                                                    >
                                                  </Radio>
                                                  </Flex>
                                                </FormControl>
                                            ))}
                                          </Stack>
                                        </dd>
                                        <dt>Answer:</dt>
                                        <dd><Textarea
                                                size='sm'
                                                resize={'vertical'}
                                                value={question.outro_text}
                                                onChange={() => {}} />
                                        </dd>
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
