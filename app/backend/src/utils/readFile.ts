import * as fs from 'fs/promises';

const readSecret = async (): Promise<string> => {
  const data = await fs.readFile('../../jwt.evaluation.key', 'utf-8');
  return data;
};

export default readSecret;
