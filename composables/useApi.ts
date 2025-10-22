export default function () {
  return {
    getProfile: async (): Promise<any> => {
      const response = await fetch('/api/profile')
      return await response.json();
    }
  }
}
