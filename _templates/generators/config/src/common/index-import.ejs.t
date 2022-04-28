---
to: src/common/config/index.ts
inject: true
prepend: true
---
<%
const inputs = {
    configName
}

const configClass = h.changeCase.pascal(inputs.configName) + 'Config'
const configImportPath = 'common/config/' + h.changeCase.param(inputs.configName) + '.config'
-%>
import <%- configClass %> from '<%- configImportPath %>'