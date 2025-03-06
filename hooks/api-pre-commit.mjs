import { getApiVersion, assertGitTagDoesNotExist, lintApi, buildApi, assertNoUnstagedFiles } from './utils.mjs';

Error.stackTraceLimit = 0;

const filePath = './src/openapi.yml';
try {
    assertNoUnstagedFiles();

    const ver = "v" + getApiVersion(filePath);

    console.log('found version:', ver);
    console.log('checking if tag already exists...');

    assertGitTagDoesNotExist(ver, filePath);

    console.log('validating API...');
    lintApi(filePath);

    console.log('building...');
    buildApi(filePath);
    console.log('pre-commit check finished OK');
    process.exit(0);

} catch (error) {
    console.error(error.message);
    process.exit(1);
}
