import { getLevelFromXP, getXPForLevel, getXPProgress, formatDuration, getScoreColor, truncate } from '@/lib/utils';

describe('XP & Level Utils', () => {
  test('getXPForLevel returns 100 for level 1', () => {
    expect(getXPForLevel(1)).toBe(100);
  });

  test('getXPForLevel increases with level', () => {
    expect(getXPForLevel(2)).toBeGreaterThan(getXPForLevel(1));
    expect(getXPForLevel(5)).toBeGreaterThan(getXPForLevel(3));
  });

  test('getLevelFromXP returns 1 for 0 XP', () => {
    expect(getLevelFromXP(0)).toBe(1);
    expect(getLevelFromXP(50)).toBe(1);
  });

  test('getLevelFromXP returns 2 for 100 XP', () => {
    expect(getLevelFromXP(100)).toBe(2);
    expect(getLevelFromXP(150)).toBe(2);
  });

  test('getXPProgress returns correct data', () => {
    const result = getXPProgress(100);
    expect(result.level).toBe(2);
    expect(result.currentXP).toBe(0);
    expect(result.percentage).toBe(0);
  });

  test('getXPProgress percentage between 0 and 100', () => {
    const result = getXPProgress(150);
    expect(result.percentage).toBeGreaterThanOrEqual(0);
    expect(result.percentage).toBeLessThanOrEqual(100);
  });
});

describe('formatDuration', () => {
  test('formats seconds only', () => {
    expect(formatDuration(45)).toBe('45s');
  });

  test('formats minutes only', () => {
    expect(formatDuration(120)).toBe('2m');
  });

  test('formats minutes and seconds', () => {
    expect(formatDuration(125)).toBe('2m 5s');
  });

  test('handles zero', () => {
    expect(formatDuration(0)).toBe('0s');
  });
});

describe('getScoreColor', () => {
  test('green for high scores', () => {
    expect(getScoreColor(85)).toContain('emerald');
    expect(getScoreColor(100)).toContain('emerald');
  });

  test('yellow for medium scores', () => {
    expect(getScoreColor(70)).toContain('yellow');
  });

  test('orange for below 60', () => {
    expect(getScoreColor(45)).toContain('orange');
  });

  test('red for very low scores', () => {
    expect(getScoreColor(30)).toContain('red');
  });
});

describe('truncate', () => {
  test('does not truncate short strings', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  test('truncates long strings', () => {
    const result = truncate('This is a very long string', 10);
    expect(result).toBe('This is a ...');
  });
});
