# osu-stats-signature

[![GitHub](https://img.shields.io/github/license/ShevonKuan/github-personal-card?color=blue&style=for-the-badge)](https://github.com/ShevonKuan/github-personal-card/blob/main/LICENSE) [![GitHub stars](https://img.shields.io/github/stars/ShevonKuan/github-personal-card?color=ff69b4&style=for-the-badge)](https://github.com/ShevonKuan/github-personal-card/stargazers) [![GitHub last commit](https://img.shields.io/github/last-commit/ShevonKuan/github-personal-card?style=for-the-badge)](https://github.com/ShevonKuan/github-personal-card/commits/main)

## Introduction

GitHub Personal Card is a project built upon [osu-stats-signature](https://github.com/solstice23/osu-stats-signature) and [GitHub Readme Stats](https://github.com/anuraghazra/github-readme-stats), designed to create personalized GitHub cards. This project implements core functionalities and integrates certain utility functions to enhance user experience.

## Preview

<img align="center" src="./example/2.svg" height=100 />
<img align="center" src="./example/1.svg" height=100 />

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Third-party Libraries and Resources

This project leverages code and resources from the following open-source projects:

- **osu-stats-signature**: Created by solstice23, it offers functionality for generating osu! profile statistics signatures. Our project draws inspiration from its design philosophy and technical implementation. [MIT License](https://github.com/solstice23/osu-stats-signature/blob/master/LICENSE)
- **GitHub Readme Stats**: Created by anuraghazra, this project provides a set of utility functions to generate GitHub readme stats. We have incorporated some of these utility functions directly into our codebase. [MIT License](https://github.com/anuraghazra/github-readme-stats/blob/master/LICENSE)

We are grateful to the authors of these projects for their contributions to the open-source community. If you find these projects helpful, please consider starring🌟 their repositories!

## Usage

The project is deployed on Vercel. Visit [github-personal-card.vercel.app](https://github-personal-card.vercel.app) to generate.

Insert the generated URL to SVG as an image on the desired place.

### On Vercel

#### :film_projector: [Check Out Step By Step Video Tutorial By @codeSTACKr](https://youtu.be/n6d4KHSKqGk?t=107)

Since the GitHub API only allows 5k requests per hour, my `https://github-personal-card.vercel.app/card` could possibly hit the rate limiter. If you host it on your own Vercel server, then you do not have to worry about anything. Click on the deploy button to get started!

> [!NOTE]\
> If you are on the [Pro (i.e. paid)](https://vercel.com/pricing) Vercel plan, the [maxDuration](https://vercel.com/docs/concepts/projects/project-configuration#value-definition) value found in the [vercel.json](https://github.com/anuraghazra/github-readme-stats/blob/master/vercel.json) can be increased when your Vercel instance frequently times out during the card request. You are advised to keep this value lower than `30` seconds to prevent high memory usage.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/ShevonKuan/github-personal-card)

<details>
 <summary><b>:hammer_and_wrench: Step-by-step guide on setting up your own Vercel instance</b></summary>

1.  Go to [vercel.com](https://vercel.com/).
2.  Click on `Log in`.
    ![](https://files.catbox.moe/pcxk33.png)
3.  Sign in with GitHub by pressing `Continue with GitHub`.
    ![](https://files.catbox.moe/b9oxey.png)
4.  Sign in to GitHub and allow access to all repositories if prompted.
5.  Fork this repo.
6.  Go back to your [Vercel dashboard](https://vercel.com/dashboard).
7.  To import a project, click the `Add New...` button and select the `Project` option.
    ![](https://files.catbox.moe/3n76fh.png)
8.  Click the `Continue with GitHub` button, search for the required Git Repository and import it by clicking the `Import` button. Alternatively, you can import a Third-Party Git Repository using the `Import Third-Party Git Repository ->` link at the bottom of the page.
    ![](https://files.catbox.moe/mg5p04.png)
9.  Create a personal access token (PAT) [here](https://github.com/settings/tokens/new) and enable the `repo` and `user` permissions (this allows access to see private repo and user stats).
10. Add the PAT as an environment variable named `PAT` (as shown).
    ![](https://files.catbox.moe/0yclio.png)
11. Click deploy, and you're good to go. See your domains to use the API!

</details>

## Parameters

You can customize the appearance and content of your GitHub Personal Card by passing query parameters via the URL. Below is a list of available options along with their descriptions:

| Parameter      | Description                                                                         | Type    | Default Value |
| -------------- | ----------------------------------------------------------------------------------- | ------- | ------------- |
| `user`         | (neccessary) The GitHub username of the user whose information you want to display. | String  | `ShevonKuan`  |
| `animation`    | Whether to enable animations on the card.                                           | Boolean | `true`        |
| `round_avatar` | Whether to round the avatar image.                                                  | Boolean | `true`        |
| `company`      | Whether to display the user's company information, if available.                    | Boolean | `true`        |
| `location`     | Whether to display the user's location information, if available.                   | Boolean | `true`        |
| `followers`    | Whether to display the user's follower count, if available.                         | Boolean | `true`        |
| `repo`         | Whether to display the total repository count, if available.                        | Boolean | `true`        |
| `bio`          | Whether to display the user's bio, if available.                                    | Boolean | `true`        |
| `margin`       | The margin of the card eg. `&margin=5,5,5,5`                                        | String  | `0,0,0,0`     |

### Usage Example

To generate a card with custom parameters, you would use a URL like this:

```markdown
![ShevonKuan](https://github-personal-card.vercel.app/card?user=ShevonKuan)
```
