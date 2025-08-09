function deepEqual(a, b) {
  if (Object.is(a, b)) return true
  if (typeof a !== typeof b) return false
  if (a && b && typeof a === "object") {
    if (Array.isArray(a) !== Array.isArray(b)) return false
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false
      return true
    }
    const ak = Object.keys(a)
    const bk = Object.keys(b)
    if (ak.length !== bk.length) return false
    for (const k of ak) if (!deepEqual(a[k], b[k])) return false
    return true
  }
  return false
}

function buildEntryFunction(code, entryName) {
  // create the function from user code and return the named entry function reference
  // using new function isolates scope from the current module
  const factory = new Function(`${code}; return typeof ${entryName} !== 'undefined' ? ${entryName} : null;`)
  return factory()
}

function runIOCases(fn, cases) {
  const out = []
  for (const c of cases) {
    try {
      const res = fn.apply(null, c.args)
      const ok = deepEqual(res, c.expect)
      out.push({
        name: c.name,
        passed: ok,
        error: ok ? null : `expected ${JSON.stringify(c.expect)}, got ${JSON.stringify(res)}`,
      })
    } catch (e) {
      out.push({ name: c.name, passed: false, error: e && e.message ? e.message : "runtime error" })
    }
  }
  const passed = out.filter((x) => x.passed).length
  return { cases: out, total: out.length, passed }
}

export async function runChallenge(code, entryFunction, publicIOTests, hiddenIOTests) {
  let entry = null
  let publicRes = { cases: [], total: 0, passed: 0 }
  let hiddenRes = { cases: [], total: 0, passed: 0 }

  try {
    entry = buildEntryFunction(code, entryFunction)
    if (typeof entry !== "function") {
      throw new Error(`Entry function "${entryFunction}" not found`)
    }
  } catch (e) {
    // syntax or build error: mark first public case as failed with error
    const errMsg = e && e.message ? e.message : "compile error"
    publicRes = {
      cases: [{ name: "compile", passed: false, error: errMsg }],
      total: 1,
      passed: 0,
    }
    return { public: publicRes, hidden: hiddenRes, allPassed: false }
  }

  publicRes = runIOCases(entry, publicIOTests || [])
  if (publicRes.passed === publicRes.total) {
    hiddenRes = runIOCases(entry, hiddenIOTests || [])
  }

  const allPassed =
    publicRes.total > 0 &&
    publicRes.passed === publicRes.total &&
    hiddenRes.total > 0 &&
    hiddenRes.passed === hiddenRes.total

  return { public: publicRes, hidden: hiddenRes, allPassed }
}
