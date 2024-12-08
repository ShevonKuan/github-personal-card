import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import got from 'got';
import ColorThief from 'colorthief';
import wrap from "word-wrap";


export const getSVG = (fileName) => {
    const filePath = path.join(process.cwd(), `/assets/icons/${fileName}.svg`);
    const playmodeSVG = fs.readFileSync(filePath, 'utf8');
    return playmodeSVG;
};


export const getResizedCoverBase64 = async (img, w, h, blur = 0, flop = false) => {
    blur = Math.min(blur, 100);
    const image = sharp(img, { failOnError: false }).resize(parseInt(w * 1.5), parseInt(h * 1.5));
    if (blur >= 0.5 && blur <= 100) image.blur(blur);
    if (flop) image.flop();
    //image.modulate({ brightness: 1.5, saturation: 1.1 });
    return image.toBuffer().then((data) => 'data:image/png;base64,' + data.toString('base64'));
};


export const calcWCAGColorContrast = (color1, color2) => {
    const calcLuminance = (color) => {
        let [r, g, b] = color.rgb().color.map((c) => c / 255);
        [r, g, b] = [r, g, b].map((c) => {
            if (c <= 0.03928) {
                return c / 12.92;
            }
            return Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    let contrast = (calcLuminance(color1) + 0.05) / (calcLuminance(color2) + 0.05);
    return Math.max(contrast, 1 / contrast);
}

/**
 * Fetches an image from the given URL and returns it in both buffer and base64 encoded formats.
 *
 * @param {string} url - The URL of the image to fetch.
 * @returns {Promise<[Buffer, string]>} A promise that resolves to an array containing the image buffer and its base64 encoded string.
 */
export const getImage = async (url) => {

    const response = await got({
        method: 'get',
        responseType: 'buffer',
        url,
    });
    return [response.body, "data:image/png;base64," + Buffer.from(response.body).toString('base64')];
}

export  const generateMaterialYouColors = async (image) => {
    let p
    await ColorThief.getPalette(image, 6)
        .then(palette => { p = palette })
        .catch(err => { console.log(err) })
    return p;

}

/**
 * Split text over multiple lines based on the card width.
 *
 * @param {string} text Text to split.
 * @param {number} width Line width in number of characters.
 * @param {number} maxLines Maximum number of lines.
 * @returns {string[]} Array of lines.
 */
export const wrapTextMultiline = (text, width = 59, maxLines = 3) => {
    const fullWidthComma = "，";
    const encoded = encodeHTML(text);
    const isChinese = encoded.includes(fullWidthComma);

    let wrapped = [];

    if (isChinese) {
        wrapped = encoded.split(fullWidthComma); // Chinese full punctuation
    } else {
        wrapped = wrap(encoded, {
            width,
        }).split("\n"); // Split wrapped lines to get an array of lines
    }

    const lines = wrapped.map((line) => line.trim()).slice(0, maxLines); // Only consider maxLines lines

    // Add "..." to the last line if the text exceeds maxLines
    if (wrapped.length > maxLines) {
        lines[maxLines - 1] += "...";
    }

    // Remove empty lines if text fits in less than maxLines lines
    const multiLineText = lines.filter(Boolean);
    return multiLineText; 
};


/**
 * Encode string as HTML.
 *
 * @see https://stackoverflow.com/a/48073476/10629172
 *
 * @param {string} str String to encode.
 * @returns {string} Encoded string.
 */
const encodeHTML = (str) => {
    return str
        .replace(/[\u00A0-\u9999<>&](?!#)/gim, (i) => {
            return "&#" + i.charCodeAt(0) + ";";
        })
        .replace(/\u0008/gim, "");
};

/**
 * Retrieves num with suffix k(thousands) precise to 1 decimal if greater than 999.
 *
 * @param {number} num The number to format.
 * @returns {string|number} The formatted number.
 */
export const kFormatter = (num) => {
    return Math.abs(num) > 999
        ? Math.sign(num) * parseFloat((Math.abs(num) / 1000).toFixed(1)) + "k"
        : Math.sign(num) * Math.abs(num);
};