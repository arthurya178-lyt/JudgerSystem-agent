const {SCRIPT_DIRECTORY, SUPPORT_LANGUAGE, SHELL_ALLOW_TIME, RESULT_PATH,
    EXECUTE_DIRECTORY, COMPILE_PATH
} = require("./ENV.args")

const {shell, timeFileAnalyze, createFile,readFile,encodeResult} = require("./useful.js")
const path = require('path')
const {decodeBS64Files, randomCharacter, sleep} = require("./useful");
const bs64 = require('js-base64')

const script_directory = SCRIPT_DIRECTORY
const support_lang = SUPPORT_LANGUAGE

module.exports = {
    /*
    Judge for three files type [input,answer,student]
    @language_id: agent allow to use compile language
    @input_files: the file that need to compile input data
    @answer_files: the file that need to compile input data
    @student_files: the file that need to compile input data
    @base64_in (default:true): decode base64 when file go to compile
    @base64_out (default:true): encode base64 when result going to return
     */
    judge: async function (language_id, input_files, answer_files, student_files ,base64_in=true,base64_out = true) {
        let judge_status = {process_success:false,input:{},answer:{},student:{}}
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
            const sessionId = randomCharacter(24)
            const session_path = await this.startSession(sessionId)
            // check is this code require input or not
            if(input_files.length == 0){
                const compileAnswer = async ()=>{
                    // execute answer file
                    judge_status.answer = await this.executeProgram(sessionId,language_id,"answer",answer_files)
                }
                const compileStudent = async ()=>{
                    // execute student file
                    judge_status.student = await this.executeProgram(sessionId,language_id,"student",student_files)
                }
                // increase process efficiency , so here we used Synchronize Technology
                await Promise.all([compileAnswer(),compileStudent()])

            }
            else{
                // execute input file
                judge_status.input = await this.executeProgram(sessionId,language_id,"input",input_files)
                // input file should work successfully, if not this function should stop immediately
                if (!judge_status.input.done) {
                    judge_status.errInfo = {type: "input_failed", describe: "input execute unexpected failed"}
                    return judge_status
                }

                const compileAnswer = async ()=>{
                    // execute answer file
                    judge_status.answer = await this.executeProgram(sessionId,language_id,"answer",answer_files,path.join(session_path,RESULT_PATH,"input.result"))
                }

                const compileStudent = async ()=>{
                    // execute student file
                    judge_status.student = await this.executeProgram(sessionId,language_id,"student",student_files,path.join(session_path,RESULT_PATH,"input.result"))
                }
                // increase process efficiency , so here we used Synchronize Technology
                await Promise.all([compileAnswer(),compileStudent()])

            }

            if(base64_out){
                judge_status.input = encodeResult(judge_status.input)
                judge_status.answer = encodeResult(judge_status.answer)
                judge_status.student = encodeResult(judge_status.student)
            }

            judge_status.process_success = (judge_status.input.done && judge_status.input.done && judge_status.input.done)
            //await sleep(10)
            await this.endSession(sessionId)
        } catch (e) {
            console.error(e.toString())
            judge_status.errInfo = {type: "Try_catch", describe: e.toString()}
        }
        return judge_status
    },
    /*
    Judge for one file (if input parameter exist ,this function can judge with it)
    @language_id (int) : check ENV.args.js SUPPORT_LANGUAGE to get language id
    @source_code (Object Array) : Used to loading source code to file and judge in execute environment
    @input_file (Object Array): this parameter refer with @input_text, if input_text is active,
    this field require string input,if input_text is deactivate this field require objArray
    @input_text: control input type with string or objArray
    @base64_in (default:true): decode base64 when file go to compile
    @base64_out (default:true): encode base64 when result going to return
     */
    singleJudge:async function(language_id,source_code,input_file = "",input_text = false,base64_in=true,base64_out = true){
        let judge_status = {process_success:false,input:{},source:{},}
        try{
            if (!language_id) throw "language_id is empty, require language_id input !"
            if (!source_code) throw "answer_files is empty, require language_id input !"
            if (!input_text && !Array.isArray(input_file)) throw "input_files type require Array, Please reconfirm the source_code type !"
            if (!Array.isArray(source_code)) throw "answer_files type require Array, Please reconfirm the source_code type !"
            if (!support_lang[language_id]) throw "language not exist, please check the support language list !"
            if (!support_lang[language_id].activate) throw "Supported language is not activate !"


            if(input_text && typeof input_file !== "string") throw "input_file parameter should be string type"
            if(!input_text && typeof input_file !== "object") throw "input_file parameter should be object type"

            // decode part
            if(base64_in){
                input_file = input_text? bs64.decode(input_file) :decodeBS64Files(input_file)
                source_code = decodeBS64Files(source_code)
            }

            const sessionId = randomCharacter(24)
            const session_path = await this.startSession(sessionId)
            // check the input is array or text
            if(input_text){
                // check is input_file is string or not
                if(typeof input_file !== "string") throw "input_file parameter should be string type"
                // loading input data to session path compile folder
                this.loadingFile(path.join(session_path,RESULT_PATH), [{file_name:"input.result",file_data:input_file}])
                // execute source code
                judge_status.source = await this.executeProgram(sessionId,language_id,"source",source_code,path.join(session_path,RESULT_PATH,"input.result"))
                judge_status.process_success = judge_status.source.done
            }
            else{
                // execute input file
                judge_status.input = await this.executeProgram(sessionId,language_id,"input",input_file)
                // input file should work successfully, if not this function should stop immediately
                if (!judge_status.input.done) {
                    judge_status.errInfo = {type: "input_failed", describe: "input execute unexpected failed"}
                    return judge_status
                }

                // execute source code
                judge_status.source = await this.executeProgram(sessionId,language_id,"source",source_code,path.join(session_path,RESULT_PATH,"input.result"))
            }
            //await sleep(10)
            await this.endSession(sessionId)
        }
        catch (e){
            console.error(e.toString())
            judge_status.errInfo = {type: "Try_catch", describe: e.toString()}
        }
        return judge_status
    },
    /*
    @session_id (string): this parameter is the program compile session folder id
    @language_id (int) : check ENV.args.js SUPPORT_LANGUAGE to get language id
    @identification_code (string) : Used to identify the execution process
    @source_code (Object Array) : Used to loading source code to file and judge in execute environment
    @input_file_path (string) Not necessary: input file path (base on script folder)
     */
    executeProgram: async function (sessionId,language_id, identification_code, source_code, input_file_path = "") {
        let execStatus = {done: false}
        try {
            // validation input value and type
            if (!language_id) throw "language_id is empty, require language_id input !"
            if (!source_code) throw "source_code is empty, require language_id input !"
            if (!Array.isArray(source_code)) throw "source_code type require Array, Please reconfirm the source_code type !"
            if (!support_lang[language_id]) throw "language not exist, please check the support language list !"
            if (!support_lang[language_id].activate) throw "language not active, please check the support language list !"

            // function main part
            const session_path = path.join(EXECUTE_DIRECTORY,sessionId)

            const compile_dir = path.join(session_path,COMPILE_PATH)
            const result_dir = path.join(session_path,RESULT_PATH)

            // loading file into compile environment
            const loading_result = this.loadingFile(compile_dir,source_code)
            if(!loading_result.done){
                throw loading_result.info.describe
            }

            // execute program
            await shell(`timeout --preserve-status ${SHELL_ALLOW_TIME}  ${path.join(script_directory, support_lang[language_id].execute_file)} ${session_path} ${identification_code} ${input_file_path}`).then(response => {
                // console.log(response)
                if (response.error) {
                    if (response.error.code === 1) {
                        execStatus.errInfo = {type: "Shell", describe: "compile error"}
                        execStatus.stdout = readFile(path.join(result_dir,`${identification_code}.result`))

                    } else if (response.error.code === 2) {
                        execStatus.errInfo = {type: "Shell", describe: "missing program"}
                        execStatus.stdout = readFile(path.join(result_dir,`${identification_code}.result`))
                    } else if (response.error.code === 3) {
                        execStatus.errInfo = {type: "Shell", describe: "An error occurred during execution, it maybe Timeout or missing input file"}
                        execStatus.stdout = readFile(path.join(result_dir,`${identification_code}.result`))
                    } else if (response.error.code === 143) {
                        execStatus.errInfo = {type: "Unexpected", describe: "execute_file timeout interrupted"}
                    } else {
                        console.error(response.error)
                        execStatus.errInfo = {type: "Unexpected", describe: response.error}
                    }
                } else {
                    execStatus.stdout = readFile(path.join(result_dir,`${identification_code}.result`))
                    execStatus.done = true
                }

                if (!response.error || response.error.code === 3) {
                    execStatus.time_used = timeFileAnalyze(path.join(result_dir, `${identification_code}.exec.time`), 'TimeUsed')
                    execStatus.Memory_used = timeFileAnalyze(path.join(result_dir, `${identification_code}.exec.time`), 'MaxMemoryUsed')
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
    startSession:async function (environment_session){
        console.log(`[Sessions] ++ Start new session | ID: ${environment_session} | ++`)
        await shell(`${path.join(SCRIPT_DIRECTORY,'prepare_environment.sh')} ${environment_session}`)
            //.then(res=>{console.log(res)})
        return path.join(EXECUTE_DIRECTORY,environment_session)
    },
    endSession:async function (environment_session){
        console.log(`[Sessions] -- End session | ID: ${environment_session} | --`)
        await shell(`${path.join(SCRIPT_DIRECTORY,'finish_environment.sh')} ${environment_session}`)
            //.then(res=>{console.log(res)})
    }

}