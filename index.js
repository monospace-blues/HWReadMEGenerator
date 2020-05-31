/* our node packages */
const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");

// this is the promisify for writeFile!
const writeFileAsync = util.promisify(fs.writeFile)

// function to prompt the user for their Github username and info about the README
function promptUser() {
    return inquirer.prompt([
        {
            type: "input",
            message: "What is your GitHub username?",
            name: "githubName"
        },
        {
            type: "input",
            message: "What is your email?",
            name: "email"
        },
        {
            type: "input",
            message: "What is your project title?",
            name: "projectTitle"
        },
        {
            type: "input",
            message: "What is your URL to your project?",
            name: "urlLink"
        },
        {
            type: "input",
            message: "Write a short description about your project?",
            name: "description"
        },
        {
            type: "input",
            message: "Usage?",
            name: "usage"
        },
        {
            type: "input",
            message: "What kind of License?",
            name: "license"
        },
        {
            type: "input",
            message: "Contributors?",
            name: "contributors"
        },
        {
            type: "input",
            message: "What packages to install?",
            name: "packages"
        }
    ]);
}

// function to generate the license badge
const generateLicense = argLicense => {
    // MIT
    if (argLicense.toLowerCase() === "mit") {
        return `[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)`
    }
    //GPLv3
    else if (argLicense.toLowerCase() === ('gpl'||'gplv3')) {
        return `[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)`
    }
    //AGPL
    else if (argLicense.toLowerCase() === 'apgl') {
        return `[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)  
        `
    }
    // default
    else {
        if (argLicense != "") {
            return `![License](https://img.shields.io/badge/License-${argLicense.split(' ').join("%20")}-Clause-red.svg)`
        } else {
            return `![License](https://img.shields.io/badge/license-empty-blue.svg)`
        }
    }
}

// function to generate README text
function generateREADME(answers, image, html,) {
    return `# ${answers.projectTitle}
${generateLicense(answers.license)}

## Description
${answers.description}

${answers.urlLink}

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Questions](#questions)

## Installation
npm i ${answers.packages}

## Usage
${answers.usage}

## License
${answers.license.toUpperCase()}

## Contributing
${answers.contributors}

## Questions

Ask: [${answers.githubName}](${html})

${answers.email}

![GitHub user](${image})
`
}

// call our methods, first the prompt.
promptUser().then(function (answers) {
    // URL for Git Hub info:
    const URL = `https://api.github.com/users/${answers.githubName}`
    // call axios to get Github Info
    axios.get(URL)
    .then(function (res) {
        // get the image url and github html of user
        const image_url = res.data.avatar_url;
        const github_url = res.data.html_url;
        
        // generate the readme
        const readMe = generateREADME(answers, image_url, github_url);

        // write the file
        return writeFileAsync("./READMEFolder/README.md", readMe);

    });
})
.then(function() {
    console.log("Successfully wrote to README.md!");
})
// any errors are caught in the .catch() method.
.catch(function (err) {
    console.log(err);
});