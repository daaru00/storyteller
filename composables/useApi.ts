export default function () {
  return {
    getProfile: async (): Promise<Profile> => {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return await response.json();
    }
  }
}
