const axios = require("axios");

async function testAPI() {
  try {
    const res = await axios.post("http://localhost:3000/bfhl", {
      data: ["a", "1", "334", "4", "R", "$"],
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.message);
  }
}

testAPI();
