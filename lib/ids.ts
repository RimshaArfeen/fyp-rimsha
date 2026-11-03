
// lib/ids.ts
export const isObjectId = (v: string) => /^[a-f0-9]{24}$/i.test(v);