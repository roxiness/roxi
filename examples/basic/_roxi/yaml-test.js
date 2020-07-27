const { parseDocument, createNode } = require('yaml')
const { Pair, Node, Scalar } = require('yaml/types')
const { readFileSync, writeFileSync } = require('fs-extra')

const configPath = './roxi.config.yaml'
const file = readFileSync(configPath, 'utf-8')

const doc = parseDocument(file)

if(!doc.has('plugins')){
  const pair = new Pair(createNode('plugins'), createNode([]))
  pair.commentBefore = `## PLUGINS ###`
  pair.spaceBefore = true
  doc.add(pair)
}


doc.addIn(['plugins'], 'foosa')

writeFileSync(configPath, String(doc))
