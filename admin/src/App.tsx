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

import { POLL_SET } from './queries';

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
          <Flex>
            <Sidebar>
              <Heading as="h1">Quizerach: Admin</Heading>
              <NavItem navSize="large" title="Polls" />
            </Sidebar>
            <Box>
              {<h2>Set: {set.name}</h2>}
              <ul>
                {set.polls.map((poll: Poll, index: number) => {
                    return (
                        <li key={`${index} ${poll.name}`}>
                          <Heading>{poll.name}</Heading>
                          <Poll data={poll} />
                        </li>
                    );
                })}
              </ul>
            </Box>
          </Flex>
        </div>
    );
}

export default App;
