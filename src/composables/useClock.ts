import { onMounted, onUnmounted, ref } from 'vue'
import { currentLocale } from '@/i18n'
import { dateNames } from '@/i18n/dateNames'

const pad = (n: number) => String(n).padStart(2, '0')

/** Real-time clock: weekday, date and HH:MM, updated every second. */
export function useClock() {
  const now = ref(new Date())
  let timer: ReturnType<typeof setInterval>

  const weekday = ref('')
  const date = ref('')
  const time = ref('')

  const update = () => {
    const d = (now.value = new Date())
    const names = dateNames[currentLocale()]
    weekday.value = names.weekdays[d.getDay()]
    date.value = `${pad(d.getDate())} ${names.months[d.getMonth()]}, ${d.getFullYear()}`
    time.value = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  onMounted(() => {
    update()
    timer = setInterval(update, 1000)
  })
  onUnmounted(() => clearInterval(timer))

  return { now, weekday, date, time }
}
