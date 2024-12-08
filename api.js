// api.js

import dotenv from 'dotenv';
import got from 'got';
dotenv.config();
const GITHUB_API_URL = 'https://api.github.com/graphql';
const GITHUB_TOKEN = process.env.PAT; // 从环境变量中获取GitHub个人访问令牌

if (!GITHUB_TOKEN) {
    throw new Error('GitHub token not found in environment variables.');
}

export async function fetchGitHubUserDetails(username) {
    const query = `
        query($login: String!) {
            user(login: $login) {
                login
                name
                databaseId
                avatarUrl
                bio
                company
                location
                pronouns
                followers {
                    totalCount
                }
                repositories(first: 0) {
                    totalCount
                }
            }
        }
    `;

    const variables = { login: username };

    try {
        const response = await got.post(GITHUB_API_URL, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            json: { query, variables }
        });

        const data = JSON.parse(response.body);
        if (data.errors) {
            throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
        }

        return data.data.user;
    } catch (error) {
        console.error('Error fetching GitHub user details:', error.message);
        throw error; // 抛出错误以便调用方处理
    }
}