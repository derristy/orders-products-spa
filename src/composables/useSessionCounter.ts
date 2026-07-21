import { onUnmounted, ref } from 'vue'
import { io, type Socket } from 'socket.io-client'

/**
 * Live counter of active app tabs/sessions via Socket.io.
 * Each open tab holds one connection; the server broadcasts the total.
 * Degrades gracefully to 1 when the WS server is unreachable.
 */
export function useSessionCounter() {
  const count = ref(1)
  const connected = ref(false)

  // Same-origin in production; VITE_WS_URL in dev.
  const url = import.meta.env.VITE_WS_URL || undefined
  const socket: Socket = io(url, { reconnection: true })

  socket.on('connect', () => (connected.value = true))
  socket.on('disconnect', () => (connected.value = false))
  socket.on('sessions', (n: number) => (count.value = n))

  onUnmounted(() => socket.disconnect())

  return { count, connected }
}
