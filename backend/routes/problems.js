const router = require('express').Router();
const Problem = require('../models/Problem');
const axios = require('axios');
const Submission = require('../models/Submission');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Set the compiler URL to port 8000 to match your running service
const COMPILER_URL = process.env.COMPILER_URL;

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Get all problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single problem by ID
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get sample test cases for a problem
router.get('/:id/testcases', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    const samples = problem.testCases.filter(tc => tc.isSample);
    res.json(samples);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Run code on sample test cases
router.post('/:id/run', async (req, res) => {
  try {
    const { code, language = 'cpp' } = req.body;
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    const samples = problem.testCases.filter(tc => tc.isSample);
    const results = await Promise.all(samples.map(async (tc) => {
      try {
        const response = await axios.post(COMPILER_URL, { code, language, input: tc.input });
        const userOutput = (response.data.output || '').trim();
        const expectedOutput = (tc.output || '').trim();
        return {
          input: tc.input,
          expectedOutput,
          userOutput,
          passed: userOutput === expectedOutput
        };
      } catch (err) {
        return {
          input: tc.input,
          expectedOutput: tc.output,
          userOutput: '',
          passed: false,
          error: err.message || 'Execution error'
        };
      }
    }));
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get submission status for a user and problem
router.get('/:id/status', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.id;
    const submission = await Submission.findOne({ user: userId, problem: problemId, status: 'Submitted' });
    if (submission) {
      return res.json({ status: 'Submitted' });
    } else {
      return res.json({ status: 'Not Attempted' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Submit code for all test cases
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { code, language = 'cpp' } = req.body;
    const userId = req.user.id;
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    const testCases = problem.testCases;
    const results = await Promise.all(testCases.map(async (tc) => {
      try {
        const response = await axios.post(COMPILER_URL, { code, language, input: tc.input });
        const userOutput = (response.data.output || '').trim();
        const expectedOutput = (tc.output || '').trim();
        return {
          input: tc.input,
          expectedOutput,
          userOutput,
          passed: userOutput === expectedOutput
        };
      } catch (err) {
        return {
          input: tc.input,
          expectedOutput: tc.output,
          userOutput: '',
          passed: false,
          error: err.message || 'Execution error'
        };
      }
    }));
    const allPassed = results.every(r => r.passed);
    // If all passed, record submission
    if (allPassed) {
      await Submission.findOneAndUpdate(
        { user: userId, problem: problem._id },
        { code, language, status: 'Submitted', createdAt: new Date() },
        { upsert: true, new: true }
      );
    }
    res.json({ results, allPassed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user statistics: total, solved, remaining
router.get('/user/statistics', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const total = await Problem.countDocuments();
    const solved = await Submission.countDocuments({ user: userId, status: 'Submitted' });
    res.json({ total, solved, remaining: total - solved });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 