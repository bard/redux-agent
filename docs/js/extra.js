
function materialMkdocsInitHighlightJS () {
  var targetSelectors = [
    '.md-typeset code, .md-typeset pre',
    '.md-typeset pre > code'
  ]

  for (var i=0; i<document.styleSheets.length; i++) {
    var sheet = document.styleSheets[i]
    var rules
    try {
      rules = sheet.rules
    } catch(err) {}

    if (!rules) {
      continue
    }

    for (var j=0; j<rules.length; j++) {
      var rule = rules[j]
      if (targetSelectors.indexOf(rule.selectorText) !== -1) {
        rule.style.backgroundColor = ''
        rule.style.color = ''
      }
    }
  }

  hljs.initHighlightingOnLoad()
}

materialMkdocsInitHighlightJS()
