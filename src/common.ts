import chalk from "chalk"
import fs from "fs"
import FtpDeploy from "ftp-deploy"
import path from "path"
import { DeploymentInfo, FtpConnectionInfo } from "./interface"

/**
 * Deploy given directory to remote server
 *
 * TODO: add success events callback via function parameters
 * TODO: add options for --include --exclude --delete-remote
 *
 */
export function deploy(src: string, ftp: FtpConnectionInfo): Promise<any> {
  const ftpDeploy = new FtpDeploy()

  return ftpDeploy.deploy({
    user: ftp.username,
    password: ftp.password,
    host: ftp.hostname,
    port: ftp.port,
    localRoot: src,
    remoteRoot: ftp.pathname,
    include: ["*", "**/*"],
    exclude: [""],
    deleteRemote: true,
  })
}

/**
 * Validate command line arguments and return DeploymentInfo ready to use
 *
 * @param localInput
 * @param remoteInput
 */
export function validateArgs(localInput: string, remoteInput: string): DeploymentInfo {
  const local = path.resolve(localInput)

  if (!fs.existsSync(local)) {
    throw new TypeError("Input files not found")
  }

  const ftp = parseFtpURL(remoteInput)

  return {
    src: local,
    ftp,
  }
}

/**
 * Parse url ensure it's a ftp with neccessary data
 *
 * @param ftpUrl
 */
function parseFtpURL(ftpUrl: string): FtpConnectionInfo {
  const { protocol, username, password, hostname, port, pathname } = new URL(ftpUrl)

  if (protocol !== "ftp:") {
    throw new TypeError("protocol must be ftp")
  }

  if (!username) {
    throw new TypeError("ftp username must be provided")
  }

  if (!password) {
    throw new TypeError("ftp password must be provide")
  }

  if (!pathname || pathname === "/") {
    throw new TypeError("ftp path cannot be empty")
  }

  return {
    username,
    password,
    hostname,
    port: port || "21",
    pathname,
  }
}

/**
 * Log message with red color
 *
 * @param message
 */
export function error(message: string) {
  console.log(chalk.red(message))
}

/**
 * Log message with green color
 *
 * @param message
 */
export function success(message: string) {
  console.log(chalk.green(message))
}
