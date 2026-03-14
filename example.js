import Seedr from "./index.js";

const seedr = new Seedr(
    "email",
    "password"
);

const magnet = "MAGNET_LINK_HERE";

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function run() {

    console.log("Adding magnet...");

    const transfer = await seedr.addMagnet(magnet);

    const transferId = transfer.id;

    console.log("Transfer ID:", transferId);

    let folderId = null;

    while (true) {

        const status = await seedr.transfer(transferId);

        console.log("Progress:", status.progress);

        if (status.progress >= 101) {
            folderId = status.folder_id;
            break;
        }

        await sleep(5000);
    }

    console.log("Download finished");

    const folder = await seedr.folder(folderId);

    for (const file of folder.files) {

        if (
            file.name.endsWith(".mp4") ||
            file.name.endsWith(".srt")
        ) {

            console.log("Downloading", file.name);

            await seedr.downloadFile(
                file.id,
                `./${file.name}`
            );

            console.log("Downloaded", file.name);

            await seedr.deleteFile(file.id);

            console.log("Deleted from Seedr");
        }
    }

}

run();
