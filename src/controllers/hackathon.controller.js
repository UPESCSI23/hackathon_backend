import { ProblemStatementModel } from "../models/problemStatement.model";
const getProblemStatements = async (req, res) => {
  try {
    const problemStatements = ProblemStatementModel.find();
    return res.status(200).json({
      msg: "Problem Statements fetched successfully",
      data: problemStatements, // [{}, {}]
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};
