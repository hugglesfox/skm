var fs = require('fs')
const logger = require('winston-color')
const jsonminify = require("jsonminify")
const config = require("../config")
const execSync = require('child_process').execSync;


const isSupportedLangauge = function (language) {
  return language == null ? false : (config.supported_languages.indexOf(language.toLowerCase()) != -1)
}

const runCommand = function (cmd, callback){
  let error = null;
  try {
    execSync(cmd, {stdio:[0,1,2]})
  }
  catch (ex) {
    error = ex.message
  }
  finally {
    callback(error)
  }

}

const readDotSplashKit = function (path) {
  const data = fs.readFileSync(`${path}/.splashkit`, 'utf8')
  return JSON.parse(JSON.minify(data))
}

const generateDotSplashKitData = function (language) {
  if (language == null) {
    throw Error('Must provide language when generating a .splashkit')
  }
  const data = {
    'version': '-1',
    'date_created': new Date(),
    'message': 'Jake',
    'status': 'initialized',
    'language': language
  }
  return data
}

const writeDotSplashKit = function (path, data) {
  let dataAsString = JSON.stringify(data, null, "  ")
  let contents = `//
// Generated by SplashKit v${config.splashkit_version}
//
// ************************ DO NOT TOUCH ************************
// *** Modifying this file may corrupt your SplashKit project ***
// ************************ DO NOT TOUCH ************************
//

${dataAsString}
`

  // logger.debug("path is: " + path + " data is: " + dataAsString)
  fs.writeFileSync(path + '/.splashkit', contents)
  logger.debug(`Saved to ${path}/.splashkit successfully.`)
}

const isSplashKitDirectory = function (path) {
  const dotSK = `${path}/.splashkit`
  logger.debug(`Checking for .splashkit file at: ${dotSK}`)
  try {
    return fs.statSync(dotSK).isFile()
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false
    } else {
      throw e
    }
  }
}

module.exports = {
  generateDotSplashKitData: generateDotSplashKitData,
  isSupportedLangauge: isSupportedLangauge,
  runCommand: runCommand,
  readDotSplashKit: readDotSplashKit,
  writeDotSplashKit: writeDotSplashKit,
  isSplashKitDirectory: isSplashKitDirectory,
  isMacOS: process.platform === 'darwin',
  isWindows: process.platform === 'win32',
  isLinux: process.platform === 'win32'
}