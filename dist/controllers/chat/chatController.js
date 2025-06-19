import Chat from "../../models/Chat.js";
export const createChat = async (req, res) => {
    try {
        const { isGroup, name, recipients } = req.body;
        const currentUserId = req.user.id;
        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            res.status(400).json({ error: "Recipients are required" });
        }
        if (!recipients.includes(currentUserId)) {
            recipients.push(currentUserId);
        }
        if (!isGroup && recipients.length !== 2) {
            res.status(400).json({ error: "1-on-1 chat must have 2 users" });
        }
        if (!isGroup) {
            const existingChat = await Chat.findOne({
                isGroup: false,
                recipients: { $all: recipients, $size: 2 },
            });
            if (existingChat) {
                res.status(200).json({ chat: existingChat });
            }
        }
        const newChat = await Chat.create({
            isGroup,
            name: isGroup ? name : undefined,
            recipients,
        });
        res.status(201).json({ chat: newChat });
    }
    catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
};
export const getAllChats = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const allChats = await Chat.find({
            recipients: { $in: [currentUserId] },
        }).populate("isGroup name latestMessage unreadCounts");
        console.log(allChats, "allChats");
        res.status(201).json({ chats: allChats });
    }
    catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
};
export const getChatDetails = async (req, res) => {
    try {
        const { chatId } = req.params;
        const chatDetails = await Chat.findById(chatId);
        res.status(201).json({ chats: chatDetails });
    }
    catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
};
