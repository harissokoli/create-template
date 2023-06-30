#!/usr/bin/env node

require('dotenv').config();
const inquirer = require('inquirer');
const { exec } = require('child_process');

function createProject() {
	console.log(' ');
	console.log(' ');
	console.log('--------------------------------------------------');
	console.log('------------ Last update: 27.07.2023 -------------');
	console.log('--------------------------------------------------');
	console.log("88      a8P                         88");
	console.log(`88    ,88'                   ,d     ""`);
	console.log('88  ,88"                     88');
	console.log("88,d88'       88       88  MM88MMM  88  ,adPPYYba,");
	console.log('8888"88,      88       88    88     88  ""     `Y8');
	console.log('88P   Y8b     88       88    88     88  ,adPPPPP88');
	console.log('88     "88,   "8a,   ,a88    88,    88  88,    ,88');
	console.log('88       Y8b   `"YbbdP"Y8    "Y888  88  `"8bbdP"Y8');
	console.log('--------------------------------------------------');
	console.log('---------- Frontend CLI by @harissokoli ----------');
	console.log('--------------------------------------------------');
	console.log(' ');
	console.log(' ');

	inquirer
		.prompt([
			{
				type: 'input',
				name: 'projectName',
				message: 'Enter project name: ',
			},
			{
				type: 'list',
				name: 'library',
				message: 'Select library/framework: ',
				choices: ['React (ts)']
			},
			{
				type: 'list',
				name: 'store',
				message: 'Select state management tool: ',
				choices: ['Redux-Toolkit', 'Zustand', 'Context API'],
				when: (answers) => answers.library === 'React (ts)'
			},
			{
				type: 'list',
				name: 'gitRepo',
				message: 'Do you already have a git repo: ',
				choices: ['Yes', 'No']
			},
			{
				type: 'input',
				name: 'remoteUrl',
				message: 'Please insert your repo url here (format: git@github.com:User/UserRepo.git):',
				when: (answers) => answers.gitRepo === 'Yes'
			},
		])
		.then((answers) => {
			const {projectName, library, store, gitRepo, remoteUrl} = answers;

			let repo = '';
			let branch = '';

			switch (library) {
				case 'React (ts)':
					repo += 'react';
					break;
			}

			switch (store) {
				case 'Redux-Toolkit':
					branch += 'redux';
					break;
				case 'Zustand':
					branch += 'zustand';
					break;
				case 'Context API':
					branch += 'context';
					break;
			}

			const repositoryURL = `https://${process.env.GIT_TOKEN}@github.com/harissokoli/${repo}.git`;

			const c = {
				mkDir: `mkdir ${projectName}`,
				cdFolder: `cd ${projectName}`,
				cleanFolder: `rm -rf .git`,
				gitClone: `git clone -b ${branch} ${repositoryURL} .`,
				gitInit: `git init && git add .`,
				gitAddRemote: `git remote add origin ${remoteUrl}`
			}

			const cmdsBySteps = [
				c.mkDir,
				c.cdFolder,
				c.cleanFolder,
				c.gitClone,
				c.cleanFolder,
				c.gitInit,
				gitRepo === 'Yes' && remoteUrl !== '' ? c.gitAddRemote : '',
			]

			const cmds = cmdsBySteps.map(c => c)
				.toString()
				.substring(0, cmdsBySteps.map(c => c).toString().length - 1)
				.replaceAll(',', ' && ');

			exec(cmds
				//   , (error, stdout, stderr) => {
				//   if (error) {
				//     console.error(`exec error: ${error}`);
				//     return;
				//   }
				//   console.log(`stdout: ${stdout}`);
				//   console.error(`stderr: ${stderr}`);
				// }
			);
		});
}

createProject();