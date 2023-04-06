import type { Poll } from './__generated__/graphql';
import {
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

type PollT = {
    data: Poll;
};

const Poll = ({ data: poll }: PollT) => {
    return (
        <Tabs>
          <TabList>
            {poll.questions.map((question, index) => {
                const { question_id: id } = question;
                return (
                    <Tab key={`tab-${id}`}>{index + 1}</Tab>
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
                          <dd>
                            <Textarea
                                height="300px"
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
                                          value={index.toString()}
                                          isChecked={valid}
                                          onChange={() => {}}
                                      />
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
    );
};

export default Poll;
