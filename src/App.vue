<template>
  <router-view />
</template>

<script>
import { useDarkMode } from './composables/useDarkMode';

export default {
  setup() {
    const { isDark } = useDarkMode();
    return { isDark };
  },
};
</script>