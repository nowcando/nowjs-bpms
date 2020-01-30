// tslint:disable-next-line:variable-name
export const sampleDecideTema = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd" id="definitions_1786tcz" name="definitions" namespace="http://camunda.org/schema/1.0/dmn" exporter="dmn-js (https://demo.bpmn.io/dmn)" exporterVersion="7.0.0">
  <decision id="decide_team_decision" name="Decide Team">
    <decisionTable id="decisionTable_0dmkkjp" hitPolicy="COLLECT">
      <input id="input1" label="color">
        <inputExpression id="inputExpression1" typeRef="string">
          <text>input.color</text>
        </inputExpression>
      </input>
      <output id="output1" label="team" name="team" typeRef="string" />
      <rule id="DecisionRule_12ctnsj">
        <inputEntry id="UnaryTests_0hwuza2">
          <text>"red"</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_1054bpu">
          <text>"Perspolis"</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_10c339h">
        <inputEntry id="UnaryTests_1cnva5q">
          <text>"blue"</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_18uhzhh">
          <text>"Esteghlal"</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_0y7zjbr">
        <inputEntry id="UnaryTests_1ywhrju">
          <text>"orange"</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_08npm9f">
          <text>"Saipa"</text>
        </outputEntry>
      </rule>
    </decisionTable>
  </decision>
</definitions>`;
