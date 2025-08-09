const KEY = "arena.mints"
const ACTIVE_KEY = "arena.active"

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

export function saveMintedAvatar(m) {
  const all = read()
  all.unshift(m)
  write(all)
}

export function getAvatarsFor(address) {
  const all = read()
  return all.filter((m) => m.owner.toLowerCase() === address.toLowerCase())
}

export function setActiveAvatarFor(address, tokenId) {
  if (typeof window === "undefined") return
  localStorage.setItem(`${ACTIVE_KEY}.${address.toLowerCase()}`, String(tokenId))
}

export function getActiveAvatarFor(address) {
  const list = getAvatarsFor(address)
  const tid = typeof window !== "undefined" ? localStorage.getItem(`${ACTIVE_KEY}.${address.toLowerCase()}`) : null
  if (!tid) return list[0] ?? null
  return list.find((a) => String(a.tokenId) === tid) ?? list[0] ?? null
}

export function addXpFor(address, tokenId, amount) {
  const all = read()
  const idx = all.findIndex((a) => a.owner.toLowerCase() === address.toLowerCase() && a.tokenId === tokenId)
  if (idx >= 0) {
    all[idx].xp = (all[idx].xp ?? 0) + amount
    const lvl = 1 + Math.floor((all[idx].xp ?? 0) / 50)
    all[idx].level = lvl
    write(all)
  }
}
