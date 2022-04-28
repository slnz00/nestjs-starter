---
to: src/common/config/index.ts
inject: true
after: "export default class Config {"
---
<%
const inputs = {
    configName
}

const configClass = h.changeCase.pascal(inputs.configName) + 'Config'
const configField = h.changeCase.camel(inputs.configName)
-%>
  @ValidateNested()
  @Type(() => <%- configClass %>)
  readonly <%- configField %> = new <%- configClass %>()
