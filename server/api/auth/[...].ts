import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/',
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
      return {
        id: profile.sub,
        email: profile.email
      }
    }
  }],
})
