import referenceStoryboard from './reference-storyboard.json';

export const REFERENCE_TIMELINE = {
  previewSeconds: 10,
  durationSeconds: 20.4,
  beats: {
    problem: 0,
    blocked: 1.92,
    promptShell: 3.44,
    promptText: 4.94,
    send: 6.66,
    answer: 6.72,
    resolve: 8.4,
  },
  continuation: {
    lessonStart: 9.74,
    lessonReveal: 10.68,
    lessonAction: 12.12,
    questionStart: 13.58,
    studyFocus: 14.54,
    avoidFocus: 15.92,
    thinkingStart: 17.88,
    thinkingMeaning: 19.14,
    thinkingSubject: 19.46,
    thinkingFocus: 19.84,
  },
} as const;

export const REFERENCE_STORYBOARD = referenceStoryboard;
