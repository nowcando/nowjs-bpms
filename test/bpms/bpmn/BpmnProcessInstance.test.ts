/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import 'jest';
import { BpmnProcessInstance } from '../../../src';
import { source2 } from '../../resources/projects/BpmnSampleSources';

beforeAll(() => {});
beforeEach(() => {});
afterEach(() => {});
afterAll(() => {});

describe('BpmnProcess', () => {
    describe('new', () => {
        it('should be instantiated BpmnProcess', () => {
            const actual = new BpmnProcessInstance({} as any);
            expect(actual).toBeDefined();
            expect(actual.Name).toBeDefined();
            expect(actual.Id).toBeDefined();
        });
    });
    describe('event.once', () => {
        it('should be call wait', async () => {
            const actual = new BpmnProcessInstance({} as any, {
                name: 'BpmnProcess2',
                source: source2,
            });
            expect(actual).toBeDefined();
            expect(actual.Name).toBeDefined();
            expect(actual.Id).toBeDefined();
            actual.once('wait', task => {
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
            const re = await actual.execute();
            expect(re).toBeDefined();
        });
    });
});
