const HISTORY_PREFIX = "biharfast_student_attempts_";
const DISTRICT_PREFIX = "biharfast_student_district_";
const LOCAL_USER_KEY = "local";
const QUIZ_PROGRESS_PREFIX = "biharfast_quiz_progress_";

export function getStudentAttempts(userId) {
  try {
    const attempts = JSON.parse(localStorage.getItem(`${HISTORY_PREFIX}${userId || LOCAL_USER_KEY}`) || "[]");
    return Array.isArray(attempts) ? attempts : [];
  } catch {
    return [];
  }
}

export function saveStudentAttempt(userId, attempt) {
  try {
    const attempts = getStudentAttempts(userId);
    attempts.unshift(attempt);
    localStorage.setItem(`${HISTORY_PREFIX}${userId || LOCAL_USER_KEY}`, JSON.stringify(attempts.slice(0, 50)));
  } catch (error) {
    console.warn("Unable to save student test history:", error);
  }
}

export function getQuizProgress(quizId) {
  if (!quizId) return null;
  try {
    const progress = localStorage.getItem(`${QUIZ_PROGRESS_PREFIX}${quizId}`);
    return progress ? JSON.parse(progress) : null;
  } catch (error) {
    console.warn("Unable to restore saved quiz progress:", error);
    return null;
  }
}

export function saveQuizProgress(quizId, progress) {
  if (!quizId) return;
  try {
    localStorage.setItem(`${QUIZ_PROGRESS_PREFIX}${quizId}`, JSON.stringify(progress));
  } catch (error) {
    console.warn("Unable to save quiz progress:", error);
  }
}

export function clearQuizProgress(quizId) {
  if (!quizId) return;
  try {
    localStorage.removeItem(`${QUIZ_PROGRESS_PREFIX}${quizId}`);
  } catch (error) {
    console.warn("Unable to clear saved quiz progress:", error);
  }
}

export function getStudentDistrict(userId) {
  try {
    return localStorage.getItem(`${DISTRICT_PREFIX}${userId || LOCAL_USER_KEY}`) || "Patna";
  } catch {
    return "Patna";
  }
}

export function saveStudentDistrict(userId, district) {
  try {
    localStorage.setItem(`${DISTRICT_PREFIX}${userId || LOCAL_USER_KEY}`, district);
  } catch (error) {
    console.warn("Unable to save student district:", error);
  }
}