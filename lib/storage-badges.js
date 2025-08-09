const KEY = "arena.badges"

function read() {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}
function write(all) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function saveBadge(b) {
  const all = read()
  all.unshift(b)
  write(all)
}

export function listBadges() {
  return read()
}
