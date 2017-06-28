const logger = require('../logger/logger');

class Assets {

    //Default loading assets from same host as source of web content
    constructor(hostUrl='') {
        this.assetCache = {};
        this.hostUrl = hostUrl;
    }

    //TODO: implement filesystem caching of game assets
    loadAssetsFromFileSystem() {

    }

    //TODO Consider using data uri or some other way of storing images not as HTML5 elements
    loadAsset(path) {

        const cachedAssetData = this.assetCache[this.hostUrl + path];
        if(cachedAssetData) {
            logger.debug(`Using cache for asset: ${this.hostUrl + path}`);
            return Promise.resolve(cachedAssetData);
        }

        return this._downloadHttpAsset(path)
            .then(this._imageDataToImageElement)
            .then(img => {
                this.assetCache[this.hostUrl + path] = img;
                console.debug(`Adding asset into cache ${this.hostUrl + path}`);
                return img;
            })
    }

    _downloadHttpAsset(path) {
        return new Promise((resolve, reject) => {

            const oReq = new XMLHttpRequest();

            oReq.responseType = 'arraybuffer';
            oReq.addEventListener("load", (oEvent) => {
                if(oReq.status === 200) {
                    const byteArray = new Uint8Array(oReq.response);
                    let mime = undefined;
                    if(byteArray.length < 4) {
                        const err = new Error('Transferred image is less than 4 bytes');
                        logger.error(`Something went wrong loading asset ${this.hostUrl + path}`, err);
                        reject(err);
                    }

                    if (byteArray[0] == 0x89 && byteArray[1] == 0x50 && byteArray[2] == 0x4E && byteArray[3] == 0x47)
                        mime = 'image/png';
                    else if (byteArray[0] == 0xff && byteArray[1] == 0xd8)
                        mime = 'image/jpeg';
                    else if (byteArray[0] == 0x47 && byteArray[1] == 0x49 && byteArray[2] == 0x46)
                        mime = 'image/gif';
                    else {
                        const err = new Error('Could not detect image type from magic number');
                        logger.error(`Something went wrong loading asset ${this.hostUrl + path}`, err);
                        reject(err);
                    }


                    let binary = '';
                    for (let i = 0; i < byteArray.length; i++)
                        binary += String.fromCharCode(byteArray[i]);
                    const base64 = window.btoa(binary);

                    const imgData = 'data:' + mime + ';base64,' + base64;
                    logger.debug(`Successfully downloaded image ${this.hostUrl + path}`);

                    resolve(imgData);
                }
                else {
                    const err = new Error(`Received status ${oReq.status} transferring ${this.hostUrl + path}`);
                    logger.error('Something went wrong loading asset', err);
                    reject(err)
                }
            });

            oReq.addEventListener("progress", (oEvent) => {
                if (oEvent.lengthComputable) {
                    const percentComplete = (oEvent.loaded / oEvent.total) * 100;
                    logger.debug(`${percentComplete}% complete downloading ${this.hostUrl + path} - ${oEvent.loaded} of ${oEvent.total}`);
                    // ...
                } else {
                    // Unable to compute progress information since the total size is unknown
                }
            });

            oReq.addEventListener("error", () => {
                const err = new Error('Error loading asset: ' + this.hostUrl + path);
                logger.error(`Something went wrong loading asset`, err);
                reject(err);
            });

            oReq.addEventListener("abort", () => {
                const err = new Error('Error loading asset: ' + this.hostUrl + path + ' transfer aborted');
                logger.error(`Something went wrong loading asset`, err);
                reject(err);
            });

            oReq.open("GET", this.hostUrl + path, true);
            oReq.send();
        });
    }

    _imageDataToImageElement(base64ImageData) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                resolve(image);
            };

            image.src = base64ImageData;
        });
    }

    //TODO: this loads the whole tilemap, rather than just a single tile
    loadTileFromTileMap(tileMapUrl, topLeftCoords, bottomRightCoords) {
        return this.loadAsset(tileMapUrl);
    }
}

export default Assets;
