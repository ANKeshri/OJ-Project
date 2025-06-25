const mongoose = require('mongoose');
const Problem = require('../models/Problem');
require('dotenv').config({ path: require('path').join(__dirname, '../config/config.env') });

const problems = [
  {
    title: "Permutation Warm-Up",
    description: "For a permutation p of length n, we define the function: f(p)=∑|pi−i|. You are given a number n. You need to compute how many distinct values the function f(p) can take when considering all permutations.",
    constraints: "1 ≤ n ≤ 8",
    samples: [
      { input: "3", output: "2" }
    ]
  },
  {
    title: "Trippi Troppi",
    description: "Trippi Troppi resides in a strange world. The ancient name of each country consists of three strings. The first letter of each string is concatenated to form the country's modern name. Given the country name, find all possible combinations of the three strings.",
    constraints: "1 ≤ length of each string ≤ 10",
    samples: [
      { input: "ABC", output: "A B C" }
    ]
  },
  {
    title: "Cherry Bomb",
    description: "Two integer arrays a and b of size n are complementary if there exists an integer x such that ai+bi=x over all 1≤i≤n. For example, the arrays a=[2,1,4] and b=[3,4,1] are complementary, since a1+b1=5, a2+b2=5, a3+b3=5.",
    constraints: "1 ≤ n ≤ 1000",
    samples: [
      { input: "3\n2 1 4\n3 4 1", output: "YES" }
    ]
  },
  {
    title: "Sum of 2 numbers",
    description: "Given two integers, output their sum.",
    constraints: "no",
    samples: [
      { input: "1 2", output: "3" },
      { input: "3 5", output: "8" }
    ]
  },
  {
    title: "Reverse String",
    description: "Given a string, print its reverse.",
    constraints: "1 ≤ length of string ≤ 100",
    samples: [
      { input: "hello", output: "olleh" }
    ]
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Problem.deleteMany({});
  await Problem.insertMany(problems);
  console.log("Problems seeded!");
  mongoose.disconnect();
}

seed(); 