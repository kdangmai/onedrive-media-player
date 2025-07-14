## FAQ

### Where is my data stored?

All of OMP data is stored in the `Apps / OMP` folder in your OneDrive. Where `history.json` is the history and `playlists.json` is the playlists. If you have lost your data, you can restore an older version by visiting the OneDrive web version.

## Running and Build

### App registrations

1. Go to <https://portal.azure.com/>
2. Into `App registrations` register an application
3. `Supported account types` select the third item (`Accounts in any organizational directory and personal Microsoft accounts`)
4. `Redirect URI` select `SPA`, url enter <http://localhost:8760> or the domain of your deploy
5. `API Permissions` add `User.Read` `Files.Read` `Files.ReadWrite.AppFolder`

### Run dev server

Add `.env.development` in project path

```env
ONEDRIVE_AUTH=https://login.microsoftonline.com/common #VNET(https://login.partner.microsoftonline.cn/common)
ONEDRIVE_GME=https://graph.microsoft.com #VNET(https://microsoftgraph.chinacloudapi.cn)
CLIENT_ID=<clientId>
REDIRECT_URI=http://localhost:8760
```

Run `npm i && npm run dev`

### Local build

Add `.env` in project path

```env
ONEDRIVE_AUTH=https://login.microsoftonline.com/common #VNET(https://login.partner.microsoftonline.cn/common)
ONEDRIVE_GME=https://graph.microsoft.com #VNET(https://microsoftgraph.chinacloudapi.cn)
CLIENT_ID=<clientId>
REDIRECT_URI=<redirectUri>
```

Run `npm i && npm run build`