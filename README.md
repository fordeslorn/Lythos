# Vue3-system

The project is a system built with Vue 3. Just used for learning purposes. 

It contains login, register pages and other pages to be developed.

Used the `shadcn-vue` UI.

## Some Pages
**Login**
![](docs/img/login.png)
**Register**
![](docs/img/register.png)
**User Settings**
![](docs/img/user-settings.png)

## Project Setup

**Install dependencies:**
Install the required dependencies using pnpm:
```sh
pnpm install
```
**Environment Variables:**

Create a `.env.development` file in the root directory and add the following environment variables:

```env
# This is the base URL for the API endpoints
VITE_API_BASE_URL=http://localhost:8080/api/v1

# This variable indicates whether the mock user is logged in or not
VITE_MOCK_LOGGED_IN=false
```

**Compile and Hot-Reload for Development:**

```sh
pnpm run dev
```

**Type-Check, Compile and Minify for Production:**

```sh
pnpm run build
```

## Deploy in server
You need to change the `dev` script in `package.json` to allow access from other devices in your network:
```
"scripts": {
    "dev": "vite --host",
  },
```

And also change the `vite.config.ts` file to allow access from your domain:
```
server: {
    host: true,           
    port: 5173,
    allowedHosts: ['your-domain.com'], 
    origin: 'https://your-domain.com',
    hmr: {
      protocol: 'wss',
      clientPort: 443
    }
  }
```
