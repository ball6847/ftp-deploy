export interface IFtpConnectionInfo {
  username: string
  password: string
  hostname: string
  port: string
  pathname: string
  secure: boolean
}

export interface IDeploymentInfo {
  src: string
  ftp: IFtpConnectionInfo
}
