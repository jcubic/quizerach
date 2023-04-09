import {
    Flex,
    Text,
    Link
} from '@chakra-ui/react'

type NavHoverBoxT = {
    active?: boolean;
    children: React.ReactNode;
    onClick: () => void;
};

export default function NavItem({ children, active = false, ...props }: NavHoverBoxT) {
    return (
        <Flex
            flexDir="column"
            w="100%"
            alignItems={"flex-start"}>
          <Link
              backgroundColor={active ? "#AEC8CA" : undefined}
              p={3}
              w={"100%"}
              cursor="pointer"
              borderRadius={8}
              _hover={{ textDecor: 'none', backgroundColor: "#3F444E" }}
              {...props}>
            <Flex>
              <Text w="100%">{children}</Text>
            </Flex>
          </Link>
        </Flex>
    );
};
