import fs from 'fs';
import { exec } from 'child_process';

export function checkGitTagExists(tagName) {
    return new Promise((resolve, reject) => {
        exec(`git tag -l ${tagName}`, (err, stdout, stderr) => {
            if (err) {
                throw new Error(`Error executing Git command: ${stderr}`);
            }

            // Check if the tag exists in the list of tags (there should be only one)
            const tags = stdout.split('\n').map(tag => tag.trim());
            resolve(tags.includes(tagName));
        });
    });
};

export function createTag(tagName) {
    return new Promise((resolve, reject) => {
        exec(`git tag ${tagName}`, (err, stdout, stderr) => {
            if (err) {
                throw new Error(`Error creating tag: ${stderr}`);
            }
            console.log(`Tag ${tagName} created successfully.`)
            resolve(true);
        });
    });
}

export function isRepoClean() {
    return new Promise((resolve, reject) => {
        exec(`git status --porcelain`, (err, stdout, stderr) => {
            if (err) {
                throw new Error(`Error running isRepoClean: ${stderr}`);
            }
            const dirtyCount = stdout.split('\n').filter(Boolean).length;
                if (dirtyCount) {
                    throw new Error(`Uncommitted changes: ${dirtyCount}.`)
                }
                resolve(dirtyCount == 0);
        });
    });
}

export function lintApi(filePath) {
    return new Promise((resolve, reject) => {
        exec(`npx --yes @redocly/cli lint ${filePath}`, (err, stdout, stderr) => {
            if (err) {
                throw new Error(`Error running linter: ${stderr}`);
            }
            resolve(stderr);
        });
    });
}

export function buildApi(filePath, destFile = './dist/openapi.yml') {
    return new Promise((resolve, reject) => {
        exec(`npx --yes @redocly/cli bundle ${filePath} -o ${destFile}`, (err, stdout, stderr) => {
            if (err) {
                throw new Error(`Error running linter: ${stderr}`);
            }
            stderr += `adding ${destFile} to commit...\n`;
            exec(`git add ${destFile} -f`, (err, stdout, stderr2) => {
                if (err) {
                    throw new Error(`Error adding build: ${stderr}`);
                }
                resolve(stderr + '\n' + stderr2);
            })
        });
    });
}

export function getApiVersion(filePath) {
    const data = fs.readFileSync(filePath, { encoding: 'utf8' });
    const regex = /version: "?([^"\n]*)"?/;
    const matches = data.match(regex);

    if (!matches || matches.length != 2)
        throw new Error('version info not found');
    return matches[1];
}

export function checkUnstagedFiles() {
    return new Promise((resolve, reject) => {
        exec('git diff --no-color --name-only', (err, stdout, stderr) => {
            if (err) {
                throw new Error(`Error running unstaged: ${stderr}`);
            }
            const dirtyCount = stdout.split('\n').filter(Boolean).length;
            if (dirtyCount) {
            throw new Error(`Unstaged files: ${dirtyCount}.`)
            }
            resolve(dirtyCount == 0);
        });
    });
}
