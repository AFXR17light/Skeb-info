import { ref } from 'vue';
import { useUserApi } from './useUserApi';

export function useWishlist() {
  const creators = ref(JSON.parse(localStorage.getItem('skebWishlist') || '[]'));
  const error = ref(null);
  const { fetchUserInfo } = useUserApi();

  function saveCreators(newCreators) {
    localStorage.setItem('skebWishlist', JSON.stringify(newCreators));
    creators.value = newCreators;
  }

  async function addCreator(username, onError, onSuccess) {
    try {
      error.value = null;
      const cleanUsername = username
        .replace(/^https:\/\/skeb\.jp\/@/, '')
        .replace(/^@/, '')
        .replace(/\s+/g, '_')
        .split('?')[0];

      if (!cleanUsername) {
        throw new Error('Username required');
      }
      if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
        throw new Error('Incorrect username format');
      }

      const data = await fetchUserInfo(cleanUsername);
      if (!data.creator) {
        throw new Error('User is not a creator');
      }
      if (creators.value.some((c) => c.screen_name === data.screen_name)) {
        throw new Error('Creator already in wishlist');
      }

      creators.value.unshift(data);
      saveCreators(creators.value);
      onSuccess();
    } catch (err) {
      error.value = err.message;
      onError(err.message);
    }
  }

  async function updateAllCreators(onError, onSuccess) {
    try {
      error.value = null;
      const updatedCreators = [];
      for (const creator of creators.value) {
        try {
          const data = await fetchUserInfo(creator.screen_name);
          updatedCreators.push(data.creator ? data : creator);
        } catch {
          updatedCreators.push(creator); // Keep old data on error
        }
      }
      saveCreators(updatedCreators);
      onSuccess();
    } catch (err) {
      error.value = err.message;
      onError(err.message);
    }
  }

  function moveCreator(index, direction) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < creators.value.length) {
      const newCreators = [...creators.value];
      [newCreators[index], newCreators[newIndex]] = [newCreators[newIndex], newCreators[index]];
      saveCreators(newCreators);
    }
  }

  function deleteCreator(index) {
    const newCreators = [...creators.value];
    newCreators.splice(index, 1);
    saveCreators(newCreators);
  }

  return { creators, error, addCreator, updateAllCreators, moveCreator, deleteCreator };
}