"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const friendshipRepository_1 = __importDefault(require("./friendshipRepository"));
function createFriendship(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield friendshipRepository_1.default.createFriendship(data);
        if (!result) {
            return { status: "error", message: "Friendship not created" };
        }
        return { status: "success", data: result };
    });
}
function getFriendship() {
    return __awaiter(this, void 0, void 0, function* () {
        const friendship = yield friendshipRepository_1.default.getFriendship();
        if (!friendship) {
            return { status: "error", message: "No friendship found" };
        }
        return { status: "success", data: friendship };
    });
}
function acceptFriendship(where) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedFriendship = yield friendshipRepository_1.default.updateFriendship({ accepted: true }, { profile1_id_profile2_id: where });
        console.log(updatedFriendship);
        if (!updatedFriendship) {
            return { status: "error", message: "No friendship found" };
        }
        return { status: "success", data: updatedFriendship };
    });
}
function deleteFriendship(profile1_id, profile2_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const deletedFriendship = yield friendshipRepository_1.default.deleteFriendship(profile1_id, profile2_id);
        if (!deletedFriendship) {
            return { status: "error", message: "No friendship found" };
        }
        return { status: "success", data: deletedFriendship };
    });
}
const friendshipService = {
    createFriendship: createFriendship,
    getFriendship: getFriendship,
    acceptFriendship,
    deleteFriendship,
};
exports.default = friendshipService;
