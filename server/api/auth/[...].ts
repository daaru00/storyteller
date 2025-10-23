import { NuxtAuthHandler } from '#auth'
const { createProfile, isRegistered } = useModelProfile()

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/',
  },
  callbacks: {
    async session({ session, token }) {
      // @ts-ignore
      session.user.sub = token.sub
      return session
    },
  },
  providers: [{
    id: "custom",
    name: "Auth",
    type: "oauth",
    version: "2.0",
    wellKnown: process.env.OIDC_ENDPOINT + "/.well-known/openid-configuration",
    jwks_endpoint: process.env.OIDC_ENDPOINT + "/.well-known/jwks.json",
    clientId: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    authorization: {
      params: {
        scope: 'email profile openid',
        prompt: 'login'
      }
    },
    idToken: true,
    checks: ['pkce', 'state'],
    async profile(profile: any) {
      const exist = await isRegistered(profile.email)
      if (!exist) {
        await createProfile(profile.email, {
          givenName: profile.given_name,
          familyName: profile.family_name
        })
        console.log('User registered', profile)
      } else {
        console.log('User signed in', profile)
      }
      
      return {
        id: profile.sub,
        email: profile.email,
        name: profile.name,
        image: profile.picture
      }
    },
  }],
})
