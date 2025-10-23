export { AuthUser, Profile };

declare global {
  interface AuthUser {
    sub: string
    email: string
  }

  interface Profile extends AuthUser {
    name: string
    image?: string
  }
}
