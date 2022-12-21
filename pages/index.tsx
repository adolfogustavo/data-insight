import Head from "next/head";
import { useState, useRef } from "react";
import styles from "./index.module.css";
import readXlsxFile from "read-excel-file";
import {
  stringDataToArray,
  splitFileDataByAPICallNumber
} from "../utils/arrays";
import { getDataTokensCount } from "../utils/tokens";

export default function Home() {
  const [result, setResult] = useState<string>("");
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [allData, setAllData] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false)

  const inputFile = useRef<HTMLInputElement>(null);

  async function onSubmit(event: any) {
    event.preventDefault();
    setIsLoading(true);
    const allDataStringified = JSON.stringify({...allData}); // All the data stringified
    const maxStringLength = 10760; // Max number of characters per space, equals to 3078 tokens aprox
    const maxTokenAllowedAtPrompt = 3000; // Max number of tokens accepted by the OpenAPI

    const totalTokensCount = await getDataTokensCount(allDataStringified, maxStringLength); // => Get the amount of tokens in the string to calculate how many OpenAPI calls needs to be made.

    if (totalTokensCount > maxTokenAllowedAtPrompt) {
      const APICallCount = Math.ceil(totalTokensCount / maxTokenAllowedAtPrompt);
      const splittedDataByAPICall = splitFileDataByAPICallNumber(allData, APICallCount)
      const APIResults:string[] = [];

      // Calling the API per every splitted data
      for (let j = 0; j < splittedDataByAPICall.length; j++) {
        const dataToSend = JSON.stringify(splittedDataByAPICall[j]);
        if (splittedDataByAPICall[j].length > 0) {
          const GPT3APIResponse = await fetch("/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: dataToSend,
              summarize: false,
            }),
          });
          const data = await GPT3APIResponse.json();
          APIResults.push(data.result)
        }
      }
      const allDataResponse = APIResults.join("\n"); // => Save temporarily all results from API calls.

      // Summarize all the responses from previous calls.
      if (allDataResponse.length > 0) {
        const GPT3Summary = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: allDataResponse,
            summarize: true,
            maxTokens: 1000,
          }),
        });
        const data = await GPT3Summary.json();
        setResult(data.result);
      }
    } else {
      if (allData.length > 0) {
        const GPT3Summary = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: JSON.stringify(allData),
            maxTokens: 500,
          }),
        });
        const data = await GPT3Summary.json();
        setResult(data.result);
      }
    }
    setIsLoading(false);
  }
  const readFile = (event: any) => {
    event.preventDefault();
    const fileReader = new FileReader();

    let file = event.target.files[0];
    let fileName = event.target.files[0].name;
    setFile(file);
    setFileName(fileName ?? "");

    if (file) {
      if (fileName.split(".")[1] === "xlsx") {
        readXlsxFile(file).then((rows) => {
          /* 
              `rows` is an array of rows
              each row being an array of cells. 
          */
          const xlsxOutputString = rows.join("\n");
          const xlsxData = stringDataToArray(xlsxOutputString)
          setAllData(xlsxData);
        })
      } else if (fileName.split(".")[1] === "csv") {
          fileReader.onload = async function(event) {
            const cvsOutputString = event.target.result;
            const cvsData = stringDataToArray(cvsOutputString);
            setAllData(cvsData);
          };
          fileReader.readAsText(file);  
      }
    }
  }

  return (
    <div>
      <Head>
        <title>Data Insight with GPT-3</title>
      </Head>

      <main className={styles.main}>
        <h3>Get an insight of your data!</h3>
        <form onSubmit={onSubmit}>
          <input type="button" onClick={() => inputFile.current?.click() } value="Select your file (.xlsx, .csv)"/>
          <input type="file" style={{ display: "none" }} id="file" accept=".xlsx,.csv" onChange={(e) => readFile(e)} ref={inputFile}/>
          <text>{fileName}</text>
          <br/>
          { file && <input type="submit" value="Analyze data!" />}
          { isLoading && <p>Analyzing data...</p> }
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
