<template>
  <div class="py-6">
    <a href="/" class="text-5xl font-bold mb-4 text-center block text-teal-500">Skeb info</a>
    <div v-if="subtitle" class="text-2xl font-bold text-center block text-teal-500 opacity-50 mb-4">{{ subtitle }}</div>
    <div class="text-4xl mb-4 text-center">
      <span class="inline-block cursor-default select-none">🔍</span>
      <span
        class="inline-block cursor-pointer select-none"
        :class="{ 'animate__animated animate__rubberBand': isAnimating }"
        @click="animate"
      >
        {{ emoji }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    subtitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      emoji: '(๑• . •๑)',
      isAnimating: false,
    };
  },
  methods: {
    animate() {
      this.isAnimating = true;
      this.emoji = '(๑>.<๑)';
      setTimeout(() => {
        this.emoji = '(๑• . •๑)';
        this.isAnimating = false;
      }, 100);
    },
  },
};
</script>