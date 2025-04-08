"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBirthYearToAgeGroup = convertBirthYearToAgeGroup;
exports.convertNaverAgeToGroup = convertNaverAgeToGroup;
function convertBirthYearToAgeGroup(birthYear) {
    const year = parseInt(birthYear, 10);
    if (isNaN(year))
        return null;
    const now = new Date().getFullYear();
    const age = now - year;
    if (age < 20)
        return 10;
    if (age < 30)
        return 20;
    if (age < 40)
        return 30;
    if (age < 50)
        return 40;
    return null;
}
function convertNaverAgeToGroup(age) {
    console.log("🟡 네이버로부터 받은 age:", age);
    if (!age)
        return null;
    const parsed = age.split("-")[0];
    const ageNum = parseInt(parsed, 10);
    if ([10, 20, 30, 40].includes(ageNum)) {
        return ageNum;
    }
    return null;
}
//# sourceMappingURL=agegroup.util.js.map