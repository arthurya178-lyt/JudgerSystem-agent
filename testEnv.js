const judger = require('./executor.js')
const {COMPILE_DIRECTORY, OUTPUT_DIRECTORY} = require('./ENV.args')
const {decodeBS64Files, readFile} = require('./useful')
const path = require("path");
asyncFunction()


async function asyncFunction(){
    const File = [
        {
            file_name:'main.cpp',
            file_data:"I2luY2x1ZGUgPGlvc3RyZWFtPgojaW5jbHVkZSA8c3RyaW5nPgp1c2luZyBuYW1lc3BhY2Ugc3RkOwoKaW50IG1haW4oKXsKICAgIGNvdXQgPDwgImhlbGxvLHdvcmxkISEiOwp9"
        }
    ]

    const Answer = [
        {
            file_name:'main.cpp',
            file_data:"I2luY2x1ZGUgPGlvc3RyZWFtPgojaW5jbHVkZSA8c3RyaW5nPgp1c2luZyBuYW1lc3BhY2Ugc3RkOwoKaW50IG1haW4oKXsKICAgIHN0cmluZyBkYXRhOwogICAgZ2V0bGluZShjaW4sZGF0YSk7CiAgICBpZihkYXRhID09ICJoZWxsbyx3b3JsZCEhIikKICAgICAgICBjb3V0IDw8ICJ0cnVlIjsKICAgIGVsc2UKICAgICAgICBjb3V0IDw8ICJmYWxzZSI7Cn0="
        }
    ]

    const student = [
        {
            file_name:'main.cpp',
            file_data:"I2luY2x1ZGUgPGlvc3RyZWFtPgojaW5jbHVkZSA8c3RyaW5nPgp1c2luZyBuYW1lc3BhY2Ugc3RkOwoKaW50IG1haW4oKXsKICAgIHN0cmluZyBkYXRhOwogICAgZ2V0bGluZShjaW4sZGF0YSk7CiAgICBpZihkYXRhID09ICJoZWxsbyx3b3JsZCEhIikKICAgICAgICBjb3V0IDw8ICJmYWxzZSI7CiAgICBlbHNlCiAgICAgICAgY291dCA8PCAidHJ1ZSI7Cn0="
        }
    ]
    // const decode = decodeBS64Files(File)
    // console.log(decode)
    // judger.loadingFile(COMPILE_DIRECTORY,decode)
    // console.log(await judger.executeProgram(1,'student',[],'./test.in'))


    console.log(await judger.judge(1,File,Answer,student))
    //console.log(readFile(path.join(OUTPUT_DIRECTORY,'input.compile')))
}