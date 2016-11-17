
const dom = require('../../compiler/dom'),
  compile = require('../../compiler'),
  riot = require('./node-riot')


function requireString(src) {
  const Module = module.constructor,
    m = new Module()
  m._compile(src, '')
  return m.exports
}

function importTag(html) {
  const def = `module.exports = function(riot) { ${compile(html)} }`
  requireString(def)(riot)
}

function $(el) {
  el.text = function() {
    return el.firstChild.nodeValue
  }

  el.attr = function(name) {
    return el.getAttribute(name)
  }

  el.html = function() {
    return dom.html(el)
  }

  return el
}

function find(root, name) {
  var ret
  dom.walk(root, function(el) {
    if (ret) return false
    if (el.tagName == name.toUpperCase()) ret = el
  })
  return ret && $(ret)
}

function findAll(root, name) {
  var ret = []
  dom.walk(root, function(el) {
    if (el.tagName == name.toUpperCase()) ret.push($(el))
  })
  return ret
}

module.exports = function(html, data) {
  importTag(html)

  const tag_name = html.trim().split(/[ >]/)[0].slice(1),
    tag = riot.mount(tag_name, null, data)

  tag.find = function(query) {
    return find(tag.root, query)
  }

  tag.findAll = function(query) {
    return findAll(tag.root, query)
  }

  return tag
}
