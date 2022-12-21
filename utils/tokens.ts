import { calculateTokens } from "./api";
import { splitStringInMultiple } from "./arrays";

export const getDataTokensCount = async (data: string, maxDataLength: number) => {
  let totalCount = 0;
  if (data.length > maxDataLength) {
    const splittedData = splitStringInMultiple(data, maxDataLength); // Splitting the data in multiple slots to calculate token numbers with the calculateTokens API
    for (let i = 0; i < splittedData.length; i++) {
      totalCount += await calculateTokens(splittedData[i]);
    }
  } else {
    totalCount = await calculateTokens(data);
  }
  return totalCount;
}