import commander from "commander"
import { deploy, validateArgs } from "./lib/client"
import { error } from "./lib/common"

commander
  .arguments("<local> <remote>")
  .action((localInput: string, remoteInput: string) => {
    try {
      const { src, ftp } = validateArgs(localInput, remoteInput)

      // start deployment
      deploy(src, ftp)
    } catch (e) {
      if (e instanceof TypeError) {
        error(e.message)
      }
      process.exit(255)
    }
  })
  .parse(process.argv)
