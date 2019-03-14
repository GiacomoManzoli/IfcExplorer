// Come importarte tutte le BimServerApi
import { BimServerApiPromise, BimServerApiWebSocket, Model } from '../libs/bimserverapi.bundle.00136';
import BimServerClient from '../libs/bimserverapi.bundle.00136';
//console.log(BimServerClient, BimServerApiPromise, BimServerApiWebSocket, Model);

const BIM_SERVER_ADDRESS = 'http://localhost:8082';
const USERNAME = 'bim@888sp.it';
const PASSWORD = 'bim';


const bimServerApi = new BimServerClient(BIM_SERVER_ADDRESS);

bimServerApi.promiseCall = function (serviceInterface, method, reqData) {
    let othis = bimServerApi;
    let promise = new Promise((resolve, reject) => {
        console.log("Calling...", serviceInterface, method, reqData);
        othis.call(serviceInterface, method, reqData, function (data) {
            console.log("call success!");
            resolve(data);
        }, function (error) {
            console.error("call failed!", error);
            reject(error);
        });
    });
    return promise;
};

export default bimServerApi