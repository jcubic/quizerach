import type { Poll_Set_And_UsersQuery } from './__generated__/graphql';
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

type Set = Poll_Set_And_UsersQuery["sets"][0];
type Poll = Set["polls"][0];
type Question = Poll["questions"][0];

type PollT = {
    data: Poll;
};

const Poll = ({ data: poll }: PollT) => {
    return (
        <Tabs>
          <TabList>
            {poll.questions.map((question: Question, index: number) => {
                const { question_id: id } = question;
                return (
                    <Tab key={`tab-${id}`}>{index + 1}</Tab>
                );
            })}
          </TabList>
          <TabPanels>
            {poll.questions.map((question: Question) => {
                const { question_id: id } = question;
                return (
                    <TabPanel key={`panel-${id}`}>
                      <dl>
                        <Label>Question:</Label>
                        <Description>
                          <Textarea
                              height="300px"
                              resize={'vertical'}
                              value={question.intro_text}
                              onChange={() => {}} />
                        </Description>
                        <Label>Options:</Label>
                        <Description>
                          <Stack spacing={2}>
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
                        </Description>
                        <Label>Answer:</Label>
                        <Description>
                          <Textarea
                              size='sm'
                              resize={'vertical'}
                              value={question.outro_text}
                              onChange={() => {}} />
                        </Description>
                      </dl>
                    </TabPanel>
                );
            })}
          </TabPanels>
        </Tabs>
    );
};

type LabelT = {
    children: React.ReactNode;
};

const Label = ({ children }: LabelT) => {
    return (
        <dt style={{fontWeight: 'bold'}}>{ children }</dt>
    );
}

type DescriptionT = LabelT;

const Description = ({ children }: DescriptionT) => {
    return (
        <dd>{ children }</dd>
    );
}

export default Poll;
