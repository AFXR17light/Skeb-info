<template>
  <div v-if="userData" class="mt-8">
    <div class="py-2 px-4 flex items-baseline">
      <a :href="`https://skeb.jp/@${userData.screen_name}`" target="_blank" class="text-2xl font-bold hover:underline">
        {{ userData.name }}
      </a>
      <span v-if="userData.acceptable" class="font-bold text-sm text-green-600 ml-2">seeking</span>
      <span v-else class="font-bold text-sm text-gray-500 ml-2">stopped</span>
    </div>
    <p class="py-2 px-4" v-text="sanitizeDescription(userData.description)"></p>
    <!-- Add links and table as in original -->
  </div>
</template>
<script>
export default {
  props: {
    userData: Object,
  },
  methods: {
    sanitizeDescription(description) {
      if (!description) return 'no description';
      const div = document.createElement('div');
      div.textContent = description;
      return div.textContent;
    },
  },
};
</script>