const express = require('express')
const os = require('os')
const qs = require('qs')
const axios = require('axios')
const shell = require('./useful.js').shell
const app = express()
const path = require("path")

const judger = require("./executor")
const {RELOAD_TIME, ACTIVE_CODE, BACKEND_SV, AGENT_PORT} = require("./ENV.args");

app.use(express.json())
app.use(express.urlencoded({extended: false}))

let connect_token = null

let agent_idle = true

const IGNORE_VALIDATION = true
const OFFLINE_MODE = true


// ask backend server for connect
register_to_backend()
// routing ask connection is still alive ?
setInterval(check_connect, RELOAD_TIME * 1000)

const validation_connect = function (req,res,next){
    if(IGNORE_VALIDATION || vareq.headers.token == connect_token){
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
    agent_idle = false
    const base64_in = (req.query.base64 || req.query.base64_in )?true : false
    const base64_out = (req.query.base64 || req.query.base64_out )?true : false
    let htmlResponse = {
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
        htmlResponse.info = await judger.judge(req.body.lang,req.body.input,req.body.answer,req.body.student, base64_in,base64_out)
        htmlResponse.success = true
    }
    catch(e){
        console.error(e.toString())
        htmlResponse.describe = e.toString()
    }
    agent_idle = true
    res.json(htmlResponse)
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
    if (req.body.code === ACTIVE_CODE)
    {
        connect_token = null
        register_to_backend()
        response.status = "accept"
    }
    res.json(response)
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
                active_code: ACTIVE_CODE
            })
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
        })
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


app.listen(AGENT_PORT, () =>
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
    console.log(`agent server start at PORT:${AGENT_PORT} successfully `)
})