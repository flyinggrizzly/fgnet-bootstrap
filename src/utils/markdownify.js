import remark from 'remark'
import remark2react from 'remark-react'

export default function markdownify(string) {
  return remark().use(remark2react).processSync(string).contents
}
