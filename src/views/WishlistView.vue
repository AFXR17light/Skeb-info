<template>
  <div class="h-full py-6 text-gray-900 dark:text-gray-100 transition-all duration-200">
    <div class="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-[#292c2e] rounded-lg shadow-lg">
      <AppHeader subtitle="Wishlist" />
      <SearchInput @add-creator="addCreator" @update-all="updateAllCreators" />
      <WishlistTable :creators="creators" @move="moveCreator" @delete="deleteCreator" />
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue';
import SearchInput from '../components/SearchInput.vue';
import WishlistTable from '../components/WishlistTable.vue';
import { useWishlist } from '../composables/useWishlist';

export default {
  components: { AppHeader, SearchInput, WishlistTable },
  setup() {
    const { creators, addCreator, updateAllCreators, moveCreator, deleteCreator } = useWishlist();
    return { creators, addCreator, updateAllCreators, moveCreator, deleteCreator };
  },
};
</script>