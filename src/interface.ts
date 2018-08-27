export interface FtpConnectionInfo {
  username: string
  password: string
  hostname: string
  port: string
  pathname: string
  secure: boolean
}

export interface DeploymentInfo {
  src: string
  ftp: FtpConnectionInfo
}
