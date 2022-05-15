const { exec } = require('child_process')

class ChildProcess {
  /**
   * @param {string} command
   * @returns {Promise<string>} stdout
   */
  async exec(command) {
    return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          reject(err)
        }
        if (stderr) {
          reject(new Error(`[${command}] Error:\n${stderr}`))
        }

        resolve(stdout)
      })
    })
  }
}

const childProcess = new ChildProcess()

module.exports = childProcess
