import Seedr from "./index.js";

const seedr = new Seedr(
    "email",
    "password"
);

const magnet = "MAGNET_LINK";

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function run() {

    const transfer = await seedr.addMagnet(magnet);

    const transferId = transfer.id;

    console.log("Magnet added:", transferId);

    let folderId;

    while (true) {

        const status = await seedr.getTransfer(transferId);

        console.log("Progress:", status.progress);

        if (status.progress >= 101) {
            folderId = status.folder_id;
            break;
        }

        await sleep(5000);
    }

    const folder = await seedr.getFolder(folderId);

    for (const file of folder.files) {

        if (
            file.name.endsWith(".mp4") ||
            file.name.endsWith(".srt")
        ) {

            console.log("Downloading:", file.name);

            await seedr.downloadFile(
                file.id,
                `./${file.name}`
            );

            console.log("Downloaded:", file.name);

            await seedr.deleteFile(file.id);
        }
    }

}

run();
