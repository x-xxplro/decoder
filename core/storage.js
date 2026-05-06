const STORAGE_KEY = 'decoder_achievements';

export function getAchievements() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addAchievement(id) {
  const achievements = getAchievements();
  if (!achievements.find(a => a.id === id)) {
    achievements.push({ id, date: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
    return true;
  }
  return false;
}

export function hasAchievement(id) {
  return getAchievements().some(a => a.id === id);
}

export function getAchievementCount() {
  return getAchievements().length;
}