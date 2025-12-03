import { Chat } from "../сhatsApp/types";
import { IError, IOk, IOkWithData } from "../types/types";
import { CreateMessage, DeletedMessagesInfo, Message } from "./types";
import messageRepository from "./messagesRepository";

async function createMessage(
	data: CreateMessage,
): Promise<IOkWithData<CreateMessage> | IError> {
	const result = await messageRepository.createMessage(data);
	if (!result) {
		return { status: "error", message: "Error" };
	}
	return { status: "success", data: result };
}

async function getMessage(id: number): Promise<IOkWithData<Message> | IError> {
	const result = await messageRepository.getMessage({ id });
	if (!result) {
		return { status: "error", message: "Error" };
	}
	return { status: "success", data: result };
}

async function deleteAllMessagesFromChat(
	id: number,
): Promise<IOkWithData<DeletedMessagesInfo> | IError> {
	try {
		const result = await messageRepository.deleteAllMessagesFromChat(id);
		return { status: "success", data: result };
	} catch (error) {
		return { status: "error", message: "Не вдалося видалити повідомлення" };
	}
}

export const messageService = {
	createMessage,
	getMessage,
	deleteAllMessagesFromChat,
};
