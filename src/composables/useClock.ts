import { onMounted, onUnmounted, ref } from 'vue'

const WEEKDAYS = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
]
const MONTHS = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
]

/** Real-time clock: weekday, date and HH:MM, updated every second. */
export function useClock() {
  const now = ref(new Date())
  let timer: ReturnType<typeof setInterval>

  const pad = (n: number) => String(n).padStart(2, '0')

  const weekday = ref('')
  const date = ref('')
  const time = ref('')

  const update = () => {
    const d = (now.value = new Date())
    weekday.value = WEEKDAYS[d.getDay()]
    date.value = `${pad(d.getDate())} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`
    time.value = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  onMounted(() => {
    update()
    timer = setInterval(update, 1000)
  })
  onUnmounted(() => clearInterval(timer))

  return { now, weekday, date, time }
}
