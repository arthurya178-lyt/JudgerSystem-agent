const {SCRIPT_DIRECTORY,COMPILE_DIRECTORY, OUTPUT_DIRECTORY, SUPPORT_LANGUAGE, SHELL_ALLOW_TIME, RESULT_PATH,
    RESULT_DIRECTORY
} = require("./ENV.args")

const {shell, timeFileAnalyze, createFile,readFile,encodeResult} = require("./useful.js")
const path = require('path')
const {decodeBS64Files} = require("./useful");

const script_directory = SCRIPT_DIRECTORY
const support_lang = SUPPORT_LANGUAGE

module.exports = {

    judge: async function (language_id, input_files, answer_files, student_files ,base64_in=true,base64_out = true) {
        let judge_status = {done:false,input:{},answer:{},student:{}}
        try {
            // validation input value and type
            if (!language_id) throw "language_id is empty, require language_id input !"
            if (!input_files) throw "input_files is empty, require language_id input !"
            if (!answer_files) throw "answer_files is empty, require language_id input !"
            if (!student_files) throw "test_files is empty, require language_id input !"
            if (!Array.isArray(input_files)) throw "input_files type require Array, Please reconfirm the source_code type !"
            if (!Array.isArray(answer_files)) throw "answer_files type require Array, Please reconfirm the source_code type !"
            if (!Array.isArray(student_files)) throw "student_files type require Array, Please reconfirm the source_code type !"
            if (!support_lang[language_id]) throw "language not exist, please check the support language list !"
            if (!support_lang[language_id].activate) throw "Supported language is not activate !"

            // decode part
            if(base64_in){
                input_files = decodeBS64Files(input_files)
                answer_files = decodeBS64Files(answer_files)
                student_files = decodeBS64Files(student_files)
            }

            // function main part

                // execute input file
            judge_status.input = await this.executeProgram(language_id,"input",input_files)
                    // input file should work successfully, if not this function should stop immediately
            if (!judge_status.input.done) {
                judge_status.errInfo = {type: "input_failed", describe: "input execute unexpected failed"}
                return judge_status
            }
                // execute answer file
            judge_status.answer = await this.executeProgram(language_id,"answer",answer_files,path.join(RESULT_DIRECTORY,"input.result"))
                // execute student file
            judge_status.student = await this.executeProgram(language_id,"student",student_files,path.join(RESULT_DIRECTORY,"input.result"))

            if(base64_out){
                judge_status.input = encodeResult(judge_status.input)
                judge_status.answer = encodeResult(judge_status.answer)
                judge_status.student = encodeResult(judge_status.student)
            }

            judge_status.done = (judge_status.input.done && judge_status.input.done && judge_status.input.done)

        } catch (e) {
            console.error(e.toString())
            judge_status.errInfo = {type: "Try_catch", describe: e.toString()}
        }
        return judge_status
    },
    /*
    @language_id (int) : check ENV.args.js SUPPORT_LANGUAGE to get language id
    @identification_code (string) : Used to identify the execution process
    @source_code (Object Array) : Used to loading source code to file and judge in execute environment
    @input_file_path (string) Not necessary: input file path (base on script folder)
     */
    executeProgram: async function (language_id, identification_code, source_code, input_file_path = "") {
        let execStatus = {done: false}
        try {
            // validation input value and type
            if (!language_id) throw "language_id is empty, require language_id input !"
            if (!source_code) throw "source_code is empty, require language_id input !"
            if (!Array.isArray(source_code)) throw "source_code type require Array, Please reconfirm the source_code type !"
            if (!support_lang[language_id]) throw "language not exist, please check the support language list !"
            if (!support_lang[language_id].activate) throw "language not active, please check the support language list !"

            // function main part

            await this.prepareEnvironment()
            // loading file into compile environment
            const loading_result = this.loadingFile(COMPILE_DIRECTORY,source_code)
            if(!loading_result.done){
                throw loading_result.info.describe
            }


            // execute program
            await shell(`timeout --preserve-status ${SHELL_ALLOW_TIME}  ${path.join(script_directory, support_lang[language_id].execute_file)} ${identification_code} ${input_file_path}`).then(response => {
                // console.log(response)
                if (response.error) {
                    if (response.error.code === 1) {
                        execStatus.errInfo = {type: "Shell", describe: "compile error"}
                        execStatus.stdout = readFile(path.join(OUTPUT_DIRECTORY,`${identification_code}.compile`))

                    } else if (response.error.code === 2) {
                        execStatus.errInfo = {type: "Shell", describe: "missing program"}
                        execStatus.stdout = readFile(path.join(OUTPUT_DIRECTORY,`${identification_code}.compile`))
                    } else if (response.error.code === 3) {
                        execStatus.errInfo = {type: "Shell", describe: "An error occurred during execution, it maybe Timeout or missing input file"}
                        execStatus.stdout = readFile(path.join(RESULT_DIRECTORY,`${identification_code}.result`))
                    } else if (response.error.code === 143) {
                        execStatus.errInfo = {type: "Unexpected", describe: "execute_file timeout interrupted"}
                    } else {
                        console.error(response.error)
                        execStatus.errInfo = {type: "Unexpected", describe: response.error}
                    }
                } else {
                    execStatus.stdout = readFile(path.join(RESULT_DIRECTORY,`${identification_code}.result`))
                    execStatus.done = true
                }

                if (!response.error || response.error.code === 3) {
                    execStatus.time_used = timeFileAnalyze(path.join(OUTPUT_DIRECTORY, `${identification_code}.exec.time`), 'TimeUsed')
                    execStatus.Memory_used = timeFileAnalyze(path.join(OUTPUT_DIRECTORY, `${identification_code}.exec.time`), 'MaxMemoryUsed')
                }
            })
        } catch (e) {
            console.error(e.toString())
            execStatus.errInfo = {type: "Try_catch", describe: e.toString()}
        }
        return execStatus

    },
    /*
    @file_path (string): file create directory
    @file_list (Object Array): file you want to create
        @file_name (String)
        @file_data (String)
     */
    loadingFile: function (file_path, file_list) {
        let loadStatus = {done: false}
        try {
            // validation input value and type
            if (!Array.isArray(file_list)) throw "require file_list type Array!"
            if (!file_path || file_path.length == 0) throw "require create path!!"

            // function main part
            for (let file = 0; file < file_list.length; file++) {
                // if create file failed
                if (!createFile(file_path, file_list[file].file_name, file_list[file].file_data))
                    throw `Creating file ${file_list[file].file_name} failed`
            }
            loadStatus.done = true
        } catch (e) {
            console.error(e.toString())
            loadStatus.info = {type: "Try_catch", describe: e.toString()}
        }
        return loadStatus
    },
    prepareEnvironment:async function (){
        await shell(`${path.join(SCRIPT_DIRECTORY,'preparation_environment.sh')}`)
    }
}