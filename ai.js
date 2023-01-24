require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.opaitoken,
});
const openai = new OpenAIApi(configuration);

function isValIncase(astr, prompt) {
  const isVal = astr.some(element => {
    return element.toLowerCase() === prompt.toLowerCase();
  });

  return isVal;
}

async function createResp(prompt, isMaxTokens = false, type) {
  var modelobj = "";

  if(type == "image") {
    modelobj = await openai.createImage({
      prompt,
      n: 1,
      size: "256x256",
      response_format: "url"
    });
  } else {
    modelobj = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.9,
      max_tokens: isMaxTokens ? 2048 : 512,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: null
    });
  }
  
  return modelobj;
}

async function ask(prompt, type) {
  var answer = "";
  var response = await createResp(prompt, true, type);
  
  if(type == "text") {
    if(prompt.indexOf("continue") !== -1) {
      answer = `\nContinuing: `;
      response.data.choices.forEach(({ text }) => {
        answer += text;
      });
    } else {
      answer = response.data.choices != null ? response.data.choices[0].text : "";
    }
  } else {
    if(prompt.indexOf("continue") !== -1) {
      answer = `\nContinuing: `;
      response.data.data.forEach(({ url }) => {
        answer += url;
      });
    } else {
      answer = response.data.data != null ? response.data.data[0].url : "";
    }
  }

  return answer.trim();
}

module.exports = {
  ask,
  isValIncase
};
