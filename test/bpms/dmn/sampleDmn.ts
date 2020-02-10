// tslint:disable-next-line:variable-name
export const TeamChoosingRules = `<?xml version="1.0" encoding="UTF-8"?>
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

export const SmsOperatorRules = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd" xmlns:biodi="http://bpmn.io/schema/dmn/biodi/1.0" id="Definitions_1ckbaz1" name="DRD" namespace="http://camunda.org/schema/1.0/dmn" exporter="Camunda Modeler" exporterVersion="3.3.2">
  <decision id="SmsProviderLookup" name="SmsProviderLookup">
    <extensionElements>
      <biodi:bounds x="157" y="81" width="180" height="80" />
    </extensionElements>
    <decisionTable id="decisionTable_1">
      <input id="input_1" label="provider">
        <inputExpression id="inputExpression_1" typeRef="string">
          <text>input.provider</text>
        </inputExpression>
      </input>
      <input id="InputClause_0anlcul" label="template">
        <inputExpression id="LiteralExpression_1nl6wml" typeRef="string">
          <text>input.template</text>
        </inputExpression>
      </input>
      <input id="InputClause_025olyt" label="client">
        <inputExpression id="LiteralExpression_1i9ij65" typeRef="string">
          <text>input.client</text>
        </inputExpression>
      </input>
      <output id="output_1" label="token" name="output.token" typeRef="string" />
      <output id="OutputClause_0ai41q5" label="type" name="output.type" typeRef="string" />
      <output id="OutputClause_0rni4kw" label="method" name="output.method" typeRef="string" />
      <rule id="DecisionRule_1nj7ujv">
        <inputEntry id="UnaryTests_1p2hh55">
          <text>kavenegar</text>
        </inputEntry>
        <inputEntry id="UnaryTests_1u8jlu4">
          <text>"ebaseTFA"</text>
        </inputEntry>
        <inputEntry id="UnaryTests_1s173en">
          <text>"ebase"</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_10sgpjv">
          <text>"6E4D34396B5A4A4C71776445754148722F593866364D5A654E5556392F676B6F"</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_1vb9xah">
          <text>"sms"</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_1m4g7i0">
          <text>"GET"</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_11j1mc6">
        <inputEntry id="UnaryTests_09my4lg">
          <text>mehrnegar</text>
        </inputEntry>
        <inputEntry id="UnaryTests_0hnbjlx">
          <text>"mehrTFA"</text>
        </inputEntry>
        <inputEntry id="UnaryTests_18yzmru">
          <text>"ebase"</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_1ceurl3">
          <text>"6E4D34396B5A4A4C71776445754148722F593866364D5A654E5556392F676B6F"</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_0eaq1t5">
          <text>"sms"</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_04n65op">
          <text>"POST"</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_018gm6h">
        <inputEntry id="UnaryTests_0vg03ww">
          <text>kavenegar</text>
        </inputEntry>
        <inputEntry id="UnaryTests_1qo0y4a">
          <text>"sajedTFA"</text>
        </inputEntry>
        <inputEntry id="UnaryTests_0fk392p">
          <text>"sajed"</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_0ih3enq">
          <text>"6E4D34396B5A4A4C71776445754148722F593866364D5A654E5556392F676B6F"</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_1cmj0c8">
          <text>"sms"</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_0fj4t39">
          <text>"GET"</text>
        </outputEntry>
      </rule>
    </decisionTable>
  </decision>
</definitions>
`;
