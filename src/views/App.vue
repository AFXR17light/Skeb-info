<template>
  <div class="h-full py-6 text-gray-900 dark:text-gray-100 transition-all duration-200">
    <div class="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-[#292c2e] rounded-lg shadow-lg">
      <AppHeader />
      <SearchInput @search="fetchUserInfo" />
      <UserInfo v-if="userData" :user-data="userData" />
      <WorksTable
        v-if="userData?.sent_public_works_count && hasQueried"
        title="Client Requests by Creator"
        :username="username"
        :total="userData.sent_public_works_count"
      />
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue';
import SearchInput from '../components/SearchInput.vue';
import UserInfo from '../components/UserInfo.vue';
import WorksTable from '../components/WorksTable.vue'; // Corrected import
import { ref } from 'vue';
import { useUserApi } from '../composables/useUserApi';
import { useRouter } from 'vue-router';

export default {
  components: { AppHeader, SearchInput, UserInfo, WorksTable },
  props: {
    username: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { userData, fetchUserInfo } = useUserApi();
    const router = useRouter();
    const localUsername = ref(props.username);
    const hasQueried = ref(!!props.username); // Set true if username is provided

    console.log('App: Initial username:', localUsername.value);
    console.log('App: Initial userData:', userData.value);

    return { userData, username: localUsername, fetchUserInfo, hasQueried };
  },
};
</script>