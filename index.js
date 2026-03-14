const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

class Seedr {

    constructor(email, password) {
        this.client = axios.create({
            baseURL: "https://www.seedr.cc/rest",
            auth: {
                username: email,
                password: password
            }
        });
    }

    // -------------------------
    // USER
    // -------------------------

    async getUser() {
        const res = await this.client.get("/user");
        return res.data;
    }

    // -------------------------
    // FOLDERS
    // -------------------------

    async rootFolder() {
        const res = await this.client.get("/folder");
        return res.data;
    }

    async getFolder(folderId) {
        const res = await this.client.get(`/folder/${folderId}`);
        return res.data;
    }

    async downloadFolderZip(folderId, output) {
        const res = await this.client.get(`/folder/${folderId}/download`, {
            responseType: "stream",
            maxRedirects: 5
        });

        const stream = fs.createWriteStream(output);
        res.data.pipe(stream);

        return new Promise((resolve, reject) => {
            stream.on("finish", resolve);
            stream.on("error", reject);
        });
    }

    async createFolder(path) {
        const params = new URLSearchParams();
        params.append("path", path);

        const res = await this.client.post("/folder", params);
        return res.data;
    }

    async renameFolder(folderId, newName) {
        const params = new URLSearchParams();
        params.append("rename_to", newName);

        const res = await this.client.post(`/folder/${folderId}/rename`, params);
        return res.data;
    }

    async deleteFolder(folderId) {
        const res = await this.client.post(`/folder/${folderId}/delete`);
        return res.data;
    }

    // -------------------------
    // FILES
    // -------------------------

    async downloadFile(fileId, output) {

        const res = await this.client.get(`/file/${fileId}`, {
            responseType: "stream",
            maxRedirects: 5
        });

        const stream = fs.createWriteStream(output);
        res.data.pipe(stream);

        return new Promise((resolve, reject) => {
            stream.on("finish", resolve);
            stream.on("error", reject);
        });
    }

    async getHLS(fileId) {
        const res = await this.client.get(`/file/${fileId}/hls`);
        return res.data;
    }

    async getFileImage(fileId, output) {

        const res = await this.client.get(`/file/${fileId}/image`, {
            responseType: "stream"
        });

        const stream = fs.createWriteStream(output);
        res.data.pipe(stream);

        return new Promise((resolve, reject) => {
            stream.on("finish", resolve);
            stream.on("error", reject);
        });
    }

    async getThumbnail(fileId, output) {

        const res = await this.client.get(`/file/${fileId}/thumbnail`, {
            responseType: "stream"
        });

        const stream = fs.createWriteStream(output);
        res.data.pipe(stream);

        return new Promise((resolve, reject) => {
            stream.on("finish", resolve);
            stream.on("error", reject);
        });
    }

    async renameFile(fileId, newName) {

        const params = new URLSearchParams();
        params.append("rename_to", newName);

        const res = await this.client.post(`/file/${fileId}/rename`, params);
        return res.data;
    }

    async deleteFile(fileId) {
        const res = await this.client.post(`/file/${fileId}/delete`);
        return res.data;
    }

    // -------------------------
    // TRANSFERS
    // -------------------------

    async getTransfer(id) {
        const res = await this.client.get(`/transfer/${id}`);
        return res.data;
    }

    async addMagnet(magnet) {

        const params = new URLSearchParams();
        params.append("magnet", magnet);

        const res = await this.client.post("/transfer/magnet", params);
        return res.data;
    }

    async addURL(url) {

        const params = new URLSearchParams();
        params.append("url", url);

        const res = await this.client.post("/transfer/url", params);
        return res.data;
    }

    async addFile(filePath) {

        const form = new FormData();
        form.append("file", fs.createReadStream(filePath));

        const res = await this.client.post("/transfer/file", form, {
            headers: form.getHeaders()
        });

        return res.data;
    }

    async deleteTransfer(id) {
        const res = await this.client.post(`/transfer/${id}`);
        return res.data;
    }

}

module.exports = Seedr;
