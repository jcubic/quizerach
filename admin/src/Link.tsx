import { Link as RouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';

type LinkT = Parameters<typeof ChakraLink>[0];

export function Link(props: LinkT) {
  return <ChakraLink as={RouterLink} {...props} />;
}

/*

import { useParams, Link } from 'react-router';


const { id } = useParams();

<Link to={`/books${book.id}`}>

</Link>

*/
