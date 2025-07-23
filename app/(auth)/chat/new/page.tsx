import { redirect } from "next/navigation";
import { createChatAction } from "@/app/actions/chats/create";
import { handleErrorClient } from "@/lib/error/client";

export default async function NewChatPage() {

    const result = await createChatAction({ title: "New Chat" });

    if ('error' in result) {
      handleErrorClient('Failed to create chat', result.error)
      return
    }

    redirect(`/chat/${result.id}`);
}