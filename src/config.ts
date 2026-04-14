export const DIFFICULTY_CONFIG = {
  training: {
    time: 120,
    attempts: 10,
    penalty: 0,
    feedbackType: "full",
  },
  tactical: {
    time: 180,
    attempts: 10,
    penalty: 0,
    feedbackType: "full",
  },
  critical: {
    time: 240,
    attempts: 20,
    penalty: 5,
    feedbackType: "partial",
  },
} as const;