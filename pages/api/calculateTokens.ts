import type { NextApiRequest, NextApiResponse } from 'next'
const { encode } = require('gpt-3-encoder');

export default function calculateTokens (req: NextApiRequest, res: NextApiResponse) {
  const { data } = req.body;
  const encoded = encode(data)
  res.status(200).json({ tokensCount: encoded.length });
}
