"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertAgeToNumber = convertAgeToNumber;
function convertAgeToNumber(age) {
    if (age.includes("10"))
        return 10;
    if (age.includes("20"))
        return 20;
    if (age.includes("30"))
        return 30;
    if (age.includes("40"))
        return 40;
    return null;
}
//# sourceMappingURL=user.util.js.map