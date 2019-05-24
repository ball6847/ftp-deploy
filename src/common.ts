import { Client } from "basic-ftp"
import chalk from "chalk"
import fs from "fs"
import path from "path"
import { DeploymentInfo, FtpConnectionInfo } from "./interface"
import retry from 'async-retry'
;
/**
 * Deploy given directory to remote server
 *
 * TODO: add options for -v --verbose
 * TODO: support single file upload
 *
 */
export async function deploy(src: string, ftp: FtpConnectionInfo) {
  const client = new Client()

  // client.ftp.verbose = true

  const upload = async () => {
    // connect
    await client.access({
      host: ftp.hostname,
      user: ftp.username,
      password: ftp.password,
      port: ftp.port,
      secure: ftp.secure,
    })

    // deploy
    await client.ensureDir(ftp.pathname)
    await client.clearWorkingDir()
    await client.uploadDir(src)
    success("Done!")
  }

  await retry(upload, {
    retry: 5,
    onRetry: () => error('Uploading failed!, retrying ...')
  })

  client.close()
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
 * Parse url ensure it's a ftp with necessary data
 *
 * @param ftpUrl
 */
function parseFtpURL(ftpUrl: string): FtpConnectionInfo {
  const { protocol, username, password, hostname, port, pathname } = new URL(ftpUrl)

  if (!/^ftps?\:$/.test(protocol)) {
    throw new TypeError("protocol must be ftp or sftp")
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
    // username can contains backslash on some platform
    // make sure argument is encoded in command line
    username: decodeURIComponent(username),
    password,
    hostname,
    port: port || "21",
    pathname,
    secure: protocol === "ftps:",
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
