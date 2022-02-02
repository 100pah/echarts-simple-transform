import { DataTransformOption, DimensionIndex, DimensionName, ExternalDataTransform } from './types';
export interface IdTransformOption extends DataTransformOption {
    type: 'ecSimpleTransform:id';
    config: {
        dimensionIndex: DimensionIndex;
        dimensionName: DimensionName;
    };
}
export declare const transform: ExternalDataTransform<IdTransformOption>;
