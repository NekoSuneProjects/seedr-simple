import axios from "axios";
import fs from "fs";

export default class Seedr {

    constructor(email, password) {
        this.client = axios.create({
            baseURL: "https://www.seedr.cc/rest",
            auth: { username: email, password: password }
        });
    }

    async root() {
        const res = await this.client.get("/folder");
        return res.data;
    }

    async folder(id) {
        const res = await this.client.get(`/folder/${id}`);
        return res.data;
    }

    async addMagnet(magnet) {
        const params = new URLSearchParams();
        params.append("magnet", magnet);

        const res = await this.client.post("/transfer/magnet", params);
        return res.data;
    }

    async transfer(id) {
        const res = await this.client.get(`/transfer/${id}`);
        return res.data;
    }

    async downloadFile(fileId, path) {

        const res = await this.client.get(`/file/${fileId}`, {
            responseType: "stream",
            maxRedirects: 5
        });

        return new Promise((resolve, reject) => {

            const stream = fs.createWriteStream(path);

            res.data.pipe(stream);

            stream.on("finish", resolve);
            stream.on("error", reject);
        });
    }

    async deleteFile(fileId) {
        const res = await this.client.post(`/file/${fileId}/delete`);
        return res.data;
    }

}
