import { ref } from 'vue';

export function useUserApi() {
  const userData = ref(null);
  const sentWorks = ref([]);
  const receivedWorks = ref([]);
  const error = ref(null);

  async function fetchUserInfo(username) {
    try {
      error.value = null;
      const cleanUsername = username
        .replace(/^https:\/\/skeb\.jp\/@/, '')
        .replace(/^@/, '')
        .replace(/\s+/g, '_')
        .split('?')[0];

      if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
        throw new Error('Incorrect username format');
      }

      const response = await fetch(`/api/users/${cleanUsername}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      const data = await response.json();
      userData.value = data;
      document.title = `${cleanUsername} - 🔍(๑• . •๑)`;
      history.pushState({}, '', `/@${cleanUsername}`);
      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  async function fetchClientWorks(username, total, onProgress = () => {}) {
    try {
      error.value = null;
      sentWorks.value = [];
      let works = [];
      let nextUrl = `/api/users/${username}/works?role=client&limit=${total}`;
      let subRequestCount = 0;

      while (nextUrl && subRequestCount < 5) {
        const response = await fetch(nextUrl);
        if (!response.ok && response.status !== 206) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch client works');
        }
        const responseJson = await response.json();
        if (!responseJson.data || !responseJson.meta) {
          throw new Error('Invalid response structure: missing data or meta');
        }
        works = works.concat(responseJson.data);
        nextUrl = responseJson.meta.next;
        subRequestCount++;
        onProgress(subRequestCount - 1, responseJson.meta.remain);
      }

      sentWorks.value = works;
    } catch (err) {
      error.value = err.message;
    }
  }

  return { userData, sentWorks, receivedWorks, error, fetchUserInfo, fetchClientWorks };
}