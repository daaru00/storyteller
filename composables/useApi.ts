export default function () {
  return {
    getProfile: async (): Promise<Profile> => {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return await response.json();
    },
    listBooks: async (nextToken?: string): Promise<{ books: Book[], nextToken?: string }> => {
      const url = new URL('/api/public/books', window.location.origin)
      if (nextToken) {
        url.searchParams.append('nextToken', nextToken)
      }
      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return await response.json();
    },
    getBook: async (bookId: string): Promise<Book> => {
      const response = await fetch(`/api/public/books/${bookId}`)
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return await response.json();
    },
    readBook: async (bookId: string, locale: string): Promise<Reading> => {
      const response = await fetch(`/api/books/${bookId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ locale })
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return await response.json();
    },
    listReading: async (nextToken?: string): Promise<{ readings: Reading[], nextToken?: string }> => {
      const url = new URL('/api/readings', window.location.origin)
      if (nextToken) {
        url.searchParams.append('nextToken', nextToken)
      }
      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return await response.json();
    },
    getReading: async (readingId: string): Promise<Reading> => {
      const response = await fetch(`/api/readings/${readingId}`)
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return await response.json();
    },
    setReadingChoice: async (readingId: string, choice: number, locale: string): Promise<Reading> => {
      const response = await fetch(`/api/readings/${readingId}/choice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ choice, locale })
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return await response.json();
    }
  }
}
