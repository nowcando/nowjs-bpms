export const source1 = `
<?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <process id="theProcess2" isExecutable="true">
    <startEvent id="theStart" />
    <exclusiveGateway id="decision" default="flow2" />
    <endEvent id="end1" />
    <endEvent id="end2" />
    <sequenceFlow id="flow1" sourceRef="theStart" targetRef="decision" />
    <sequenceFlow id="flow2" sourceRef="decision" targetRef="end1" />
    <sequenceFlow id="flow3" sourceRef="decision" targetRef="end2">
      <conditionExpression>true</conditionExpression>
    </sequenceFlow>
  </process>
</definitions>`;

export const source2 = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <process id="theProcess" isExecutable="true">
    <dataObjectReference id="inputFromUserRef" dataObjectRef="inputFromUser" />
    <dataObject id="inputFromUser" />
    <startEvent id="theStart" />
    <userTask id="userTask">
      <ioSpecification id="inputSpec">
        <dataOutput id="userInput" name="sirname" />
      </ioSpecification>
      <dataOutputAssociation id="associatedWith" sourceRef="userInput" targetRef="inputFromUserRef" />
    </userTask>
    <endEvent id="theEnd" />
    <sequenceFlow id="flow1" sourceRef="theStart" targetRef="userTask" />
    <sequenceFlow id="flow2" sourceRef="userTask" targetRef="theEnd" />
  </process>
