Social Login Setup (NextAuth)

1) Create `.env.local` in `Frontend/` and set:

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

Generate NEXTAUTH_SECRET:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

2) OAuth app redirect URIs
- Google: http://localhost:3000/api/auth/callback/google
- Facebook: http://localhost:3000/api/auth/callback/facebook

3) Run dev
npm run dev

Buttons on `auth/login` and `auth/register` will start OAuth.

