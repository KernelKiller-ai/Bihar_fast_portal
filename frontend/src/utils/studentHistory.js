const HISTORY_PREFIX = "biharfast_student_attempts_";
const DISTRICT_PREFIX = "biharfast_student_district_";
const PENDING_ATTEMPT_KEY = "biharfast_pending_student_attempt";

export function getStudentAttempts(userId) {
  if (!userId) return [];
  try {
    const attempts = JSON.parse(localStorage.getItem(`${HISTORY_PREFIX}${userId}`) || "[]");
    return Array.isArray(attempts) ? attempts : [];
  } catch {
    return [];
  }
}

export function saveStudentAttempt(userId, attempt) {
  if (!userId) return;
  try {
    const attempts = getStudentAttempts(userId);
    attempts.unshift(attempt);
    localStorage.setItem(`${HISTORY_PREFIX}${userId}`, JSON.stringify(attempts.slice(0, 50)));
  } catch (error) {
    console.warn("Unable to save student test history:", error);
  }
}

export function savePendingStudentAttempt(attempt) {
  try {
    localStorage.setItem(PENDING_ATTEMPT_KEY, JSON.stringify(attempt));
  } catch (error) {
    console.warn("Unable to keep the pending demo result:", error);
  }
}

export function attachPendingStudentAttempt(userId) {
  if (!userId) return;
  try {
    const pendingAttempt = JSON.parse(localStorage.getItem(PENDING_ATTEMPT_KEY) || "null");
    if (!pendingAttempt) return;
    saveStudentAttempt(userId, pendingAttempt);
    localStorage.removeItem(PENDING_ATTEMPT_KEY);
  } catch (error) {
    console.warn("Unable to attach the pending demo result:", error);
  }
}

export function getStudentDistrict(userId) {
  if (!userId) return "Patna";
  try {
    return localStorage.getItem(`${DISTRICT_PREFIX}${userId}`) || "Patna";
  } catch {
    return "Patna";
  }
}

export function saveStudentDistrict(userId, district) {
  if (!userId) return;
  try {
    localStorage.setItem(`${DISTRICT_PREFIX}${userId}`, district);
  } catch (error) {
    console.warn("Unable to save student district:", error);
  }
}