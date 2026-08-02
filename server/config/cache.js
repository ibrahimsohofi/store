/**
 * Cache / counter interface.
 *
 * The sandbox has no Redis, so this ships an in-memory LRU-ish driver. The surface is
 * deliberately the subset of `ioredis` we need (get/set/del/incr with TTL), so Phase 4
 * can swap the driver for a real Redis client without touching call sites.
 */

const store = new Map();

const now = () => Date.now();

function prune() {
  if (store.size < 5000) return;
  const t = now();
  for (const [k, v] of store) if (v.exp && v.exp <= t) store.delete(k);
}

export const cache = {
  driver: "memory",

  async get(key) {
    const hit = store.get(key);
    if (!hit) return null;
    if (hit.exp && hit.exp <= now()) {
      store.delete(key);
      return null;
    }
    return hit.value;
  },

  async set(key, value, ttlSeconds) {
    prune();
    store.set(key, { value, exp: ttlSeconds ? now() + ttlSeconds * 1000 : 0 });
    return value;
  },

  async del(key) {
    store.delete(key);
  },

  /** Atomic-enough counter for rate limiting. Returns { count, resetAt }. */
  async incr(key, windowSeconds) {
    const hit = store.get(key);
    const t = now();
    if (!hit || (hit.exp && hit.exp <= t)) {
      const exp = t + windowSeconds * 1000;
      store.set(key, { value: 1, exp });
      return { count: 1, resetAt: exp };
    }
    hit.value += 1;
    return { count: hit.value, resetAt: hit.exp };
  },

  /** Read-through helper. */
  async remember(key, ttlSeconds, producer) {
    const hit = await this.get(key);
    if (hit !== null) return hit;
    const value = await producer();
    await this.set(key, value, ttlSeconds);
    return value;
  },

  async flush() {
    store.clear();
  },
};

export default cache;