</definitions>`;
export  const source3 = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:nowjs="http://schema.nowcando.com/schema/bpmn/nowjs" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="4.0.0">
  <collaboration id="Collaboration_1sq9x60">
    <participant id="Participant_0460sze" name="ثبت کالا" processRef="Process_1" />
  </collaboration>
  <process id="Process_1" isExecutable="true">
    <laneSet id="LaneSet_0t4cm8w">
      <lane id="Lane_1eqasc7" name="کاربر">
        <flowNodeRef>StartEvent_1y45yut</flowNodeRef>
        <flowNodeRef>Task_1hcentk</flowNodeRef>
      </lane>
      <lane id="Lane_02dxm5t" name="مدیر" />
      <lane id="Lane_0ur75a6" name="سیستم">
        <flowNodeRef>Task_0mwibxl</flowNodeRef>
        <flowNodeRef>EndEvent_0dswgvl</flowNodeRef>
      </lane>
    </laneSet>
    <sequenceFlow id="SequenceFlow_0h21x7r" sourceRef="StartEvent_1y45yut" targetRef="Task_1hcentk" />
    <startEvent id="StartEvent_1y45yut" name="شروع">
      <outgoing>SequenceFlow_0h21x7r</outgoing>
    </startEvent>
    <userTask id="Task_1hcentk" name="فرم انتخاب">
      <extensionElements>
        <nowjs:dynamicUI updatedAt="2019-08-30T14:36:53.322Z">
          <nowjs:script language="typescript" updatedAt="2019-08-30T14:36:53.322Z">module.exports = {
        "activeViews":"main",
        "dataSources":{},
        "views":{
            "main":{
                elements:[
                    {type:"singleText",title:"Firstname"},
                    {type:"singleText",title:"Lastname"},

                    ]
            },
        }
    }</nowjs:script>
        </nowjs:dynamicUI>
      </extensionElements>
      <incoming>SequenceFlow_0h21x7r</incoming>
      <outgoing>SequenceFlow_09u0si2</outgoing>
    </userTask>
    <sequenceFlow id="SequenceFlow_09u0si2" sourceRef="Task_1hcentk" targetRef="Task_0mwibxl" />
    <sequenceFlow id="SequenceFlow_1z0p9j1" sourceRef="Task_0mwibxl" targetRef="EndEvent_0dswgvl" />
    <task id="Task_0mwibxl" name="ثبت در پایگاه داده">
      <incoming>SequenceFlow_09u0si2</incoming>
      <outgoing>SequenceFlow_1z0p9j1</outgoing>
    </task>
    <endEvent id="EndEvent_0dswgvl" name="پایان">
      <incoming>SequenceFlow_1z0p9j1</incoming>
    </endEvent>
  </process>
  <bpmndi:BPMNDiagram id="BpmnDiagram_1">
    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Collaboration_1sq9x60">
      <bpmndi:BPMNShape id="Participant_0460sze_di" bpmnElement="Participant_0460sze" isHorizontal="true">
        <omgdc:Bounds x="72" y="-5" width="768" height="305" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut">
        <omgdc:Bounds x="152" y="32" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="156" y="8" width="27" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1hcentk_di" bpmnElement="Task_1hcentk">
        <omgdc:Bounds x="300" y="10" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0h21x7r_di" bpmnElement="SequenceFlow_0h21x7r">
        <omgdi:waypoint x="188" y="50" />
        <omgdi:waypoint x="300" y="50" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Lane_1eqasc7_di" bpmnElement="Lane_1eqasc7" isHorizontal="true">
        <omgdc:Bounds x="102" y="-5" width="738" height="106" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_02dxm5t_di" bpmnElement="Lane_02dxm5t" isHorizontal="true">
        <omgdc:Bounds x="102" y="101" width="738" height="79" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_0ur75a6_di" bpmnElement="Lane_0ur75a6" isHorizontal="true">
        <omgdc:Bounds x="102" y="180" width="738" height="120" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_0mwibxl_di" bpmnElement="Task_0mwibxl">
        <omgdc:Bounds x="480" y="210" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_09u0si2_di" bpmnElement="SequenceFlow_09u0si2">
        <omgdi:waypoint x="400" y="50" />
        <omgdi:waypoint x="530" y="50" />
        <omgdi:waypoint x="530" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_0dswgvl_di" bpmnElement="EndEvent_0dswgvl">
        <omgdc:Bounds x="632" y="232" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="640" y="275" width="21" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1z0p9j1_di" bpmnElement="SequenceFlow_1z0p9j1">
        <omgdi:waypoint x="580" y="250" />
        <omgdi:waypoint x="632" y="250" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;
export const source4 = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
 xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
   xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
   xmlns:nowjs="http://schema.nowcando.com/schema/1.0/bpmn"
   xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0"
   id="Definitions_1rqyz86"
    targetNamespace="http://bpmn.io/schema/bpmn"
     exporter="Camunda Modeler" exporterVersion="3.3.2">
  <bpmn:process id="Process_103i680" name="Team Choosing Process" isExecutable="true" nowjs:candidateStarterGroups="Admins,Publishers" nowjs:candidateStarterUsers="Saeed,Hamid" nowjs:versionTag="1">
    <bpmn:extensionElements>
    <nowjs:dynamicView name="default" title="List" author="saeed" updatedAt="2019-08-30T14:36:53.322Z">
          <nowjs:script scriptFormat="javascript" updatedAt="2019-08-30T14:36:53.322Z">module.exports = {
        "activeViews":"main",
        "dataSources":{},
        "views":{
            "main":{
                elements:[
                    {type:"card",
                      elements:[
                        {type:"singleText",title:"Firstname"},
                        {type:"singleText",title:"Lastname"},
                        {type:"singleText",title:"Age"},
                               ]}
                    ]
            },
        }
    }</nowjs:script>
        </nowjs:dynamicView>
      <nowjs:executionListener event="start">
        <nowjs:script scriptFormat="javascript">function(t,i){
  console.log("Hello Start Execution Process");
}</nowjs:script>
      </nowjs:executionListener>
      <nowjs:executionListener event="end">
        <nowjs:script scriptFormat="javascript">function(t,i){
  console.log("Hello End Execution Process");
}</nowjs:script>
      </nowjs:executionListener>
    </bpmn:extensionElements>
    <bpmn:startEvent id="StartEvent_1tujz7n" name="start" nowjs:formKey="StartForm" nowjs:initiator="startedBy">
      <bpmn:extensionElements>
      <nowjs:dynamicView updatedAt="2019-08-30T14:36:53.322Z">
          <nowjs:script scriptFormat="javascript" updatedAt="2019-08-30T14:36:53.322Z">module.exports = {
        "activeViews":"main",
        "dataSources":{},
        "views":{
            "main":{
                elements:[
                    {type:"singleText",title:"Firstname"},
                    {type:"singleText",title:"Lastname"},

                    ]
            },
        }
    }</nowjs:script>
        </nowjs:dynamicView>
        <nowjs:formData businessKey="TeamChoose">
          <nowjs:formField id="teacherName" label="teacherName" type="string" />
          <nowjs:formField id="lesson" label="lesson" type="string" />
        </nowjs:formData>
      </bpmn:extensionElements>
      <bpmn:outgoing>SequenceFlow_1je870d</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1je870d" sourceRef="StartEvent_1tujz7n" targetRef="Decide_Team" />
    <bpmn:businessRuleTask id="Decide_Team" name="Decide Team" nowjs:dmnRef="Decide Team Rules" nowjs:decisionRef="decide_team_decision" nowjs:decisionRefTenantId="\${tenantId}">
      <bpmn:incoming>SequenceFlow_1je870d</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_10my2rq</bpmn:outgoing>
    </bpmn:businessRuleTask>
    <bpmn:exclusiveGateway id="ExclusiveGateway_1sfirou" name="Choose Favor Team">
      <bpmn:incoming>SequenceFlow_10my2rq</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1vuzw1z</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_0hwz78d</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_02ejtlc</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_0suvv57</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="SequenceFlow_10my2rq" sourceRef="Decide_Team" targetRef="ExclusiveGateway_1sfirou" />
    <bpmn:sequenceFlow id="SequenceFlow_1vuzw1z" name="Perspolis" sourceRef="ExclusiveGateway_1sfirou" targetRef="Task_09font7" />
    <bpmn:endEvent id="EndEvent_07xm5ed">
      <bpmn:incoming>SequenceFlow_1d4cawv</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1d4cawv" sourceRef="Task_09font7" targetRef="EndEvent_07xm5ed" />
    <bpmn:sequenceFlow id="SequenceFlow_0hwz78d" name="Esteghlal" sourceRef="ExclusiveGateway_1sfirou" targetRef="Task_0fv14lc" />
    <bpmn:endEvent id="EndEvent_0r8ybte">
      <bpmn:incoming>SequenceFlow_1e0voyf</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1e0voyf" sourceRef="Task_0fv14lc" targetRef="EndEvent_0r8ybte" />
    <bpmn:sequenceFlow id="SequenceFlow_02ejtlc" name="Saipa" sourceRef="ExclusiveGateway_1sfirou" targetRef="Task_03ssesp" />
    <bpmn:endEvent id="EndEvent_1s4ehf9">
      <bpmn:incoming>SequenceFlow_0ksp1pp</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_0ksp1pp" sourceRef="Task_03ssesp" targetRef="EndEvent_1s4ehf9" />
    <bpmn:sequenceFlow id="SequenceFlow_0suvv57" sourceRef="ExclusiveGateway_1sfirou" targetRef="Task_12dw5b1" />
    <bpmn:endEvent id="EndEvent_1ocbbdx">
      <bpmn:incoming>SequenceFlow_0iyhdmw</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_0iyhdmw" sourceRef="Task_12dw5b1" targetRef="EndEvent_1ocbbdx" />
    <bpmn:userTask id="Task_09font7" name="Register to Perspolis club" nowjs:formKey="PerspolisForm" nowjs:assignee="\${startedBy}" nowjs:candidateUsers="Saeed,Majid,Hamid" nowjs:candidateGroups="Admins,Reviewers" nowjs:priority="2">
      <bpmn:extensionElements>
        <nowjs:taskListener event="create">
          <nowjs:script scriptFormat="javascript">function(t,i){
  console.log("Hello Create Task");
}
</nowjs:script>
        </nowjs:taskListener>
        <nowjs:taskListener event="complete">
          <nowjs:script scriptFormat="javascript">function(t,i){
  console.log("Hello Complete Task");
}</nowjs:script>
        </nowjs:taskListener>
        <nowjs:executionListener event="start">
          <nowjs:script scriptFormat="javascript">function(t,i){
  console.log("Hello Start Exeution Task");
}</nowjs:script>
        </nowjs:executionListener>
        <nowjs:executionListener event="end">
          <nowjs:script scriptFormat="javascript">function(t,i){
  console.log("Hello End Execution Task");
}</nowjs:script>
        </nowjs:executionListener>
        <nowjs:taskListener event="assignment">
          <nowjs:script scriptFormat="javascript">function(t,i){
  console.log("Hello Assignment Task");
}</nowjs:script>
        </nowjs:taskListener>
        <nowjs:taskListener event="delete">
          <nowjs:script scriptFormat="javascript">function(t,i){
  console.log("Hello Delete Task");
}</nowjs:script>
        </nowjs:taskListener>
        <nowjs:formData>
          <nowjs:formField id="firstname" label="firstname" type="string" />
          <nowjs:formField id="lastname" label="lastname" type="string" />
          <nowjs:formField id="age" label="age" type="long" />
        </nowjs:formData>
      </bpmn:extensionElements>
      <bpmn:incoming>SequenceFlow_1vuzw1z</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1d4cawv</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:manualTask id="Task_0fv14lc" name="Register to Esteghlal club">
      <bpmn:incoming>SequenceFlow_0hwz78d</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1e0voyf</bpmn:outgoing>
    </bpmn:manualTask>
    <bpmn:userTask id="Task_03ssesp" name="Register to Saipa club" nowjs:assignee="\${startedBy}">
      <bpmn:incoming>SequenceFlow_02ejtlc</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0ksp1pp</bpmn:outgoing>
      <bpmn:humanPerformer>
        <bpmn:resourceAssignmentExpression>
          <bpmn:formalExpression>\${environment.services.getUser()}</bpmn:formalExpression>
        </bpmn:resourceAssignmentExpression>
      </bpmn:humanPerformer>
      <bpmn:potentialOwner>
        <bpmn:resourceAssignmentExpression>
          <bpmn:formalExpression>user(majid), group(users)</bpmn:formalExpression>
        </bpmn:resourceAssignmentExpression>
      </bpmn:potentialOwner>
    </bpmn:userTask>
    <bpmn:userTask id="Task_12dw5b1" name="No needed  to Register">
      <bpmn:incoming>SequenceFlow_0suvv57</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0iyhdmw</bpmn:outgoing>
    </bpmn:userTask>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_103i680">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1tujz7n">
        <dc:Bounds x="156" y="81" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="163" y="124" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1je870d_di" bpmnElement="SequenceFlow_1je870d">
        <di:waypoint x="192" y="99" />
        <di:waypoint x="250" y="99" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="BusinessRuleTask_0kmm10r_di" bpmnElement="Decide_Team" bioc:stroke="rgb(142, 36, 170)" bioc:fill="rgb(225, 190, 231)">
        <dc:Bounds x="250" y="59" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ExclusiveGateway_1sfirou_di" bpmnElement="ExclusiveGateway_1sfirou" isMarkerVisible="true">
        <dc:Bounds x="415" y="74" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="405" y="44" width="70" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_10my2rq_di" bpmnElement="SequenceFlow_10my2rq">
        <di:waypoint x="350" y="99" />
        <di:waypoint x="415" y="99" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1vuzw1z_di" bpmnElement="SequenceFlow_1vuzw1z">
        <di:waypoint x="465" y="99" />
        <di:waypoint x="530" y="99" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="475" y="81" width="46" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_07xm5ed_di" bpmnElement="EndEvent_07xm5ed" bioc:stroke="rgb(229, 57, 53)" bioc:fill="rgb(255, 205, 210)">
        <dc:Bounds x="702" y="81" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1d4cawv_di" bpmnElement="SequenceFlow_1d4cawv">
        <di:waypoint x="630" y="99" />
        <di:waypoint x="702" y="99" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0hwz78d_di" bpmnElement="SequenceFlow_0hwz78d">
        <di:waypoint x="440" y="124" />
        <di:waypoint x="440" y="210" />
        <di:waypoint x="530" y="210" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="457" y="183" width="45" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_0r8ybte_di" bpmnElement="EndEvent_0r8ybte" bioc:stroke="rgb(30, 136, 229)" bioc:fill="rgb(187, 222, 251)">
        <dc:Bounds x="702" y="192" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1e0voyf_di" bpmnElement="SequenceFlow_1e0voyf">
        <di:waypoint x="630" y="210" />
        <di:waypoint x="702" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_02ejtlc_di" bpmnElement="SequenceFlow_02ejtlc">
        <di:waypoint x="440" y="124" />
        <di:waypoint x="440" y="320" />
        <di:waypoint x="530" y="320" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="465" y="303" width="30" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_1s4ehf9_di" bpmnElement="EndEvent_1s4ehf9" bioc:stroke="rgb(251, 140, 0)" bioc:fill="rgb(255, 224, 178)">
        <dc:Bounds x="702" y="302" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0ksp1pp_di" bpmnElement="SequenceFlow_0ksp1pp">
        <di:waypoint x="630" y="320" />
        <di:waypoint x="702" y="320" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0suvv57_di" bpmnElement="SequenceFlow_0suvv57">
        <di:waypoint x="440" y="124" />
        <di:waypoint x="440" y="430" />
        <di:waypoint x="530" y="430" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_1ocbbdx_di" bpmnElement="EndEvent_1ocbbdx">
        <dc:Bounds x="702" y="412" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0iyhdmw_di" bpmnElement="SequenceFlow_0iyhdmw">
        <di:waypoint x="630" y="430" />
        <di:waypoint x="702" y="430" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="UserTask_16lmtbg_di" bpmnElement="Task_09font7" bioc:stroke="rgb(229, 57, 53)" bioc:fill="rgb(255, 205, 210)">
        <dc:Bounds x="530" y="59" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ManualTask_05iuw39_di" bpmnElement="Task_0fv14lc" bioc:stroke="rgb(30, 136, 229)" bioc:fill="rgb(187, 222, 251)">
        <dc:Bounds x="530" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="UserTask_0j69dtq_di" bpmnElement="Task_03ssesp" bioc:stroke="rgb(251, 140, 0)" bioc:fill="rgb(255, 224, 178)">
        <dc:Bounds x="530" y="280" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="UserTask_1gq94ln_di" bpmnElement="Task_12dw5b1">
        <dc:Bounds x="530" y="390" width="100" height="80" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
