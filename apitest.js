const axios = require("axios");

// Test data
const testPayload = {
  data: ["2", "a", "y", "4", "&", "-", "*", "5", "92", "b"],
};

// Expected output format keys for validation
const expectedKeys = [
  "is_success",
  "user_id",
  "email",
  "roll_number",
  "even_numbers",
  "odd_numbers",
  "alphabets",
  "special_characters",
  "sum",
  "concat_string",
];

// URLs for testing
const localURL = "http://localhost:3000/bfhl";
const renderURL = "https://bfhl-api-x6ey.onrender.com/bfhl";

// Function to test a given URL
async function testAPI(url) {
  try {
    const res = await axios.post(url, testPayload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error(`❌ Error testing ${url}:`, error.message);
    return null;
  }
}

// Function to compare two responses
function compareResponses(localRes, renderRes) {
  if (!localRes || !renderRes) return false;

  for (const key of expectedKeys) {
    if (JSON.stringify(localRes[key]) !== JSON.stringify(renderRes[key])) {
      console.log(`⚠️ Mismatch at key: ${key}`);
      console.log(`   Local:  ${JSON.stringify(localRes[key])}`);
      console.log(`   Render: ${JSON.stringify(renderRes[key])}`);
      return false;
    }
  }
  return true;
}

// Run the tests
(async () => {
  console.log("🚀 Testing Local API:", localURL);
  const localRes = await testAPI(localURL);
  console.log("Local Response:", localRes, "\n");

  console.log("🌍 Testing Render API:", renderURL);
  const renderRes = await testAPI(renderURL);
  console.log("Render Response:", renderRes, "\n");

  // Compare results
  console.log("🔍 Comparing responses...");
  if (compareResponses(localRes, renderRes)) {
    console.log("✅ Both APIs return the same results!");
  } else {
    console.log("❌ APIs are returning different results.");
  }
})();
