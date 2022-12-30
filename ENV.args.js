const path = require('path')

exports.ACTIVE_CODE="9C7YZYRKLYLVQ7Y9"

exports.BACKEND_IP="10.17.98.1"
//exports.BACKEND_IP="192.168.163.1"
exports.BACKEND_PORT=8080
exports.AGENT_PORT=8123

exports.RELOAD_TIME=2000

exports.SCRIPT_PATH = "./script"
exports.EXECUTE_PATH = "./sessions"
exports.COMPILE_PATH = "./compile"
exports.RESULT_PATH = "./result"
exports.SHELL_ALLOW_TIME = '30s'
exports.SUPPORT_LANGUAGE = [
    {
        language_name: "Test (Test 1.0.0)",
        language_type: "Test",
        execute_file: "test.sh",
        suffix:"text",
        replacer:"#",
        activate: false
    },
    {
        language_name: "C++ (G++ 11.3.0)",
        language_type: "C++",
        execute_file: "execute_cpp.sh",
        suffix:"cpp",
        replacer:"//",
        activate: true
    },
    {
        language_name: "C (GCC 11.3.0)",
        language_type: "C",
        execute_file: "execute_c.sh",
        suffix:"c",
        replacer:"//",
        activate: true
    },
    {
        language_name: "Python (Python 3.10.6)",
        language_type: "Python",
        execute_file: "execute_py.sh",
        suffix:"py",
        replacer:"#",
        activate: true
    },
    {
        language_name: "Java (OpenJDK 18.0.2-ea)",
        language_type: "Java",
        execute_file: "execute_java.sh",
        suffix:"java",
        replacer:"//",
        activate: true
    }
]
exports.SECURITY_WORD = [ /system\s*\(/g,/WinExec\s*\(/g,/::CreateProcess\s*\(/g,/\.exec\s*\(/g]


// process commonly used path, don't change inside
// // Back end server connection IP
exports.BACKEND_SV = `http://${this.BACKEND_IP}:${this.BACKEND_PORT}`
// // Base Directory
exports.SCRIPT_DIRECTORY = path.join(__dirname,this.SCRIPT_PATH)
exports.EXECUTE_DIRECTORY = path.join(this.SCRIPT_DIRECTORY,this.EXECUTE_PATH)