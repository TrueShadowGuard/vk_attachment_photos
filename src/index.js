import "./env.js";
import { VK } from 'vk-io';
import directAuth from "./directAuth.js"
import download from "./download.js";
import path from "path";
import fs from "fs/promises";
import clearOutput from "./clearOutput.js";

async function run() {
    const authResponse = await directAuth.run();

    const vk = new VK({
        token: authResponse.token,
    });

    const conversationResponse = await vk.api.messages.getConversationsById({
        peer_ids: process.env.CHAT_ID
    });

    const lastMessageId = conversationResponse.items[0].last_message_id;

    const messageResponse = await vk.api.messages.getById({
        message_ids: lastMessageId
    });

    await clearOutput();

    const photoUrls = collectPhotos(messageResponse.items[0]);
    await fs.writeFile(path.resolve("log.txt"), photoUrls.map((url, i) => i + "_" + url).join("\n"));

    for(let i = 0; i < photoUrls.length; i++) {
        await download(photoUrls[i], path.resolve("output", "photo_" + i + ".jpg"));
    }

    debugger;

}

function collectPhotos(message) {
    if(message.fwd_messages) {
        return message.fwd_messages.map(collectPhotos).reduce((a,b) => [...a, ...b]);
    }
    if(message.attachments) {
        return message.attachments
            .filter(attachment => attachment.type === "photo")
            .map(attachmentToPhotoUrl);
    }

    function attachmentToPhotoUrl(attachment) {
        return attachment.photo.sizes.reduce((a,b) => a.width > b.width ? a : b).url
    }
}

run().catch(console.log);