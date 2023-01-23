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

async function createResp(prompt) {
  return await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
  });
}

async function ask(prompt) {
  var answer = "";
  var aryv = ["continue", "continue "];
  var mpromptr = isValIncase(aryv, prompt) ? prompt.replace("continue ", "") : prompt;
  var promptr = isValIncase(aryv, prompt) ? "continue " + mpromptr : prompt;
  var response = await createResp(promptr);
  
  if(isValIncase(aryv, promptr)) {
    answer = `\n Continuing: \n`;
    response.data.choices.forEach(({ text }) => {
      answer += text;
    });
  } else {
    answer = response.data.choices[0].text;
  }

  return answer.trim();
}
//Ask an example question
module.exports = {
  ask,
  isValIncase
};