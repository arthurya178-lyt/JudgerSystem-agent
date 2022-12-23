const exec = require('child_process').exec
const fs = require('fs')
const path = require("path");
const bs64 = require('js-base64')

exports.shell = function (command) {
    return new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
            resolve({error, stdout, stderr})
        })
    })
}

exports.randomCharacter = function (SIZE=32) {
    const charList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let rebuild = ""
    for(let i = 0 ; i < SIZE ; i++){
        rebuild += charList.charAt(Math.floor(Math.random()*charList.length))
    }
    return rebuild
}

exports.timeFileAnalyze = function (file_path, keyword, split_char = ": ") {
    try {
        if (fs.existsSync(file_path)) {
            const file = fs.readFileSync(file_path)
            const file_line = file.toString().split("\n")
            // console.log(file_line)
            for (let line = 0; line < file_line.length; line++) {
                const split_line = file_line[line].split(split_char)
                if (split_line[0] === keyword) {
                    return split_line[1]
                }
            }
        }

    } catch (e) {
        console.error(e.toString())
    }
    return null
}
exports.createFile = function (file_path, file_name, file_data) {
    try {
        if (fs.existsSync(file_path)) {
            fs.writeFileSync(path.join(file_path, file_name), file_data)
            return true
        }
    } catch (e) {
        console.error(e.toString())
    }
    return false
}
exports.decodeBS64Files = function (file_list) {
    try {
        let tmp_files = []
        if (Array.isArray(file_list)) {
            for (let file = 0; file < file_list.length; file++) {
                tmp_files.push({
                    file_name: file_list[file].file_name,
                    file_data: bs64.decode(file_list[file].file_data)
                })
            }
            return tmp_files
        }
    } catch (e) {
        console.error(e.toString())
    }
    return null
}

exports.encodeResult = function (result) {
    try {
        if(result.stdout)
            result.stdout = bs64.encode(result.stdout)
    } catch (e) {
        console.error(e.toString())
    }
    return result
}

exports.readFile = function (file_path,option=null){
    let read_status = null
    try{
        if(fs.existsSync(file_path)){
            read_status = fs.readFileSync(file_path,option).toString()
        }else{
            console.error(`${file_path} not exist !!`)
        }
    }
    catch (e) {
        console.error(e.toString())
    }
    return read_status
}

exports.sleep = function (second){
    console.log((`[Sleep] XX | Program stop ${second}'s | XX` ))
    return new Promise(resolve => setTimeout(() =>resolve(), second*1000));
}