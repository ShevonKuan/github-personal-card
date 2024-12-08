import express from 'express';
import NodeCache from 'node-cache';
import * as libs from './libs.js';
import * as render from './render.js';
import { fetchGitHubUserDetails } from './api.js';

import dotenv from 'dotenv';
dotenv.config();


const cacheControl = new NodeCache({ stdTTL: 600, checkperiod: 600, deleteOnExpire: true });
const app = express();

app.get('/card', async function (req, res) {
    let userData = {};
    res.set({
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
    });
    let username = req.query.user ?? '';
    if (username == "") {
        return res.send(render.getErrorSVG('Error: ' + 'No username provided'));
    }
    let avatar, avatarBase64;

    let cacheKey = `${username}`;

    if (cacheControl.has(cacheKey)) {
        ({ userData, avatar, avatarBase64 } = cacheControl.get(cacheKey));
        console.log(`Fetching data from cache...(${username})`);
    } else {
        console.log(`Fetching data from GitHub API...(${username})`);
        if (process.env.MODE == 'dev') {
            userData.data = {
                "login": "ShevonKuan",
                "name": "✨Shevon・Kuan✨",
                "databaseId": 49824574,
                "avatarUrl": "https://avatars.githubusercontent.com/u/49824574?u=9eded6aa2c2624203160797fad93786466d0e890&v=4",
                "bio": "🌸   是只猫咪耶～ | 呜喵～（*＾3＾）/～✨   🌸",
                "company": "South China University of Technology",
                "location": "Guangzhou, China",
                "pronouns": "Meow～",
                "followers": {
                    "totalCount": 80
                },
                "repositories": {
                    "totalCount": 84
                }
            };
        }
        else {
            await fetchGitHubUserDetails(username).then((data) => {
                userData.data = data;
            }).catch((error) => {
                userData.error = error;
            });
        }
        if (userData.error) return res.send(render.getErrorSVG('Error: ' + userData.error));

        [avatar, avatarBase64] = await libs.getImage(userData.data.avatarUrl);
        cacheControl.set(cacheKey, { userData, avatar, avatarBase64 });
    }

    let blur = 80;
    if (req.query.blur != undefined && req.query.blur == '') {
        blur = 6;
    } else if (req.query.blur != undefined) {
        blur = parseFloat(req.query.blur);
    }

    let width = 400;
    let height = 120;
    const flop = req.query.flop != undefined;
    let userCoverImageBase64;
    userCoverImageBase64 = await libs.getResizedCoverBase64(avatar, width, height, blur, flop);

    let colorPalette;
    colorPalette = await libs.generateMaterialYouColors(avatar);
    const margin = (req.query.margin ?? '0,0,0,0').split(',').map((x) => parseInt(x));


    userData.options = {
        animation: req.query.animation != 'false',
        size: {
            width: width,
            height: height
        },
        round_avatar: req.query.round_avatar != 'false',
        colorPalette: colorPalette,
        margin,
        company: req.query.company != 'false' && userData.data.company != null,
        location: req.query.location != 'false' && userData.data.location != null,
        followers: req.query.followers != 'false' && userData.data.followers.totalCount != null,
        repo: req.query.repo != 'false' && userData.data.repositories.totalCount != null,
        bio: req.query.bio != 'false' && userData.data.bio != null,
    }
    console.log(userData);
    let svg = render.getRenderedSVG(userData, avatarBase64, userCoverImageBase64);
    res.send(svg);
});



app.listen(process.env.PORT || 3000);
