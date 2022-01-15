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
Coming soon! (the documentation that is 😔)