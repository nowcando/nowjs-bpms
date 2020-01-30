/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import 'jest';
import { BpmsEngine } from '../../../src/bpms/BpmsEngine';
import { source1, source2, source3, source4 } from '../../resources/projects/BpmnSampleSources';
beforeAll(() => {});
beforeEach(() => {});
afterEach(() => {});
afterAll(() => {});

describe('Query Service', () => {
    it('checks definitions', () => {
        const actual = BpmsEngine.createEngine({ name: 'MyEngineQueryService1' });
        expect(actual).toBeDefined();
        expect(actual.Name).toBeDefined();
        expect(actual.Id).toBeDefined();
        expect(actual.QueryService).toBeDefined();
        expect(actual.QueryService.getRepositories).toBeDefined();
        expect(actual.QueryService.count).toBeDefined();
        expect(actual.QueryService.scalar).toBeDefined();
        expect(actual.QueryService.query).toBeDefined();
    });
    it('checks getRepositories', async () => {
        const actual = BpmsEngine.createEngine({ name: 'MyEngineQueryService2' });
        expect(actual).toBeDefined();
        expect(actual.QueryService.getRepositories).toBeDefined();
        const actual2 = await actual.QueryService.getRepositories();
        expect(actual2).toBeDefined();
        expect(actual2.bpmnDefinition).toBeDefined();
        expect(actual2.task).toBeDefined();
        expect(actual2.job).toBeDefined();
        expect(actual2.notification).toBeDefined();
        expect(actual2.history).toBeDefined();
    });
    it('checks count', async () => {
        const actual = BpmsEngine.createEngine({ name: 'MyEngineQueryService3' });
        expect(actual).toBeDefined();
        const bpe = actual.BpmnEngine;
        const pr1 = await bpe.createDefinitions('Process1', source1);
        expect(pr1).toBeDefined();
        const pr2 = await bpe.createDefinitions('Process2', source2);
        expect(pr2).toBeDefined();
        // actual.BpmnEngine.registerDefinitions()
        expect(actual.QueryService.count).toBeDefined();
        const actual2 = await actual.QueryService.count('bpmnDefinition');
        expect(actual2).toBeDefined();
        expect(actual2.results.bpmnDefinition).toEqual(2);
    });
    it('checks count', async () => {
        const actual = BpmsEngine.createEngine({ name: 'MyEngineQueryService4' });
        expect(actual).toBeDefined();
        const bpe = actual.BpmnEngine;
        const pr1 = await bpe.createDefinitions('Process1', source1);
        expect(pr1).toBeDefined();
        const pr2 = await bpe.createDefinitions('Process2', source2);
        expect(pr2).toBeDefined();
        const pr3 = await bpe.createDefinitions('Process3', source3);
        expect(pr3).toBeDefined();
        for (let i = 0; i < 5; i++) {
            await bpe.createProcess({ name: 'Process1' });
            await bpe.createProcess({ name: 'Process2' });
            await bpe.createProcess({ name: 'Process3' });
        }
        // actual.BpmnEngine.registerDefinitions()
        expect(actual.QueryService.count).toBeDefined();
        const actual2 = await actual.QueryService.count('loadedProcess');
        expect(actual2).toBeDefined();
        expect(actual2.results).toBeDefined();
        expect(actual2.results.loadedProcess).toEqual(15);
    });
    it('checks query', async () => {
        const actual = BpmsEngine.createEngine({ name: 'MyEngineQueryService5' });
        expect(actual).toBeDefined();
        const bpe = actual.BpmnEngine;
        const pr1 = await bpe.createDefinitions('Process1', source1);
        expect(pr1).toBeDefined();
        const pr2 = await bpe.createDefinitions('Process2', source2);
        expect(pr2).toBeDefined();
        const pr3 = await bpe.createDefinitions('Process3', source3);
        expect(pr3).toBeDefined();
        for (let i = 0; i < 5; i++) {
            await bpe.createProcess({ name: 'Process1' });
            await bpe.createProcess({ name: 'Process2' });
            await bpe.createProcess({ name: 'Process3' });
        }
        // actual.BpmnEngine.registerDefinitions()
        expect(actual.QueryService.count).toBeDefined();
        const actual2 = await actual.QueryService.query<any>('loadedProcess', { filter: { Name: 'Process1' } });
        expect(actual2).toBeDefined();
        expect(actual2.results).toBeDefined();
        expect(actual2.results.loadedProcess).toBeDefined();
        expect(actual2.results.loadedProcess.data).toBeDefined();
        expect(actual2.results.loadedProcess.data.length).toEqual(5);
    });
});
