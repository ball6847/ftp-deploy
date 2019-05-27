import fs from "fs"
import { deploy, parseFtpURL, validateArgs } from "./client"

export class ClientMock {
  constructor() {
    console.log("Mock called")
  }
  public access(info: any) {}
  public ensureDir(dir: string) {}
  public clearWorkingDir() {}
  public uploadDir(dir: string) {}
}

jest.mock("basic-ftp", () => {
  return {
    Client: ClientMock,
  }
})

describe("Client - deploy", () => {
  it("should deploy ", () => {
    deploy("local/path", {
      hostname: "server",
      password: "password",
      pathname: "/path",
      port: "21",
      secure: true,
      username: "user",
    })
  })
})

describe("Client - validateArgs", () => {
  it("should throw error if input path is not exist", () => {
    jest.spyOn(fs, "existsSync").mockReturnValueOnce(false)
    const local = "whatever"
    const remote = "whatever"

    expect(() => validateArgs(local, remote)).toThrowError("Input files not found")
  })

  it("should return resolved path and ftp info", () => {
    jest.spyOn(fs, "existsSync").mockReturnValueOnce(true)
    const local = "local/path"
    const remote = "ftps://user:password@server/path"
    const expected = {
      src: process.cwd() + "/local/path",
      ftp: {
        hostname: "server",
        password: "password",
        pathname: "/path",
        port: "21",
        secure: true,
        username: "user",
      },
    }

    expect(validateArgs(local, remote)).toEqual(expected)
  })
})

describe("client - parseFtpURL", () => {
  it("should catch non-ftp protocol", () => {
    const correct1 = "ftps://user:password@server/path"
    const correct2 = "ftp://user:password@server/path"
    const wrong = "https://user:password@server/path"

    expect(() => parseFtpURL(correct1)).not.toThrowError()
    expect(() => parseFtpURL(correct2)).not.toThrowError()
    expect(() => parseFtpURL(wrong)).toThrowError("protocol must be ftp or ftp(s)")
  })

  it("should not allow missing required value", () => {
    const noUser = "ftps://:password@server/path"
    const noPassword = "ftps://user:@server/path"
    const noPath = "ftps://user:password@server"

    expect(() => parseFtpURL(noUser)).toThrowError("ftp username must be provided")
    expect(() => parseFtpURL(noPassword)).toThrowError("ftp password must be provide")
    expect(() => parseFtpURL(noPath)).toThrowError("ftp path cannot be empty")
  })
})
