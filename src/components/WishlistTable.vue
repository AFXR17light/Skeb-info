<template>
  <div v-if="creators.length" class="mt-8">
    <h2 class="text-lg font-bold mb-4 py-2 px-4">Wishlist Creators</h2>
    <hr />
    <div class="max-h-64 overflow-y-auto">
      <table class="w-full text-left border-collapse">
        <tbody>
          <tr
            v-for="(creator, index) in creators"
            :key="creator.screen_name"
            class="border-t border-gray-300 dark:border-gray-600"
          >
            <td class="py-2 px-4 text-sm sm:text-base">
              <a
                :href="`https://skeb.jp/@${creator.screen_name}`"
                target="_blank"
                class="text-[#28837f] hover:underline"
              >
                {{ creator.name }}
              </a>
            </td>
            <td class="py-2 px-4 text-sm sm:text-base">
              <span
                :class="creator.acceptable ? 'font-bold text-sm text-green-600' : 'font-bold text-sm text-gray-500'"
              >
                {{ creator.acceptable ? 'Seeking' : 'Stopped' }}
              </span>
            </td>
            <td class="py-2 px-4 text-sm sm:text-base">
              <template v-if="creator.skills?.length">
                <div v-if="creator.skills.length > 1">
                  <div
                    v-for="skill in creator.skills"
                    :key="skill.genre"
                    v-html="`<span class='font-bold'>${skill.genre}</span> ${skill.default_amount}`"
                  ></div>
                </div>
                <span v-else>{{ creator.skills[0].default_amount }}</span>
              </template>
            </td>
            <td class="py-2 px-4 text-sm sm:text-base">
              {{ formatTimeInfo(creator) }}
            </td>
            <td class="py-2 px-4 text-sm sm:text-base flex space-x-2">
              <button
                :disabled="index === 0"
                @click="$emit('move', index, -1)"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
              </button>
              <button
                :disabled="index === creators.length - 1"
                @click="$emit('move', index, 1)"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <button
                @click="$emit('delete', index)"
                class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <p v-else class="text-gray-500 dark:text-gray-400 py-2 px-4">No creators in wishlist.</p>
</template>

<script>
export default {
  props: {
    creators: {
      type: Array,
      required: true,
    },
  },
  emits: ['move', 'delete'],
  methods: {
    formatTimeInfo(creator) {
      const avgResponseDays = creator.received_requests_average_response_time
        ? (creator.received_requests_average_response_time / 86400).toFixed(0)
        : '';
      const avgCompletionDays = creator.completing_average_time
        ? (creator.completing_average_time / 86400).toFixed(0)
        : '';
      const acceptExpiration = creator.accept_expiration_days || '';
      const completeExpiration = creator.complete_expiration_days || '';
      return (avgResponseDays || acceptExpiration)
        ? `${acceptExpiration ? `${acceptExpiration}/${completeExpiration}` : ''} ${
            avgResponseDays ? `(${avgResponseDays}/${avgCompletionDays})` : ''
          }`.trim()
        : '';
    },
  },
};
</script>