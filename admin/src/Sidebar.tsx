import { useState } from 'react';
import { Flex } from '@chakra-ui/react';

type SidebarT = { children: React.ReactNode };

type NavSize = "large" | "small";

export default function Sidebar({ children }: SidebarT) {
    const [navSize] = useState<NavSize>('large');
    return (
        <Flex
            pos="sticky"
            left="5"
            h="95vh"
            marginTop="2.5vh"
            boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
            borderRadius={navSize == "small" ? "15px" : "30px"}
            w={navSize == "small" ? "75px" : "200px"}
            flexDir="column"
            justifyContent="space-between"
        >
          <Flex
              p="5%"
              flexDir="column"
              w="100%"
              alignItems={navSize == "small" ? "center" : "flex-start"}
              as="nav">
            {children}
          </Flex>
        </Flex>
    );
}
