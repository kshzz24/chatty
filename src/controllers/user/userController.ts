import e, { NextFunction, Request, Response } from "express";
import User from "../../models/User.js";
import { AuthRequest } from "../../middleware/authMiddleware.js";
import Invite from "../../models/Invite.js";

export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;

  const allUsersList = await User.find({ _id: { $ne: currentUserId } })
    .select("username email status") // don’t send password
    .lean();

  const allUsersIds = allUsersList?.map((user) => user._id.toString());

  const currentUserContactList = await User.findById(currentUserId);
  const remainingUsers = currentUserContactList?.contacts.filter(
    (contact) => !allUsersIds.includes(contact.toString())
  );
  res.json({ users: remainingUsers });
};

export const getCurrentUserDetails = async (
  req: AuthRequest,
  res: Response
) => {
  const currentUserId = req.user.id;
  const userDetails = await User.findById(currentUserId);

  res.json({ users: userDetails });
};

export const getAllContactsDetails = async (
  req: AuthRequest,
  res: Response
) => {
  const currentUserId = req.user.id;
  const { contactIds } = req.body;

  if (!currentUserId) {
    res.status(400).json({
      error: "Invalid authentication",
    });
  }

  const friends = await User.find({ _id: { $in: contactIds } })
    .select("-password")
    .lean();

  res.status(200).json({ users: friends });
};

export const sendInvites = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const senderId = req.user.id;
    const { receiverIds } = req.body;

    if (!Array.isArray(receiverIds) || receiverIds.length === 0) {
      res.status(400).json({ error: "receiverIds must be a non-empty array" });
      return;
    }

    const invitesToCreate = [];

    for (const receiverId of receiverIds) {
      if (senderId === receiverId) continue;

      const existing = await Invite.findOne({
        sender: senderId,
        receiver: receiverId,
        status: "pending",
      });

      if (!existing) {
        invitesToCreate.push({
          sender: senderId,
          receiver: receiverId,
        });
      }
    }

    const invites = await Invite.insertMany(invitesToCreate);

    res
      .status(201)
      .json({ message: `${invites.length} invites sent`, invites });
  } catch (err) {
    next(err);
  }
};

export const allCurrentInvites = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserId = req.user.id;

    const allCurrentUserInvites = await Invite.find({
      receiver: currentUserId,
      status: "pending",
    })
      .populate("sender", "username email") // Optional: populate sender info
      .lean();

    res
      .status(200)
      .json({ message: `All Current Invites`, invites: allCurrentUserInvites });
  } catch (err) {
    next(err);
  }
};

export const acceptRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserId = req.user.id;

    const { inviteId } = req.body;
    // console.log(inviteId, "inviteId");
    const invite = await Invite.findById(inviteId);

    console.log(currentUserId, invite?.receiver.toString(), "dsfddsfd");

    if (!invite || invite.receiver.toString() !== currentUserId) {
      res.status(404).json({
        error: "Invite not found",
      });
      return;
    }

    invite.status = "accepted";
    await invite.save();

    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { contacts: invite.sender },
    });
    await User.findByIdAndUpdate(invite.sender, {
      $addToSet: { contacts: invite.receiver },
    });
    await Invite.findByIdAndDelete(inviteId);

    res.status(200).json({ message: "Invite accepted successfully" });
  } catch (err) {
    console.log(err);
  }
};

export const rejectRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserId = req.user.id;
    console.log(req.body, "req.");
    const { inviteId } = req.body;

    const invite = await Invite.findById(inviteId);
    if (!invite || invite.receiver.toString() !== currentUserId) {
      res.status(404).json({
        error: "Invite not found",
      });
      return;
    }
    await Invite.findByIdAndDelete(inviteId);
    res.status(200).json({ message: "Invite rejected and deleted" });
  } catch (err) {
    console.log(err);
  }
};
