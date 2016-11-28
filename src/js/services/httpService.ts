import {Promise} from 'es6-promise';
class HttpService {
    static httpGet(url: string) {
        return new Promise<string>(function (resolve, reject) {

            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);

            xhr.onload = function () {
                if (this.status === 200) {
                    resolve(this.response);
                } else {
                    let error = new Error(this.statusText);
                    reject(error);
                }
            };

            xhr.onerror = function () {
                reject(new Error("Network Error"));
            };

            xhr.send();
        });
    }
}

export default HttpService;