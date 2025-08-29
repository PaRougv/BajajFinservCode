const express = require("express");
const app = express();

app.use(express.json());

// Set these via environment variables in Render
const USER_FULL_NAME = process.env.USER_FULL_NAME || "parag_vastrad";  // full name lowercase with underscore
const USER_DOB_DDMMYYYY = process.env.USER_DOB_DDMMYYYY || "07062004"; // your DOB
const EMAIL = process.env.EMAIL || "paragprabhu.vastrad2022@vitstudent.ac.in";     // your email
const ROLL_NUMBER = process.env.ROLL_NUMBER || "22BCE1218";            // your roll number


// Core classifier that satisfies the spec
function processData(arr) {
  const even_numbers = [];
  const odd_numbers = [];
  const alphabets = [];
  const special_characters = [];
  let sum = 0;
  const alphaChars = []; // collect letters (original case) to build concat_string

  for (const raw of arr) {
    const item = String(raw);

    if (/^-?\d+$/.test(item)) {
      const n = parseInt(item, 10);
      (Math.abs(n) % 2 === 0 ? even_numbers : odd_numbers).push(item); // keep as string
      sum += n;
    } else if (/^[A-Za-z]+$/.test(item)) {
      alphabets.push(item.toUpperCase());
      alphaChars.push(...item); // keep original case for alternating-caps logic
    } else {
      special_characters.push(item);
    }
  }

  // Build concat_string: reverse all alphabetic characters (from alphabet-only tokens),
  // then alternate caps starting UPPER then lower ...
  const reversed = alphaChars.reverse().join("");
  let concat = "";
  for (let i = 0; i < reversed.length; i++) {
    const ch = reversed[i];
    concat += i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase();
  }

  return {
    even_numbers,
    odd_numbers,
    alphabets,
    special_characters,
    sum: String(sum),
    concat_string: concat,
  };
}

// POST /bfhl (must return 200 on success)
app.post("/bfhl", (req, res) => {
  try {
    const data = req.body?.data;

    // Graceful handling: if invalid, still respond with is_success=false
    if (!Array.isArray(data)) {
      return res.status(200).json({
        is_success: false,
        user_id: `${String(USER_FULL_NAME).toLowerCase()}_${USER_DOB_DDMMYYYY}`,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
        message: "Invalid payload: 'data' must be an array of strings",
      });
    }

    const out = processData(data);

    return res.status(200).json({
      is_success: true,
      user_id: `${String(USER_FULL_NAME).toLowerCase()}_${USER_DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      ...out,
    });
  } catch (e) {
    return res.status(200).json({
      is_success: false,
      user_id: `${String(USER_FULL_NAME).toLowerCase()}_${USER_DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      message: "Server error",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BFHL API on :${PORT}`));
