export const calculateTokens = async(data: string) => {
  try {
    const response = await fetch("/api/calculateTokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    })
    let { tokensCount } = await response.json();
    return tokensCount;
  } catch (error) {
    console.log("error=>", error); // TODO: Implement a way to handle errors
  }
}


