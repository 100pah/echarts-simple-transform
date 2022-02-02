export declare type Dictionary<T> = {
    [key: string]: T;
};
export declare type DimensionIndex = number;
export declare type DimensionName = string;
export declare type DimensionIndexLoose = DimensionIndex | string;
export declare type DimensionLoose = DimensionName | DimensionIndexLoose;
export declare type DataTransformType = string;
export declare type DataTransformConfig = unknown;
export declare type ParsedValue = ParsedValueNumeric | OrdinalRawValue;
export declare type ParsedValueNumeric = number | OrdinalNumber;
export declare type OrdinalRawValue = string | number;
export declare type OrdinalNumber = number;
export declare const SOURCE_FORMAT_ORIGINAL: "original";
export declare const SOURCE_FORMAT_ARRAY_ROWS: "arrayRows";
export declare const SOURCE_FORMAT_OBJECT_ROWS: "objectRows";
export declare const SOURCE_FORMAT_KEYED_COLUMNS: "keyedColumns";
export declare const SOURCE_FORMAT_TYPED_ARRAY: "typedArray";
export declare const SOURCE_FORMAT_UNKNOWN: "unknown";
export declare type SourceFormat = typeof SOURCE_FORMAT_ORIGINAL | typeof SOURCE_FORMAT_ARRAY_ROWS | typeof SOURCE_FORMAT_OBJECT_ROWS | typeof SOURCE_FORMAT_KEYED_COLUMNS | typeof SOURCE_FORMAT_TYPED_ARRAY | typeof SOURCE_FORMAT_UNKNOWN;
declare const dataCtors: {
    float: Float64ArrayConstructor | ArrayConstructor;
    int: ArrayConstructor | Int32ArrayConstructor;
    ordinal: ArrayConstructor;
    number: ArrayConstructor;
    time: ArrayConstructor;
};
export declare type ListDimensionType = keyof typeof dataCtors;
export declare type DimensionDefinition = {
    type?: ListDimensionType;
    name?: DimensionName;
    displayName?: string;
};
export declare type DimensionDefinitionLoose = DimensionDefinition['name'] | DimensionDefinition;
export interface DataTransformOption {
    type: DataTransformType;
    config: DataTransformConfig;
    print?: boolean;
}
export declare type OptionDataValue = string | number | Date;
export declare type OptionSourceDataArrayRows<VAL extends OptionDataValue = OptionDataValue> = Array<Array<VAL>>;
export declare type OptionSourceDataObjectRows<VAL extends OptionDataValue = OptionDataValue> = Array<Dictionary<VAL>>;
export interface ExternalDataTransform<TO extends DataTransformOption = DataTransformOption> {
    type: string;
    __isBuiltIn?: boolean;
    transform: (param: ExternalDataTransformParam<TO>) => ExternalDataTransformResultItem | ExternalDataTransformResultItem[];
}
interface ExternalDataTransformParam<TO extends DataTransformOption = DataTransformOption> {
    upstream: ExternalSource;
    upstreamList: ExternalSource[];
    config: TO['config'];
}
export interface ExternalDataTransformResultItem {
    data: OptionSourceDataArrayRows | OptionSourceDataObjectRows;
    dimensions?: DimensionDefinitionLoose[];
}
export declare type DataTransformDataItem = ExternalDataTransformResultItem['data'][number];
export interface ExternalDimensionDefinition extends Partial<DimensionDefinition> {
    index: DimensionIndex;
}
export interface ExternalSource {
    sourceFormat: SourceFormat;
    getRawDataItem(dataIndex: number): number;
    getRawDataItem(dataIndex: number): DataTransformDataItem;
    cloneRawData(): OptionSourceDataArrayRows | OptionSourceDataObjectRows;
    getDimensionInfo(dim: DimensionLoose): ExternalDimensionDefinition;
    cloneAllDimensionInfo(): ExternalDimensionDefinition[];
    count(): number;
    retrieveValue(dataIndex: number, dimIndex: DimensionIndex): OptionDataValue;
    retrieveValueFromItem(dataItem: DataTransformDataItem, dimIndex: DimensionIndex): OptionDataValue;
    convertValue(rawVal: unknown, dimInfo: ExternalDimensionDefinition): ParsedValue;
}
export {};
