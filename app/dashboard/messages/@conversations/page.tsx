import EmployeeProfile from "@/components/profile/page";
import { Input } from "@/components/ui/input";
import connectMongo from "@/config/mongo";
import ConversationModel from "@/models/conversations/model";
import moment from "moment";

async function MessengerConversations() {
  await connectMongo()
  const conversations = await ConversationModel.find().sort({
    lastMessageAt: -1,
  });

  return (
    <div className="h-full w-full">
      <p className="font-bold text-lg mb-2">Chats</p>
      <Input placeholder="Search Employee" />
      <div className="h-[calc(100%-80px)] overflow-y-auto w-full">
        {conversations.map((conversation, index) => {
          return (
            <div className="p-2 hover" key={index}>
              <EmployeeProfile
                to={`/dashboard/messages/${conversation._id}`}
                employee={conversation}
                ago={moment(conversation.lastMessageAt).fromNow()}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MessengerConversations;
