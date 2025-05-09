<template>
  <App :username="username" />
</template>

<script>
import App from './App.vue';
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import { useUserApi } from '../composables/useUserApi';

export default {
  components: { App },
  setup() {
    const route = useRoute();
    const { fetchUserInfo } = useUserApi();
    const username = ref(route.params.username || '');

    console.log('HomeView: Initial username:', username.value);

    watch(
      () => route.params.username,
      (newUsername) => {
        console.log('HomeView: Route username changed:', newUsername);
        username.value = newUsername || '';
        if (newUsername) {
          console.log('HomeView: Fetching user info for:', newUsername);
          fetchUserInfo(newUsername);
        }
      },
      { immediate: true }
    );

    return { username };
  },
};
</script>