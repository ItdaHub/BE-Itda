"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAiDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_ai_dto_1 = require("./create-ai.dto");
class UpdateAiDto extends (0, swagger_1.PartialType)(create_ai_dto_1.CreateAiDto) {
}
exports.UpdateAiDto = UpdateAiDto;
//# sourceMappingURL=update-ai.dto.js.map