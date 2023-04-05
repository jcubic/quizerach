import { extendBaseTheme, type ThemeConfig } from '@chakra-ui/react';

import chakraTheme from '@chakra-ui/theme'

const { Tabs, Textarea, Radio, Input } = chakraTheme.components

export const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: true
};

export const theme = extendBaseTheme({
    config,
    components: {
        Tabs,
        Textarea,
        Radio,
        Input
    }
});
