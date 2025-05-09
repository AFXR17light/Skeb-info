<template>
    <div class="py-2 px-4">
        <div class="mb-4 relative">
            <input v-model="username" type="text"
                :placeholder="isWishlist ? 'Skeb creator username' : 'Skeb link or username'" @input="restore"
                @keypress.enter="emitAction"
                class="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 pr-10" />
            <button @click="clearInput"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                    </path>
                </svg>
            </button>
        </div>
        <button :class="addButtonClasses" :disabled="isLoading" @click="emitAction">
            {{ addButtonText }}
        </button>
        <button v-if="isWishlist" :class="updateButtonClasses" :disabled="isLoading" @click="$emit('update-all')">
            {{ updateButtonText }}
        </button>
    </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
    props: {
        isWishlist: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['add-creator', 'update-all', 'search'],
    setup(props, { emit }) {
        const username = ref('');
        const isLoading = ref(false);
        const addButtonText = ref(props.isWishlist ? 'Add Creator' : 'Search');
        const updateButtonText = ref('Update All Creators');
        const spyglass = ref('🔍');
        const emoji = ref('(๑• . •๑)');

        const addButtonClasses = computed(() => [
            'w-full p-2 rounded transition-colors',
            isLoading.value
                ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                : 'bg-[#28837f] hover:bg-[#206966] text-white',
        ]);

        const updateButtonClasses = computed(() => [
            'w-full mt-2 p-2 rounded transition-colors',
            isLoading.value
                ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                : 'bg-gray-500 hover:bg-gray-600 text-white',
        ]);

        function clearInput() {
            username.value = '';
            restore();
        }

        function restore() {
            isLoading.value = false;
            addButtonText.value = props.isWishlist ? 'Add Creator' : 'Search';
            updateButtonText.value = 'Update All Creators';
            spyglass.value = '🔍';
            emoji.value = '(๑• . •๑)';
        }

        function emitAction() {
            if (!isLoading.value) {
                isLoading.value = true;
                addButtonText.value = 'Loading...';
                spyglass.value = '🔄';
                emit(props.isWishlist ? 'add-creator' : 'search', username.value);
            }
        }

        // Expose methods to allow parent to reset state after API calls
        return {
            username,
            isLoading,
            addButtonText,
            updateButtonText,
            spyglass,
            emoji,
            addButtonClasses,
            updateButtonClasses,
            clearInput,
            restore,
            emitAction,
        };
    },
};
</script>