require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.opaitoken,
});
const openai = new OpenAIApi(configuration);

function isValIncase(astr, prompt) {
  const isContained = astr.some(element => {
    return element.toLowerCase() === prompt.toLowerCase();
  });

  return isContained;
}

async function createResp(prompt, isContinue = false) {
  return await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: isContinue ? 0.7 : 0,
    max_tokens: isContinue ? 512 : 256,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });
}

async function ask(prompt) {
  var response = ""; var answer = "";
  var n = 0; var max = 1000;

  if(isValIncase(["continue"], prompt)) {
    while(n < max) {
      response = await createResp(prompt, true);
      answer += response.data.choices[0].text;
    }  
  } else {
    response = await createResp(prompt, false);
    answer = response.data.choices[0].text;
  }

  return answer;
}
//Ask an example question
module.exports = {
    ask,
};