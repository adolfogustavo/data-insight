export const splitStringInMultiple = (allDataStringified: string, maxStringLength: number) => {
  let limit = Math.ceil(allDataStringified.length / maxStringLength);
  let splittedData:string[] = [];

  for(let i = 0; i < limit; i++) {
    if (i === limit - 1) {
      // To save the rest of the data on the last iteration
      splittedData.push(
        allDataStringified.slice(
          maxStringLength * i, allDataStringified.length
        )
      );
    } else {
      splittedData.push(
        allDataStringified.slice(
          maxStringLength * i, maxStringLength * (i + 1)
        )
      );
    }
  }

  return splittedData;
}

// Unused for the time being
export const splitArrayOfObjInMultiple = (allData: Array<any>, splitsNumber: number) => {
  let splittedData:any[] = [];
  const sizePerData = Math.round(allData.length / splitsNumber);

  for(let k = 0; k < splitsNumber; k++) {
    if (k === splitsNumber - 1) {
      // To save the rest of the data on the last iteration
      splittedData.push(
        allData.slice(
          sizePerData * k, allData.length
        )
      );
    } else {
      splittedData.push(
        allData.slice(
          sizePerData * k, sizePerData * (k + 1)
        )
      );
    }
  }

  return splittedData.filter((arr) => arr.length > 0); // Removing empty arrays (if there are any)
}

export const splitFileDataByAPICallNumber = (data: any[], APICallNumber: number) => {
  let splittedData:any[] = [];
  const [fileHeader, fileRows] = data;
  const sizePerData = Math.round(fileRows.length / APICallNumber);

  for(let k = 0; k < APICallNumber; k++) {
    if (k === APICallNumber - 1) {
      // To save the rest of the data on the last iteration
      splittedData.push([
        [...fileHeader],
        [...fileRows.slice(
          sizePerData * k, fileRows.length
        )]
      ]);
    } else {
      splittedData.push([
        [...fileHeader],
        [...fileRows.slice(
          sizePerData * k, sizePerData * (k + 1)
        )]
      ]);
    }
  }

  return splittedData.filter((arr) => arr.length > 0); // Removing empty arrays (if there are any)
}


export const stringDataToArray = (string: String) => {
  const fileHeader = string.slice(0, string.indexOf("\n")).split(",");
  const fileRows = string.slice(string.indexOf("\n") + 1).split("\n");

  return [[...fileHeader], [...fileRows]];
};

// Unused for the time being
export const stringifiedFileToArrayOfObj = (string: String) => {
  const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
  const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

  const array = csvRows.map(i => {
    const values = i.split(",");
    const obj = csvHeader.reduce((object, header, index) => {
      object[header] = values[index];
      return object;
    }, {});
    return obj;
  });
  return array;
};