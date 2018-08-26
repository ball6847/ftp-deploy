import commander from "commander"
import { deploy, error, success, validateArgs } from "./common"

commander
  .arguments("<local> <remote>")
  .action((localInput: string, remoteInput: string) => {
    try {
      const { src, ftp } = validateArgs(localInput, remoteInput)

      // start deployment
      deploy(src, ftp)
        .then(() => success("Done."))
        .catch(() => error("Failed"))
    } catch (e) {
      if (e instanceof TypeError) {
        error(e.message)
      }
    }
  })
  .parse(process.argv)
