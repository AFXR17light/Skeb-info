<template>
    <div v-if="hasQueried" class="mt-8">
        <h2 class="text-lg font-bold mb-4 py-2 px-4">{{ title }}</h2>
        <hr />
        <div v-if="isLoading" class="text-gray-500 dark:text-gray-400 py-2 px-4">
            Loading {{ title.toLowerCase() }}... <span v-if="subRequestCount"> (part {{ subRequestCount + 1 }} / {{
                subRequestCount + remain }})</span>
        </div>
        <div v-else-if="error" class="text-red-500 dark:text-red-400 py-2 px-4">
            Error fetching {{ title.toLowerCase() }}: {{ error }}
        </div>
        <div v-else class="max-h-64 overflow-y-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-gray-300 dark:border-gray-600">
                        <th class="py-2 px-4 font-semibold text-sm sm:text-base">Name</th>
                        <th class="py-2 px-4 font-semibold text-sm sm:text-base">Tipped / Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!sortedCreators.length">
                        <td colspan="2" class="py-2 px-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                            No {{ title.toLowerCase() }} found.
                        </td>
                    </tr>
                    <tr v-for="creator in sortedCreators" :key="creator.name"
                        class="border-t border-gray-300 dark:border-gray-600">
                        <td class="py-2 px-4 text-sm sm:text-base">
                            <a :href="`https://skeb.jp/@${creator.name}`" target="_blank"
                                class="text-teal-700 hover:underline">
                                {{ creator.name }}
                            </a>
                        </td>
                        <td class="py-2 px-4 text-sm sm:text-base">
                            {{ creator.tips }} / {{ creator.requests }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useUserApi } from '../composables/useUserApi';

export default {
    props: {
        title: {
            type: String,
            default: 'Client Requests by Creator',
        },
        username: {
            type: String,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
    },
    setup(props) {
        const { sentWorks, error, fetchClientWorks } = useUserApi();
        const isLoading = ref(false);
        const subRequestCount = ref(0);
        const remain = ref(0);
        const hasQueried = ref(false);

        // Aggregate works by creator
        const creatorStats = computed(() => {
            const stats = {};
            for (const work of sentWorks.value) {
                const creatorPath = work.path.split('/works/')[0];
                const creatorName = creatorPath.replace('/@', '');
                if (!stats[creatorName]) {
                    stats[creatorName] = { requests: 0, tips: 0 };
                }
                stats[creatorName].requests += 1;
                if (work.tipped) {
                    stats[creatorName].tips += 1;
                }
            }
            return stats;
        });

        // Sort creators by requests and tips
        const sortedCreators = computed(() => {
            return Object.entries(creatorStats.value)
                .map(([name, stats]) => ({ name, ...stats }))
                .sort((a, b) => {
                    if (a.requests !== b.requests) {
                        return b.requests - a.requests;
                    }
                    if (a.tips !== b.tips) {
                        return b.tips - a.tips;
                    }
                    return 0;
                });
        });

        // Fetch works when username or total changes
        watch(
            () => [props.username, props.total],
            async ([newUsername, newTotal]) => {
                if (newUsername && newTotal) {
                    hasQueried.value = true;
                    isLoading.value = true;
                    subRequestCount.value = 0;
                    remain.value = 0;
                    try {
                        await fetchClientWorks(newUsername, newTotal, (count, rem) => {
                            subRequestCount.value = count;
                            remain.value = rem;
                        });
                    } finally {
                        isLoading.value = false;
                    }
                }
            },
            { immediate: false } // Prevent initial fetch on mount
        );

        return {
            isLoading,
            subRequestCount,
            remain,
            error,
            sortedCreators,
            hasQueried,
        };
    },
};
</script>