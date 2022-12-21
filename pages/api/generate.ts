import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from 'next'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function generate(
  req: NextApiRequest,
  res: NextApiResponse
  ) {
  const model = req.body.model ? req.body.model : "text-davinci-002";
  const max_tokens = req.body.maxTokens ? req.body.maxTokens : 250;
  const completion = await openai.createCompletion({
    model,
    prompt: generatePrompt(req.body.data, req.body.summarize),
    temperature: 0.8,
    max_tokens,
  });
  console.log("API Response=>", completion);
  res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt(data: string, summarize: boolean) {
  if (summarize) {
    return `
    Remove repeated information from the following text: ${data}
    Result:
    `
  }
  return `
  Explain this portion of data, adding as much details as possible, mentioning the most relevant data and its meaning.
    
  Data: ${data}

  Analysis:
  `
  ;
}
