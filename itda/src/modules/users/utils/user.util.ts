/**
 * 출생 연도로 나이 계산
 * @param birthYear - 출생 연도 (문자열 형태, 예: "1990")
 * @returns 현재 나이 (숫자)
 */
export function calculateAge(birthYear: string): number {
  const year = parseInt(birthYear, 10);
  const currentYear = new Date().getFullYear();
  return currentYear - year;
}
