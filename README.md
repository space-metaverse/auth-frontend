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

3. GET request the `loginCode` in `Authorization: Bearer: ${loginCode}` to: `https://api.dev.tryspace.com/auth/verifyCode`. This will return you:
`immerToken`, `hubsToken` and `username`.

4. Proceed with future API requests with: `https://api.dev.tryspace.com/auth/verifyToken` GET in your app using `Authorization: Bearer: ${immerToken}`

#### Initial login with loginCode and verifyCode API example:

``` javascript
    function login () {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const loginCode = urlSearchParams.get('loginCode'); // grab the token from URL
        if (loginCode) {
            fetch('https://api.dev.tryspace.com/auth/verifyCode', { // send loginCode to auth API
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${loginCode}`
                }
            }).then(res => res.json()).then(data => {
                const { immerToken, hubsToken, username } = data;
                console.log(immerToken, hubsToken, username) // your tokens and username
                window.localStorage.setItem(immerToken); // save this token for future requests
            });
        }
    }
```

#### Persistent login with token on reload / future requests example:

``` javascript
    async function verifyLogin () {
        const immerToken = window.localStorage.getItem("immerToken");
        if (immerToken) {
            const authResponse = await fetch('https://api.dev.tryspace.com/auth/verifyToken', { // send immerToken to auth API
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${immerToken}`
                }
            });
            if (authResponse.ok) { // if response 200 OK, then token is verified 
                const data = await authResponse.json();
                console.log(data.username); // your user data from token
            } else {
                window.localStorage.removeItem("immerToken"); // remove token from local storage, since is invalid
                login(); // token is not valid anymore, go-to inital login flow
            }
        } else {
            login(); // token not in localstorage, go-to inital login flow
        }
    }
```
