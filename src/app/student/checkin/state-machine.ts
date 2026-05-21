/**
 * ARIA 2.0 Check-in State Machine
 * Manages state transitions for the two-phase assessment flow
 */

import type { CheckinContext, CheckinAction } from "./types";

/**
 * State machine reducer
 * Handles all state transitions for the check-in flow
 */
export function checkinReducer(
  state: CheckinContext,
  action: CheckinAction
): CheckinContext {
  switch (action.type) {
    case "INIT_TRIAGE":
      return {
        ...state,
        state: "triage",
        triageQuestions: action.payload.triageQuestions,
        emotion: action.payload.emotion,
        userId: action.payload.userId,
        isAnonymous: !action.payload.userId,
        contextFrameId: action.payload.contextFrameId,
        triageAnswers: [],
        error: null,
      };

    case "ANSWER_TRIAGE":
      return {
        ...state,
        triageAnswers: [...state.triageAnswers, action.payload.answer],
      };

    case "COMPUTE_TRIAGE":
      return {
        ...state,
        triageSignal: action.payload.signal,
        triageResult: action.payload.result,
        // Always stay in triage state and wait for INIT_ASSESSMENT
        // (We now always run assessments, even for stable users)
        state: state.state,
      };

    case "INIT_ASSESSMENT":
      return {
        ...state,
        state: "assessing",
        assessmentQueue: action.payload.queue,
        mixedQuestions: action.payload.mixedQuestions,
        currentQuestionIndex: 0,
        assessmentAnswers: [],
      };

    case "ANSWER_QUESTION": {
      const newAnswers = [...state.assessmentAnswers, action.payload.answer];
      const nextIndex = state.currentQuestionIndex + 1;

      // Check if this is a camouflage question
      const currentQuestion = state.mixedQuestions[state.currentQuestionIndex];
      const newCamouflageResponses = currentQuestion?.isCamouflage
        ? [
            ...state.camouflageResponses,
            {
              question: currentQuestion.question,
              answer: currentQuestion.options.find(
                (opt) => opt.value === action.payload.answer.value
              )?.label || "",
            },
          ]
        : state.camouflageResponses;

      return {
        ...state,
        assessmentAnswers: newAnswers,
        currentQuestionIndex: nextIndex,
        currentScores: action.payload.newScores,
        riskLevel: action.payload.riskLevel,
        camouflageResponses: newCamouflageResponses,
      };
    }

    case "TRIGGER_CRISIS":
      return {
        ...state,
        state: "crisis",
        riskLevel: "critical",
      };

    case "COMPLETE_ASSESSMENT":
      return {
        ...state,
        state: "complete",
        dominantConcern: action.payload.dominantConcern,
        consistencyFlags: action.payload.consistencyFlags,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload.error,
      };

    case "RETRY_SAVE":
      return {
        ...state,
        saveAttempts: state.saveAttempts + 1,
        error: null,
      };

    default:
      return state;
  }
}
