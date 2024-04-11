import { encode as encodeBase45 } from 'base45';
import QRCode from "qrcode";
import pako from "pako";

const compressZlib = (token) => {
    // Convert the token string to a byte array
    // const bytes = new TextEncoder().encode(token);

    const dictionary = new TextEncoder().encode('https://www.w3.org/2018/credentials/v1');

    // const vcDictionary = "type";
    // zlib
    const compressed = pako.deflate(token, {level: 9}, dictionary);

    // Convert the compressed byte array back to a string
    // const compressedToken = String.fromCharCode.apply(
    //     null,
    //     new Uint8Array(compressed),
    // );


    return compressed;
};

const generateQRCode = async (token, errorCorrectionLevel) => {
    try {
        const segs = [{ data: token, mode: "auto" }];
        const data = await QRCode.toDataURL(segs, {
            errorCorrectionLevel,
        });
        return { data, token, errorMessage: "" };
    } catch (err) {
        const errorMessage = `${err.message}. The token length is ${token.length}.`;
        return { data: "", token: "", errorMessage };
    }
};
const issueCredential = async (jsonInput, errorCorrectionLevel) => {
    const jsonInputString = JSON.stringify(jsonInput);

    const token = encodeBase45(jsonInputString);

    const compressedInput = compressZlib(jsonInputString);
    const compressedToken = encodeBase45(compressedInput);

    const vcQR = await generateQRCode(token, errorCorrectionLevel);
    const compressedVcQR = await generateQRCode(compressedToken, errorCorrectionLevel);
    const compressedRatio = token.length / compressedToken.length;

    return { vcQR, compressedVcQR, compressedRatio };
};

export const actions = {
	default: async ({ request }) => {
        const formData = await request.formData();
        const jsonInput = JSON.parse(formData.get('jsonInput'));
        const errorCorrectionLevel = formData.get('errorCorrectionLevel');

        const result = await issueCredential(jsonInput, errorCorrectionLevel);

        return result;
	}
};