# cf-workers-ai-ollama-api  
Use [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) with [Ollama](https://github.com/ollama/ollama)-Style API  

## Before Deployment  
PLEASE change the `prefix` in your deployment  
There is **NO** rate limiter, you may be charged fees  
As ollama-style API has no authentication, this repo is **NOT** suitable for production use  

## Deploy  
1. Sign in your Cloudflare Dashboard > Workers & Pages > Create worker  
2. Replace the default content with [index.js](./index.js)  
3. Change the prefix to a random and long string  
4. Add your preferred models  
5. Deploy the code, and enjoy the power of LLM  
6. (Optional) Add your own domain in your worker's settings  

## Usage  
For example, if you want to use [Companion](https://github.com/rizerphe/obsidian-companion) in Obsidian  
After installing the plugin, choose `ollama` as provider  
In `API route` section, you should fill something similar to `https://aaa.bbb.workers.dev/yourprefix` (Or your own domain if you added one)  
Uncheck `Streaming mode` (As I didn't write the code for stream lmao)  
