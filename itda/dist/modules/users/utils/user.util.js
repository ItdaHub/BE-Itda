"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAge = calculateAge;
function calculateAge(birthYear) {
    const year = parseInt(birthYear, 10);
    const currentYear = new Date().getFullYear();
    return currentYear - year;
}
//# sourceMappingURL=user.util.js.map