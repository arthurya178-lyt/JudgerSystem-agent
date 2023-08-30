const express = require('express')
const os = require('os')
const dotenv = require("dotenv")
const qs = require('qs')
const axios = require('axios')
const shell = require('./useful.js').shell
const app = express()
const path = require("path")
dotenv.config()

const judger = require("./executor")
const { BACKEND_SV, SUPPORT_LANGUAGE} = require("./variable_define");

app.use(express.json())
app.use(express.urlencoded({extended: false}))

let connect_token = null

let agent_idle = true



// DEBUG ONLY USED
const IGNORE_VALIDATION = false
const OFFLINE_MODE = false
// END

// ask backend server for connect
register_to_backend()
// routing ask connection is still alive ?
setInterval(check_connect, process.env.FAILED_RELOAD_TIME * 1000)

const validation_connect = function (req,res,next){
    if(IGNORE_VALIDATION || req.headers.token == connect_token){
        next()
    }
    else{
        res.json({
            status:"failed",
            describe:"System Token not match"
        })
    }
}


// 進行檢測
app.post("/judge",validation_connect, async (req, res) =>
{
    const base64_in = (req.query.base64 || req.query.base64_in )?true : false
    const base64_out = (req.query.base64 || req.query.base64_out )?true : false
    let response = {
        success: false
    }
    try{
        if(!req.body.lang) throw "require lang parameter"
        if(!req.body.input) throw "require input parameter"
        if(!req.body.answer) throw "require answer parameter"
        if(!req.body.student) throw "require student parameter"
        if(!Array.isArray(req.body.input)) throw "input parameter require Array type"
        if(!Array.isArray(req.body.answer)) throw "answer parameter require Array type"
        if(!Array.isArray(req.body.student)) throw "student parameter require Array type"
        response.info = await judger.judge(req.body.lang,req.body.input,req.body.answer,req.body.student, base64_in,base64_out)
        response.success = true
    }
    catch(e){
        console.error(e.toString())
        response.describe = e.toString()
    }
    res.json(response)
})

app.post("/execute",validation_connect, async (req, res) =>
{
    let response = {
        success: false
    }
    try{
        const base64_in = ((req.query.base64 === "true") || ( req.query.base64_in === "true") )?true : false
        const base64_out = ((req.query.base64 === "true") || ( req.query.base64_out === "true") )?true : false
        const input_text = req.query.input_text === "true"

        if(!req.body.lang) throw "require lang parameter"
        if(!req.body.source) throw "require source parameter"
        if(!Array.isArray(req.body.source)) throw "source parameter require Array type"
        response.info = await judger.singleJudge(req.body.lang,req.body.source,req.body.input,input_text, base64_in,base64_out)
        response.success = true
    }
    catch(e){
        console.error(e.toString())
        response.describe = e.toString()
    }
    res.json(response)
})


//
app.post("/connection",validation_connect, async (req, res) =>
{
    let response = {
        status: (agent_idle) ? "idle" : "busy"
    }
    res.json(response)
})

// 重新設定連線
app.post("/reset", async (req, res) =>
{
    let response = {
        status: "reject"
    }
    if (req.body.code === process.env.ACTIVATE_KEY)
    {
        connect_token = null
        register_to_backend()
        response.status = "accept"
    }
    res.json(response)
})

app.post("/support",async (req,res)=>{
    const support_list = []
    for(let i = 1 ; i < SUPPORT_LANGUAGE.length;i++){
        support_list.push({
            id:i,
            identify_name:SUPPORT_LANGUAGE[i].language_name,
            language:SUPPORT_LANGUAGE[i].language_type,
            allow_used:SUPPORT_LANGUAGE[i].activate
        })
    }
    res.json({data:support_list})
})

app.post("/test", async (req, res) =>
{
    let response = {
        status: "done"
    }


    res.json(response)
})



// 註冊 agent 資料
async function register_to_backend()
{
    while (!connect_token && !OFFLINE_MODE )
    {
        const option = {
            method: 'post',
            url: `${BACKEND_SV}/activate`,
            data: qs.stringify({
                active_code: process.env.ACTIVATE_KEY
            }),
            timeout:5000,
        }
        await axios(option).then(async (response) =>
        {
            console.log(response.data)
            if (response.data.success)
            {
                connect_token = response.data.token
            } else
            {
                console.log("fetch backend server failed")
            }
        }).catch(error =>
        {
            console.log("fetch backend server overtime")
        })
        await sleep(5000)
    }
}
// 檢查連線可用性
async function check_connect()
{
    const option = {
        method: 'post',
        url: `${BACKEND_SV}/verify`,
        data: qs.stringify({
            token: connect_token
        }),
        timeout:5000,
    }
    await axios(option).then(async (response) =>
    {
        if (!response.data.verify)
        {
            console.log("Agent is disconnected !!")
            connect_token = null
        } else
        {
            console.log("connection is still alive!!")
        }
    }).catch(error =>
    {
        console.log(error.toString())
        console.log("Agent is disconnected !!")
        connect_token = null
    })
    if (!connect_token && !OFFLINE_MODE)
    {
        await register_to_backend()
    }
}



function sleep(ms)
{
    return new Promise((resolve) =>
    {
        setTimeout(resolve, ms);
    });
}


app.listen(process.env.AGENT_PORT, () =>
{
    const ipDetails = os.networkInterfaces()
    const ipKey = Object.keys(ipDetails)
    ipKey.map(mapKey =>
    {
        ipDetails[mapKey].map(mapEthCard =>
        {
            if (mapEthCard.family === "IPv4")
            {
                console.warn(`start at [ ${mapKey} IP:${mapEthCard.cidr} ]`)
            }
        })
    })
    console.log(`agent server start at PORT:${process.env.AGENT_PORT} successfully `)
    if(IGNORE_VALIDATION) console.log(`[warning] Agent API Validation Function is OFF`)
    if(OFFLINE_MODE) console.log(`[warning] Agent API now is in OFFLINE mode`)
})