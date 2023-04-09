import { Flex } from '@chakra-ui/react';

type SidebarT = {
    children: React.ReactNode;
    width: number | string;
    background?: string;
};

export default function Sidebar({ children, width, background }: SidebarT) {
    return (
        <Flex
            position="sticky"
            left="0"
            top="2.5vh"
            m="2.5vh 10px"
            h="95vh"
            backgroundColor={background ?? '#1a1a1a'}
            borderRadius={"10px"}
            w={width}
            flexDir="column"
            justifyContent="space-between"
        >
          <Flex
              p="1.5em"
              flexDir="column"
              w="100%"
              alignItems={"flex-start"}
              as="nav">
            {children}
          </Flex>
        </Flex>
    );
}
