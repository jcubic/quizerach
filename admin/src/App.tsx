import { useState } from 'react';
import { useQuery } from "@apollo/client";
import {
    Heading,
    Flex,
    Box
} from '@chakra-ui/react';

import Poll from './Poll';
import NavItem from './NavItem';
import Sidebar from './Sidebar';
import PullDown from './PullDown';
import { POLL_SET } from './queries';

function App() {
    const [ selection, setSelection ] = useState<{poll?: number; set?: number}>({});
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
    const { sets } = data;

    const poll = sets[selection.set ?? 0].polls[selection.poll ?? 0];

    function pickPoll(set: number, poll: number) {
        setSelection({ set, poll });
    }

    return (
        <div className="App">
          <Flex>
            <Sidebar width="250px">
              <Heading as="h1">Quizerach: Admin</Heading>
              <PullDown title="Polls" open>
                {sets.map((set, set_index: number)  => {
                    return (
                        <PullDown key={set_index} title={set.name}>
                          {set.polls.map((poll, poll_index: number) => {
                              return (
                                  <NavItem key={poll_index} onClick={() => pickPoll(set_index, poll_index)}>
                                    {poll.name}
                                  </NavItem>
                              );
                          })}
                        </PullDown>
                    );
                })}
              </PullDown>
            </Sidebar>
            <Box p="1em" w="100%" maxW="700px">
              <Heading>{poll.name}</Heading>
              <Poll data={poll} />
            </Box>
          </Flex>
        </div>
    );
}

export default App;
