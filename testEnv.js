const judger = require('./executor.js')
const {COMPILE_DIRECTORY, OUTPUT_DIRECTORY, RESULT_PATH} = require('./ENV.args')
const {decodeBS64Files, readFile} = require('./useful')
const path = require("path");
asyncFunction()


async function asyncFunction(){
    const File = [
        {
            file_name:'main.cpp',
            file_data:"#include <iostream>\n" +
                "#include <string>\n" +
                "using namespace std;\n" +
                "\n" +
                "int main(){\n" +
                "    cout << \"hello,world!!\";\n" +
                "}"
        }
    ]

    const Answer = [
        {
            file_name:'main.cpp',
            file_data:"#include <iostream>\n" +
                "#include <string>\n" +
                "using namespace std;\n" +
                "\n" +
                "int main(){\n" +
                "    string data;\n" +
                "    getline(cin,data);\n" +
                "    if(data == \"hello,world!!\")\n" +
                "        cout << \"true\";\n" +
                "    else\n" +
                "        cout << \"false\";\n" +
                "}"
        }
    ]

    const student = [
        {
            file_name:'main.cpp',
            file_data:`#include<iostream> \n` +
                `using namespace std; \n` +
                `int main(){ cout << "hello,world" << endl; }`
        }
    ]
    // const decode = decodeBS64Files(File)
    // console.log(decode)
    // judger.loadingFile(COMPILE_DIRECTORY,decode)
    // console.log(await judger.executeProgram(1,'student',[],'./test.in'))


    //console.log(await judger.judge(1,File,Answer,student))
    //console.log(readFile(path.join(OUTPUT_DIRECTORY,'input.compile')))

    let place = await judger.startSession("abc1233")
    console.log(place)
    console.log(await judger.executeProgram("abc1233",1,"input",File))
    console.log(await judger.executeProgram("abc1233",1,"answer",Answer,path.join(place,RESULT_PATH,'input.result')))
    console.log(await judger.executeProgram("abc1233",1,"student",student,path.join(place,RESULT_PATH,'input.result')))
    console.log(await judger.endSession("abc1233"))
}