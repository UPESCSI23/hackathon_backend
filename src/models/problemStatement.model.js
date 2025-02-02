import { Schema, model } from "mongoose";

const problemStatementSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  teamSize: {
    type: Number,
    default: 2,
  },
  tags: {
    type: [String],
  },
  icon: {
    type: String,
  },
  details: {
    description: {
      type: String,
    },
    requirements: {
      type: [String],
    },
    resources: {
      type: [String],
    },
    mentors: {
      type: [String],
    },
  },
});

export const ProblemStatementModel = model(
  "problemstatement",
  problemStatementSchema,
);
