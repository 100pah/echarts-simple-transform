import { DataTransformOption, DimensionLoose, DimensionName, ExternalDataTransform } from './types';
export interface AggregateTransformOption extends DataTransformOption {
    type: 'ecSimpleTransform:aggregate';
    config: {
        resultDimensions: {
            name: DimensionName;
            from: DimensionLoose;
            method: AggregateMethodLoose;
        }[];
        groupBy: DimensionLoose;
    };
}
declare const METHOD_INTERNAL: {
    readonly SUM: true;
    readonly COUNT: true;
    readonly FIRST: true;
    readonly AVERAGE: true;
    readonly Q1: true;
    readonly Q2: true;
    readonly Q3: true;
    readonly MIN: true;
    readonly MAX: true;
};
declare type AggregateMethodLoose = AggregateMethodInternal | 'sum' | 'count' | 'first' | 'average' | 'Q1' | 'Q2' | 'Q3' | 'median' | 'min' | 'max';
declare type AggregateMethodInternal = keyof typeof METHOD_INTERNAL;
export declare const transform: ExternalDataTransform<AggregateTransformOption>;
export {};
