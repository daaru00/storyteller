import { createHash } from "crypto"; 

export default function () {
  return {
    getProfileImage: (email: string, size = 64): string => {
      const hash = createHash('md5').update(email).digest('hex')
      return 'https://gravatar.com/avatar/' + hash + `?s=${size}&d=retro`
    }
  }
}
