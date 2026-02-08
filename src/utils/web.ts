export async function webSearch(query: string): Promise<string> {
  const res = await fetch(
    `https://duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
  )

  if (!res.ok) throw new Error("Error buscando en la web")

  return await res.text()
}