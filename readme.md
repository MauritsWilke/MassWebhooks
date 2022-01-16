# 🎣 Mass Webhooks
Mass Webhooks is an application to easily add a webhook to all of your github repositories!


## 💡 How to use 
To use this application, simply follow these steps:
 1. Clone the repository
 ```sh
 git clone https://github.com/MauritsWilke/MassWebhooks.git
 ```
 2. Install the required node modules.
 ```
 npm i
 ```
 3. Navigate to `src/config.json` and edit the boilerplate settings.
 4. Run the application using 
 ```
node --experimental-json-modules --no-warnings .
 ```

## 🔧 Config.json
The entire project relies on the `config.json` file inside of the `src` folder.\
Here is an example with all the required settings:
```json
{
	"key": "your-github-auth-key",
	"use": 0,
	"mode": "create",
	"webhooks": [
		{
			"url": "api-url",
			"repos": "*",
			"events": [
				"*"
			]
		}
	]
}
```

**When using a Discord webhook, add `/github` at the end of your URL!**

## ⚙ Config.json - Advanced
<details>
<summary>Fully configured config.json</summary>

```json
{
	"key": "your-github-auth-key",
	"use": "*",
	"exclude": [
		0,
	],
	"mode": "create",
	"testMode": "tests",
	"fullLogging": false,
	"webhooks": [
		{
			"nickname": "Webhook Nickname",
			"url": "webhook-url",
			"repos": "*",
			"exclude": [
				"repo1",
				"repo2"
			],
			"events": [
				"*"
			],
			"webhookIDs": {}
		},
		{
			"nickname": "Second Webhook Nickname",
			"url": "webhook-url2",
			"repos": [
				"repo1",
				"repo2"
			],
			"events": [
				"*"
			],
			"webhookIDs": {
				"repo1": 123456789
			}
		}
	]
}
```

</details>

| Value	| Options 	| Description 	|
|-----	|---------	|-------------	|
| `key` | GitHub personal access token| A token with repository access. Generate one with the correct settings [here](https://github.com/settings/tokens/new?scopes=repo)|
| `use` | Webhook index or `*` | Add the index of the webhook to update or `*` to update all webhooks. |
| `exclude` | Webhook index | Webhooks here will _not_ be updated| 
| `mode` | create, delete, test | What to do with the webhooks. Create will create webhooks. Delete will delete webhooks. Test will test webhooks. |
| `testMode` | tests, pings | Pings will only trigger a ping event on the webhooks, tests will test the push event of the webhooks. |
| `fullLogging` | `Boolean` | Mainly used for development purposes, will log the entire error when errors occur. |
| `webhooks` | `array` | An array with all the webhooks |
| `Webhook Object` | `object` | Values will be listed below
| `nickname` | `string` | A nickname for the webhook |
| `url` | `string` | The URL of the webhook. **When using a Discord webhook, add `/github` at the end of your URL!**|
| `mode` | create, delete, test | Overwrite the global mode for this webhook|
| `repos` | `array` or `*` | An array of all the repositories to create a webhook for. Use `*` to create a webhook for all repositories |
| `visibility` | private, public, all | Private will only create a webhook for all private repositories. Public only for all public repositories. All will create a webhook for all repositories|
| `events` | `*` | The events the webhook should listen to. For all events, use `*` |
| `webhookIDs` | `object` | An object with all the webhook ID's. Stored as `"repository": id`. (Adviced not to edit) |