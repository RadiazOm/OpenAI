# OpenJAIffrey

OpenJAIffrey is a chat application who communicates with gpt-3.5 acting as Jeffrey (me) so that people can get help with their programming questions

## Installation

Firstly clone the GitHub repository code so that you have the project folder on your local pc

Next, use the package manager [node](https://nodejs.org/en) to install the necessary modules.

```bash
npm install
```

You also want to get your own [azure](https://openai.com/blog/openai-api) OpenAI key or any other LLM api key to get this running

When you have your key you want to make a .env file in your server folder, In there you want to add the following:

```shell
OPENAI_API_TYPE=YOUR-API-TYPE
OPENAI_API_VERSION=YOUR-API-VERSION
OPENAI_API_BASE=YOUR-API-BASE
AZURE_OPENAI_API_KEY=YOUR-API-KEY
DEPLOYMENT_NAME=YOUR-DEPLOYMENT-NAME
ENGINE_NAME=YOUR-ENGINE-NAME
INSTANCE_NAME=YOUR-INSTANCE-NAME

EXPRESS_PORT=YOUR-PORT
```

To start your application, simply start both client and server by going to their respective folders and run the 'dev' command

```bash
C:\Users\your-project-folder\client\react> npm run dev
```

```bash
C:\Users\your-project-folder\server> npm run dev
```

## License

[MIT](https://choosealicense.com/licenses/mit/)