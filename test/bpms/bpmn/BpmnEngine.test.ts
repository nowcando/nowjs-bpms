/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { EventEmitter } from 'events';
import 'jest';
import { BpmnEngine, BpmnProcessActivity, BpmnProcessOptions, BpmsEngine } from '../../../src';
import { sampleDecideTema } from '../dmn/sampleDmn';
import { source1, source2, source3, source4 } from '../../resources/projects/BpmnSampleSources';

beforeAll(() => {});
beforeEach(() => {});
afterEach(() => {});
afterAll(() => {});

describe('BpmnEngine', () => {
    describe('new', () => {
        it('should be instantiated BpmnEngine', () => {
            const actual = new BpmnEngine({ name: 'MyEngine' });
            expect(actual).toBeDefined();
            expect(actual.Name).toBeDefined();
            expect(actual.Id).toBeDefined();
            expect(actual.createProcess).toBeDefined();
            expect(actual.createDefinitions).toBeDefined();
            expect(actual.persistProcess).toBeDefined();
            expect(actual.recoverProcesses).toBeDefined();
            expect(actual.stopProcesses).toBeDefined();
            expect(actual.listLoadedProcess).toBeDefined();
            expect(actual.clearDefinitions).toBeDefined();
            expect(actual.listDefinitions).toBeDefined();
            expect(actual.loadDefinitions).toBeDefined();
            expect(actual.findDefinition).toBeDefined();
            expect(actual.countDefinitions).toBeDefined();
            expect(actual.removeDefinition).toBeDefined();
            expect(actual.createDefinitions).toBeDefined();
        });
    });
    describe('new', () => {
        it('should be instantiated by createEngine static method', () => {
            const actual = new BpmnEngine({ name: 'MyEngine' });
            expect(actual).toBeDefined();
            expect(actual.Name).toBeDefined();
            expect(actual.Id).toBeDefined();
            expect(actual.createProcess).toBeDefined();
            expect(actual.createDefinitions).toBeDefined();
            expect(actual.persistProcess).toBeDefined();
            expect(actual.recoverProcesses).toBeDefined();
            expect(actual.stopProcesses).toBeDefined();
            expect(actual.listLoadedProcess).toBeDefined();
            expect(actual.clearDefinitions).toBeDefined();
            expect(actual.listDefinitions).toBeDefined();
            expect(actual.loadDefinitions).toBeDefined();
            expect(actual.findDefinition).toBeDefined();
            expect(actual.countDefinitions).toBeDefined();
            expect(actual.removeDefinition).toBeDefined();
            expect(actual.createDefinitions).toBeDefined();
        });
    });
    describe('createEngine', () => {
        it('should be instantiated by createEngine static method', () => {
            const actual = BpmnEngine.createEngine({ name: 'MyEngine1' });
            expect(actual).toBeDefined();
            expect(actual.Name).toBeDefined();
            expect(actual.Id).toBeDefined();
            expect(actual.createProcess).toBeDefined();
            expect(actual.createDefinitions).toBeDefined();
        });
        it('should be instantiated by createEngine static method without options', () => {
            const actual = BpmnEngine.createEngine();
            expect(actual).toBeDefined();
        });
        // it("should be throw error while createEngine", () => {
        //   const actual = BpmsEngine.createEngine({ name: "MyEngine1" });
        //   expect(actual).toBeDefined();
        //   expect(BpmsEngine.createEngine({ name: "MyEngine1" })).toThrowError();
        // });
    });
    describe('Bpmn Definition', () => {
        describe('createDefinitions', () => {
            it('should be createDefinitions method return true', async () => {
                const bpe = BpmnEngine.createEngine({ name: 'MyEngine1' });
                expect(bpe).toBeDefined();
                const actual1 = await bpe.createDefinitions('sample1', source1);
                const actual2 = await bpe.createDefinitions('sample2', source2);
                expect(actual1).toEqual(true);
                expect(actual2).toEqual(true);
            });
            it('should be check definition methods', async () => {
                const bpe = BpmnEngine.createEngine({ name: 'MyEngine1' });
                expect(bpe).toBeDefined();
                expect(bpe.clearDefinitions).toBeDefined();
                expect(bpe.listDefinitions).toBeDefined();
                expect(bpe.loadDefinitions).toBeDefined();
                expect(bpe.findDefinition).toBeDefined();
                expect(bpe.countDefinitions).toBeDefined();
                expect(bpe.removeDefinition).toBeDefined();
                expect(bpe.createDefinitions).toBeDefined();
            });
            it('check process views', async () => {
                const bpms = BpmsEngine.createEngine({ name: 'MyEngine2' });
                const bpmn = bpms.BpmnEngine;
                expect(bpmn).toBeDefined();
                await bpmn.createDefinitions('Team', source4);
                const v = await bpms.UIService.list();
                expect(v).toBeDefined();
                const n = await bpms.NavigationService.list();
                expect(n).toBeDefined();
                const vn = await bpms.NavigationService.listViewNavigations();
                expect(vn).toBeDefined();
            });
        });
    });
    describe('Bpms Process', () => {
        describe('createProcess', () => {
            it('should be instantiated a BpmnProcess by createProcess method', async () => {
                const bpe = BpmnEngine.createEngine({ name: 'MyEngine1' });
                expect(bpe).toBeDefined();
                const actual = await bpe.createProcess();
                expect(actual).toBeDefined();
                expect(actual.Broker).toBeDefined();
                expect(actual.Name).toBeDefined();
                expect(actual.Environment).toBeDefined();
                expect(actual.State).toBeDefined();
                expect(actual.Stopped).toBeDefined();
                expect(actual.Execution).not.toBeDefined();
                expect(actual.State).toEqual('idle');
            });

            it('should be instantiated a BpmnProcess by createProcess method and execute', async () => {
                const bpe = BpmnEngine.createEngine({ name: 'MyEngine1' });
                expect(bpe).toBeDefined();
                const id = Math.floor(Math.random() * 10000);
                const prOpts: BpmnProcessOptions = {
                    name: 'sampleProcess1',
                    source: source1,
                    variables: { id },
                };
                const pr = await bpe.createProcess(prOpts);
                expect(pr).toBeDefined();
                const execution = await pr.execute();
                expect(execution).toBeDefined();
                expect(execution.environment.variables.id).toEqual(id);
            });

            it('should be throw error while createProcess', async () => {
                const bpe = BpmnEngine.createEngine({ name: 'MyEngine1' });
                expect(bpe).toBeDefined();
                const id = Math.floor(Math.random() * 10000);
                const prOpts: BpmnProcessOptions = {
                    name: ['sampleProcess1'] as any,
                    source: source1,
                    variables: { id },
                };
                expect(bpe.createProcess(prOpts)).rejects.toThrow();
            });
        });
        describe('persist', () => {
            it('should be persist all processes', async () => {
                const bpe = BpmnEngine.createEngine({ name: 'MyEngine1' });
                expect(bpe).toBeDefined();
                const pr1 = await bpe.createProcess({
                    name: 'Process1',
                    source: source1,
                });
                expect(pr1).toBeDefined();
                const prState1 = await pr1.getState();
                expect(prState1).toBeDefined();
                const pr2 = await bpe.createProcess({
                    name: 'Process2',
                    source: source2,
                });
                expect(pr2).toBeDefined();
                const prState2 = await pr2.getState();
                expect(prState2).toBeDefined();
                // persist
                const presult1 = await bpe.persistProcess();
                expect(presult1).toBeDefined();
                expect(presult1).toBeTruthy();
                const pCount = await bpe.persistedProcessCount();
                expect(pCount).toBeDefined();
                expect(pCount).toEqual(2);
            });
        });
        describe('recover', () => {
            it('should be recover all persisted processes', async () => {
                const bpe = BpmnEngine.createEngine({ name: 'MyEngine1' });
                expect(bpe).toBeDefined();
                const pr1 = await bpe.createProcess({
                    name: 'Process1',
                    source: source1,
                });
                expect(pr1).toBeDefined();
                const prState1 = await pr1.getState();
                expect(prState1).toBeDefined();
                const pr2 = await bpe.createProcess({
                    name: 'Process2',
                    source: source2,
                });
                expect(pr2).toBeDefined();
                const prState2 = await pr2.getState();
                expect(prState2).toBeDefined();
                // process 3
                const pr3 = await bpe.createProcess({
                    name: 'Process3',
                    source: source3,
                });
                expect(pr3).toBeDefined();
                const prState3 = await pr3.getState();
                expect(prState3).toBeDefined();
                const lc1 = await bpe.loadedProcessCount();
                expect(lc1).toEqual(3);
                // stop
                await bpe.stopProcesses(true);
                const l = await bpe.listLoadedProcess();
                expect(l.length).toBe(0);
                const c = await bpe.persistedProcessCount();
                expect(c).toBe(3);
                // recover persisted
                const r = await bpe.recoverProcesses({ resume: false });
                expect(r).toBe(true);
                const al1 = await bpe.listLoadedProcess();
                const ap1 = al1[0];
                expect(pr1).toBeDefined();
                expect(pr1.Id).toEqual(ap1.Id);
                expect(pr1.Name).toEqual(ap1.Name);
                const ap2 = al1[1];
                expect(pr2.Id).toEqual(ap2.Id);
                const aps1 = ap1.State;
                expect(aps1).toEqual(pr1.State);
                const l1 = new EventEmitter();
                ap2.once('wait', task => {
                    task.signal({
                        ioSpecification: {
                            dataOutputs: [
                                {
                                    id: 'userInput',
                                    value: 'Saeed Tabrizi',
                                },
                            ],
                        },
                    });
                });
                // resume process 2
                const n2 = await ap2.resume();
                const s2 = await ap2.Environment.output;
                expect(n2).toBeDefined();
                expect(s2).toBeDefined();
                // resume process 3
                const ap3 = al1[2];
                expect(pr3.Id).toEqual(ap3.Id);
                ap3.once('wait', (task: BpmnProcessActivity) => {
                    ap3.Logger.warn(`${task.type} : ${task.name}`);
                });
                const n3 = await ap3.resume();
                const s3 = await ap3.Environment.output;
                expect(n3).toBeDefined();
                expect(s3).toBeDefined();
                // await ap2.stop();
            });
        });
        describe('find', () => {
            it('should be find a persisted process', async () => {
                const bpe = BpmnEngine.createEngine({ name: 'MyEngine1' });
                expect(bpe).toBeDefined();
                for (let i = 0; i < 15; i++) {
                    await bpe.createProcess({
                        name: 'Process' + i,
                        source: source1,
                    });
                }
                // persist
                const presult1 = await bpe.persistProcess();
                expect(presult1).toBeDefined();
                expect(presult1).toBeTruthy();
                const pCount = await bpe.persistedProcessCount();
                expect(pCount).toBeDefined();
                expect(pCount).toEqual(15);

                const f1 = await bpe.findProcess({ name: 'Process5' });
                expect(f1).toBeDefined();
                const f2 = await bpe.findProcess({ name: 'Process25' });
                expect(f2).not.toBeDefined();
            });
        });
        describe('list', () => {
            it('should be find a persisted process', async () => {
                const bpe = BpmnEngine.createEngine({ name: 'MyEngine1' });
                expect(bpe).toBeDefined();
                for (let i = 0; i < 15; i++) {
                    await bpe.createProcess({
                        name: 'Process' + i,
                        source: source1,
                    });
                }
                // persist
                const presult1 = await bpe.persistProcess();
                expect(presult1).toBeDefined();
                expect(presult1).toBeTruthy();
                const pCount = await bpe.persistedProcessCount();
                expect(pCount).toBeDefined();
                expect(pCount).toEqual(15);

                const f1 = await bpe.listProcess({ name: 'Process5' });
                expect(f1).toBeDefined();
            });
        });
        describe('service', () => {
            it('should be use evaluateDecision service', async () => {
                const bpms = BpmsEngine.Default;
                const bpe = bpms.BpmnEngine;
                const dmn = bpms.DmnEngine;
                await dmn.create({ name: 'Decide Team', definitions: sampleDecideTema });
                const pr1 = await bpe.createProcess({ name: 'proc1', source: source4 });
                pr1.on('activity.enter', (elementApi, engineApi) => {
                    // console.log(
                    //   `${elementApi.type} <${elementApi.id}> of ${engineApi.name} is entered`,
                    // );
                });
                pr1.on('activity.end', async (elementApi: BpmnProcessActivity, instance) => {
                    // console.log(
                    //   `${elementApi.type} <${elementApi.id}> of ${instance.name} is ended`,
                    // );
                });
                pr1.on('activity.wait', async (elementApi: BpmnProcessActivity, instance) => {
                    // console.log(
                    //   `${elementApi.type} <${elementApi.id}> of ${instance.name} is waiting for input`,
                    // );
                    const svc = elementApi.environment.services;
                    if (elementApi.id === 'Decide_Team') {
                        const r = await svc.evaluateDecision('Decide Team', 'decide_team_decision', {
                            input: { color: 'red' },
                        });
                        elementApi.signal({ chosenTeam: r });
                    }
                });
                // pr1.once("", (decisitionTask) => {});
                const pe1 = await pr1.execute();
                // bpms.DmnEngine.registerDefinitions("")
                expect(bpe).toBeDefined();
            });
        });
        describe('listeners', () => {
            it('start', async () => {
                const bpms = BpmsEngine.createEngine({ name: 'MyEngine1' });
                const bpe = bpms.BpmnEngine;
                expect(bpe).toBeDefined();
                await bpms.DmnEngine.create({ name: 'Decide Team Rules', definitions: sampleDecideTema });
                const pr1 = await bpe.createProcess({
                    name: 'Process1',
                    source: source4,
                });
                expect(pr1).toBeDefined();
                pr1.on('wait', (activity: BpmnProcessActivity, instance) => {
                    activity.environment.variables.color = 'red';
                    activity.signal({ color: 'red' });
                });
                // const d = await pr1.getDefinitions();
                const r = await pr1.execute();
                expect(r).toBeDefined();
            });
        });
    });
});
