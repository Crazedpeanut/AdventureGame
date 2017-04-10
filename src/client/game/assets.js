class Assets {
    constructor() {
        this.assetCache = [];
    }

    loadAsset(path) {
        return new Promise((resolve, reject) => {

            const cachedAsset = this.assetCache[path];
            if(cachedAsset) {
                resolve(cachedAsset);
            }

            const oReq = new XMLHttpRequest();

            oReq.responseType = 'arraybuffer';
            oReq.addEventListener("load", (oEvent) => {
                if(oReq.status === 200) {
                    const byteArray = new Uint8Array([this.response]);
                    let mime = undefined;
                    if(byteArray.length < 4) {
                        reject(new Error('Transferred image is less than 4 bytes'));
                    }

                    if (byteArray[0] == 0x89 && byteArray[1] == 0x50 && byteArray[2] == 0x4E && byteArray[3] == 0x47)
                        mime = 'image/png';
                    else if (byteArray[0] == 0xff && byteArray[1] == 0xd8)
                        mime = 'image/jpeg';
                    else if (byteArray[0] == 0x47 && byteArray[1] == 0x49 && byteArray[2] == 0x46)
                        mime = 'image/gif';
                    else
                        reject(new Error('Could not detect image type from magic number'));

                    let binary = '';
                    for (let i = 0; i < byteArray.length; i++)
                        binary += String.fromCharCode(byteArray[i]);
                    const base64 = window.btoa(binary);

                    let image = new Image();

                    image.onload = () => {
                        this.assetCache[path] = image;
                        resolve(image);
                    };

                    image.src = 'data:' + mime + ';base64,' + base64;
                }
                else {
                    reject(new Error(`Received status ${oReq.status} transferring ${path}`))
                }
            });

            oReq.addEventListener("progress", (oEvent) => {
                if (oEvent.lengthComputable) {
                    const percentComplete = oEvent.loaded / oEvent.total;
                    console.log(`${percentComplete}%`);
                    // ...
                } else {
                    // Unable to compute progress information since the total size is unknown
                }
            });

            oReq.addEventListener("error", () => {
                reject(new Error('Error loading asset: ' + path));
            });

            oReq.addEventListener("abort", () => {
                reject(new Error('Error loading asset: ' + path+ ' transfer aborted'));
            });

            oReq.open("GET", path, true);
            oReq.send();
        });
    }
}

export default Assets;
