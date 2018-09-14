import * as JSZip from 'jszip'
import { promisify } from 'util'
import * as glob from 'glob'
import * as fs from 'fs'
import { each, silent } from 'extra-promise'

const readFile = promisify(fs.readFile)
const rm = silent(promisify(fs.unlink))
const extension = process.argv[2] || 'zip'

;(async () => {
  await rm('./dist/dist.crx')
  await rm('./dist/dist.xpi')
  await rm('./dist/dist.zip')
  const files = await promisify(glob)('./dist/**/*', { nodir: true })
  const zip = new JSZip()
  await each(files, async (filename: string) => {
    zip.file(filename.replace('./dist/', ''), await readFile(filename))
  })
  zip.generateNodeStream({
    type: 'nodebuffer'
  , streamFiles: true
  }).pipe(fs.createWriteStream(`./dist/dist.${ extension }`))
})()
