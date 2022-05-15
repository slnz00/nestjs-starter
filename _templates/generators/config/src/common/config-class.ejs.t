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
import BaseConfig from 'common/config/base.config'

export default class <%- h.changeCase.pascal(configClass) %> extends BaseConfig {}
