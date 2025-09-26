// lib/api/http.ts
export type Problem = {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  [k: string]: any
}

function formatProblem(p: Problem, status: number, url: string) {
  const t = p.title ?? 'Error'
  const d = p.detail ? ` — ${p.detail}` : ''
  return `${t}${d} (HTTP ${p.status ?? status} @ ${url})`
}

export async function postJson<T>(
  url: string,
  body: unknown,
  opts?: { timeoutMs?: number; signal?: AbortSignal }
): Promise<T> {
  const controller = new AbortController()

  // If caller provides a signal, mirror its abort
  if (opts?.signal) {
    const onAbort = () => controller.abort((opts.signal as any).reason)
    if (opts.signal.aborted) onAbort()
    else opts.signal.addEventListener('abort', onAbort, { once: true })
  }

  const timeout = setTimeout(() => controller.abort(new DOMException('Timeout', 'AbortError')), opts?.timeoutMs ?? 7000)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      try {
        const prob = text ? (JSON.parse(text) as Problem) : {}
        throw new Error(formatProblem(prob, res.status, url))
      } catch {
        throw new Error(`HTTP ${res.status} ${res.statusText} @ ${url}${text ? ` → ${text}` : ''}`)
      }
    }

    return (await res.json()) as T
  } finally {
    clearTimeout(timeout)
  }
}
