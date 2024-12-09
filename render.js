import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import Color from 'color';
import * as libs from './libs.js';


export const getSVGMini = (svgPath, x, y, h, fill = '#fff') => {
    let svg = libs.getSVG(svgPath);
    let $ = cheerio.load(svg);
    $('svg').attr('x', x);
    $('svg').attr('y', y);
    $('svg').attr('height', h);
    $('svg').attr('fill', fill);
    return $.html('svg');
};


export const getText = (text, x, y, size, fill = '#fff', alignment) => {
    return `<text 
    x="${x}"
     y="${y}"
     font-size="${size}"
     ${alignment}
     fill="${fill}">
     ${text}
     </text>`;
}

const replaceCalcedColors = (data, svg) => {
    let color = data.options.colorPalette;

    // svg = svg.replace(/\{\{c1\}\}/g, new Color(`rgb(${color[0].join(',')})`).hex());
    // svg = svg.replace(/\{\{c2\}\}/g, new Color(`rgb(${color[1].join(',')})`).hex());
    // svg = svg.replace(/\{\{c3\}\}/g, new Color(`rgb(${color[2].join(',')})`).hex());
    // svg = svg.replace(/\{\{c4\}\}/g, new Color(`rgb(${color[3].join(',')})`).hex());
    // svg = svg.replace(/\{\{c5\}\}/g, new Color(`rgb(${color[4].join(',')})`).hex());
    // svg = svg.replace(/\{\{c6\}\}/g, new Color(`rgb(${color[5].join(',')})`).hex());

    color.forEach((c, i) => {
        svg = svg.replace(new RegExp(`\\{\\{c${i + 1}\\}\\}`, 'g'), `rgb(${c.join(',')})`);
    }
    );

    return svg;
};

const setMargin = (data, svg) => {
    let margin = data.options.margin;
    if (margin.reduce((a, b) => a + b) == 0) {
        return svg;
    }
    if (margin.length > 4) {
        margin = margin.slice(0, 4);
    }
    if (margin.length == 3) {
        margin.push(0);
    }
    let $ = cheerio.load(svg);
    $('svg').attr('style', `margin: ${margin.join('px ')}px;`);
    return $.html('svg');
};

/**
 * @param {string} svg
 */
const minifySVG = (svg) => {
    return `<!-- Generated by ShevonKwan -->\n<!-- https://github.com/ShevonKuan/github-personal-card -->\n${svg
        .replace(/[\n\t\r]/g, '')
        .replace(/\s+/g, ' ')}`;
};


export const getRenderedSVG = (data, avatarBase64, userCoverImageBase64) => {
    let templete = fs.readFileSync(path.join(process.cwd(), `/assets/svg_template/template.svg`), 'utf8');

    let user = data.data;

    //尺寸
    templete = templete.replace('{{width}}', data.options.size.width);
    templete = templete.replace('{{height}}', data.options.size.height);


    //动画
    templete = templete.replace('{{fg-extra-class}}', data.options.animation ? 'animation-enabled' : '');


    //颜色
    templete = replaceCalcedColors(data, templete);

    //圆头像
    if (data.options.round_avatar) {
        templete = templete.replace(/<path id="avatar_clip"[^>]*>/, '<circle id="avatar_clip" class="cls-1" cx="62.5" cy="60.5" r="42.2"/>');
    }
    //外边距
    templete = setMargin(data, templete);
    //name
    templete = templete.replace('{{name}}',
        getText(user.name, 118, 8, 18, '#fff', `text-anchor="start" dominant-baseline="hanging"`)
        + getText(user.login + `${user.pronouns != null ? `・${user.pronouns}` : ""}`, 118, 37.84, 12, 'rgba(255, 255, 255, 0.5)', `text-anchor="start" dominant-baseline="auto"`)

    );

    //头像和封面
    templete = templete.replace('{{avatar-base64}}', avatarBase64);
    templete = templete.replace('{{user-cover-base64}}', userCoverImageBase64);

    //detail
    if (data.options.followers) {
        templete = templete.replace(
            '{{followers}}',
            getSVGMini('followers', 330, 4, 13, 'rgba(255, 255, 255, 0.5)')
            + getText(libs.kFormatter(user.followers.totalCount), 390, 4, 13, 'rgba(255, 255, 255, 0.5)', `text-anchor="end" dominant-baseline="hanging"`)
        );
    }
    if (data.options.repo) {
        templete = templete.replace(
            '{{repo}}',
            getSVGMini('repo', 330, 27, 13, 'rgba(255, 255, 255, 0.5)')
            + getText(libs.kFormatter(user.repositories.totalCount), 390, 27, 13, 'rgba(255, 255, 255, 0.5)', `text-anchor="end" dominant-baseline="hanging"`)
        );
    }
    let detail = [];
    let Y = [];
    let line = 0;
    data.options.company ? line++ : null;
    data.options.location ? line++ : null;
    let bio = data.options.bio ? libs.wrapTextMultiline(user.bio, 60, 3) : [];
    data.options.bio ? line += bio.length : null;
    let fontSize = (line > 3) ? 10 : 12;
    let top = 42.84, bottom = 119;
    let gap = (bottom - top) / (line + 1);
    for (let i = 1; i <= line; i++) {
        Y.push(i * gap + top - fontSize / 2);
    }
    if (data.options.bio) {
        bio.forEach((b, i) => {
            var y = Y.shift();
            detail.push(getText(b, 118, y, fontSize, 'rgba(255, 255, 255, 0.8)', `text-anchor="start" dominant-baseline="hanging"`));
        });
    }
    if (data.options.company) {
        var y = Y.shift();
        detail.push(getSVGMini('company', 118, y + 2, fontSize - 1, 'rgba(255, 255, 255, 0.7)'));
        detail.push(getText(user.company, 123 + fontSize, y, fontSize, 'rgba(255, 255, 255, 0.7)', `text-anchor="start" dominant-baseline="hanging"`));
    }
    if (data.options.location) {
        var y = Y.shift();
        detail.push(getSVGMini('location', 118, y + 2, fontSize - 1, 'rgba(255, 255, 255, 0.7)'));
        detail.push(getText(user.location, 123 + fontSize, y, fontSize, 'rgba(255, 255, 255, 0.7)', `text-anchor="start" dominant-baseline="hanging"`));
    }

    templete = templete.replace('{{detail}}', detail.join(''));



    return minifySVG(templete);
};


export const getErrorSVG = (err) => {
    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 1000 100" style="enable-background:new 0 0 1000 100;" xml:space="preserve">
<text 
    x="0"
     y="0"
     alignment-baseline="center"
    dominant-baseline="Hanging"
     text-anchor="start"
     fill="#fff">
     ${err}
     </text>
</svg>
`
};