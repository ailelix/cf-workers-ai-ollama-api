const ModelList = new Map([
  // Add your preferred model here, in format of:
  // ["Display Name" , "Path provided by cf"]
  // See https://developers.cloudflare.com/workers-ai/models/
  ["llama-3.2-1b-instruct"  ,   "@cf/meta/llama-3.2-1b-instruct"],
  ["llama-3.2-3b-instruct"  ,   "@cf/meta/llama-3.2-3b-instruct"]
]);

// Some random prefix to protect API from being abused
// But this is NOT enough
// Start with "/", with NO "/" in the end
const Prefix = "/superlongandrandomstring";

export default {
  async fetch(req, env) {
    // See https://github.com/ollama/ollama/blob/main/docs/api.md
    try {
      const url = new URL(req.url);

      if (req.method === 'GET') {
        switch (url.pathname) {

          // List all models
          case Prefix + '/api/tags':
            let models = [];
            // "of" because it's a MapIterator
            for (let i of ModelList.keys()) {
              models.push({name: i});
            }
            return new Response(JSON.stringify({models:models}));
          
          // Ignore /api/ps
          case Prefix + '/apt/ps':
            return new Response("Request ignored");
          default:
            return new Response("Page not found", {status: 404});
        }
      } else if (req.method === 'POST') {
        let { model, prompt, messages } = await req.json();
        let res = {};
  
        switch (url.pathname) {

          // Simple generation
          case Prefix + '/api/generate':
            res = await env.AI.run(ModelList.get(model), {prompt: prompt});
            return new Response(JSON.stringify({
              model: model,
              response: res.response,
              done: true,
            }));
          
          // Standard chat
          case Prefix + '/api/chat':
            res = await env.AI.run(ModelList.get(model), {messages: messages});
            return new Response(JSON.stringify({
              model: model,
              message: {
                content: res.response
              },
              done: true,
            }));

          // Ignore all below api calls
          case Prefix + '/api/copy':
          case Prefix + '/api/create':
          case Prefix + '/api/delete':
          case Prefix + '/api/embed':
          case Prefix + '/api/pull':
          case Prefix + '/api/push':
          case Prefix + '/api/show':
            return new Response("Request ignored");
          default:
            return new Response("Page not found", {status: 404});
        }
      // When method is neither POST nor GET
      } else {
        return new Response("Method not allowed", {status: 405});
      }
    } catch (e) {
      return new Response("Server error: " + e.message, {status: 500});
    }
  }
};
