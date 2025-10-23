export { AuthUser, Profile, Book };

declare global {
  interface AuthUser {
    sub: string
    email: string
  }

  interface Profile extends AuthUser {
    name: string
    image?: string
  }

  interface Book {
    id: string
    title: {
      en: string
      it: string
    }
    genre: string
    summary: {
      en: string
      it: string
    }
    imageUrl: string
  }

  interface Reading {
    id: string
  }
}
