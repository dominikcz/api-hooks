import { getApiVersion, createTag } from './utils.mjs';

Error.stackTraceLimit = 0;

const filePath = './dist/openapi.yml';
try {
    const ver = "v" + getApiVersion(filePath);

    console.log('creating tag:', ver);
    if (createTag(ver)){
        console.log('everything OK');
        process.exit(0);
    }
       
} catch (error) {
    console.error(error.message);
    process.exit(1);    
}
