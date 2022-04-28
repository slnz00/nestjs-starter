---
to: src/common/config/<%- h.changeCase.param(configName) %>.config.ts
unless_exists: true
---
<%
const inputs = {
    configName
}

const configClass = h.changeCase.pascal(inputs.configName) + 'Config'
-%>
const { env } = process

export default class <%- h.changeCase.pascal(configClass) %> {}
