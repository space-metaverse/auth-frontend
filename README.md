# auth-frontend

Our modular Cognito based Auth portal to login and register users. Returns a JWT token to a redirect URL.

## Getting Started

### Prerequisites

- [Node.js LTS](https://nodejs.org/en/)

### Running the app locally

1. Install NPM packages.

```sh
npm install
```

2. Start the Next.js server.

```sh
npm run dev
```

## How to integrate auth with your app

### Cookie style (unstable, but simple)

If you are on the same domain, you can grab `token` from the Cookie.
However this only works on same domains, we have different environments, user could be blocking Cookies, etc.

### LoginCode Style (stable, but complex)

1. If not logged in: redirect the browser to: `https://auth.dev.tryspace.com/?redirect=<your-app-url>`

2. After you login, it will redirect back to your app with a `loginCode` in the query string. ex:
`https://<your-app-url>/?loginCode=<loginCode>`

3. POST request the `loginCode` to: `https://auth.dev.tryspace.com/verifyCode` to get the user's  JWT `accessToken` and `username`.

4. Proceed with future API requests in your app using `accessToken` in the `Authorization` header.
