// check this on github :
// https://github.com/sindresorhus/ky

//with this, we can parse the date from the response automatically 

import ky from "ky";

const kyInstance = ky.create({
  parseJson: (text) => 
    JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) 
        return new Date(value);
      
      return value;
    }),
  
});

export default kyInstance;
