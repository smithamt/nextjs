import RemoveModel from "@/models/isdelete/model";
import UserNotification from "@/models/notifications/model";
import UpdateSchema from "@/models/updates/model";
import { NotificationType } from "@/types";
import io from "socket.io-client";

export const saveUpdateData = async ({
  title,
  fromModel,
  context,
  employee,
  data,
}: {
  title: string;
  fromModel: string;
  context: string;
  employee: string;
  data: any;
}) => {
  const updated = await UpdateSchema.create({
    title,
    fromModel,
    context,
    employee,
    data,
    updatedAt: new Date(),
  });
  return updated;
};

export const saveRemoveData = async ({
  title,
  fromModel,
  context,
  employee,
}: {
  title: string;
  fromModel: string;
  context: string;
  employee: string;
}) => {
  const updated = await RemoveModel.create({
    title,
    fromModel,
    context,
    deletedBy: employee,
  });

  return updated;
};

export const createNotification = async (data: any) => {
  try {
    const populatedNotification = new UserNotification(data);
    await populatedNotification.save();

    const response = await UserNotification.findById(
      populatedNotification._id
    ).populate("from", "name nickname profile");

    return response;
  } catch (error) {
    console.log("error", error);
  }
};

export const sendNotification = (to: string, data: any) => {
  const domain = "http://172.16.20.61:3003";
  const socket = io(domain, { query: { id: to } });
  socket.emit("notification", data);
};

export const updateNotification = async (data: any) => {
  const response = await UserNotification.findOneAndUpdate(
    { content: data.content },
    data
  ).populate("from", "name nickname profile keyword");
  return response;
};
