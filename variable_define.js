const path = require('path')

// // Back end server connection IP
exports.BACKEND_SV = `http://${process.env["CENTRAL_SERVER_IP"]}:${process.env["CENTRAL_SERVER_PORT"]}`
// // Base Directory
exports.SCRIPT_DIRECTORY = path.join(__dirname,"script")
exports.EXECUTE_DIRECTORY = path.join(this.SCRIPT_DIRECTORY,"sessions")
exports.COMPILE_FOLDER_NAME = "compile"
exports.RESULT_FOLDER_NAME = "result"

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
exports.SECURITY_WORD = [ /system\s*\(/g,/WinExec\s*\(/g,/::CreateProcess\s*\(/g,/\.exec\s*\(/g,/\.fork\s*\(/g,
    /bash\s*\(/g,/pwd\s*\(/g,]


