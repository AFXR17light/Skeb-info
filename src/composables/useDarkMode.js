import { ref, watch } from 'vue';

export function useDarkMode() {
  const isDark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches);

  watch(isDark, (val) => {
    document.documentElement.classList.toggle('dark', val);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    isDark.value = e.matches;
  });

  return { isDark };
}