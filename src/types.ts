/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/


/* global Float64Array, Int32Array */

const UNDEFINED = 'undefined';

export type Dictionary<T> = {
    [key: string]: T
};
export type DimensionIndex = number;
export type DimensionName = string;
export type DimensionIndexLoose = DimensionIndex | string;
export type DimensionLoose = DimensionName | DimensionIndexLoose;

export type DataTransformType = string;
export type DataTransformConfig = unknown;

export type ParsedValue = ParsedValueNumeric | OrdinalRawValue;
export type ParsedValueNumeric = number | OrdinalNumber;
export type OrdinalRawValue = string | number;
export type OrdinalNumber = number;

export const SOURCE_FORMAT_ORIGINAL = 'original' as const;
export const SOURCE_FORMAT_ARRAY_ROWS = 'arrayRows' as const;
export const SOURCE_FORMAT_OBJECT_ROWS = 'objectRows' as const;
export const SOURCE_FORMAT_KEYED_COLUMNS = 'keyedColumns' as const;
export const SOURCE_FORMAT_TYPED_ARRAY = 'typedArray' as const;
export const SOURCE_FORMAT_UNKNOWN = 'unknown' as const;

export type SourceFormat =
    typeof SOURCE_FORMAT_ORIGINAL
    | typeof SOURCE_FORMAT_ARRAY_ROWS
    | typeof SOURCE_FORMAT_OBJECT_ROWS
    | typeof SOURCE_FORMAT_KEYED_COLUMNS
    | typeof SOURCE_FORMAT_TYPED_ARRAY
    | typeof SOURCE_FORMAT_UNKNOWN;

const dataCtors = {
    'float': typeof Float64Array === UNDEFINED
        ? Array : Float64Array,
    'int': typeof Int32Array === UNDEFINED
        ? Array : Int32Array,
    // Ordinal data type can be string or int
    'ordinal': Array,
    'number': Array,
    'time': Array
};
export type ListDimensionType = keyof typeof dataCtors;
export type DimensionDefinition = {
    type?: ListDimensionType,
    name?: DimensionName,
    displayName?: string
};
export type DimensionDefinitionLoose = DimensionDefinition['name'] | DimensionDefinition;

export interface DataTransformOption {
    type: DataTransformType;
    config: DataTransformConfig;
    // Print the result via `console.log` when transform performed. Only work in dev mode for debug.
    print?: boolean;
}

export type OptionDataValue = string | number | Date;

export type OptionSourceDataArrayRows<VAL extends OptionDataValue = OptionDataValue> =
    Array<Array<VAL>>;
export type OptionSourceDataObjectRows<VAL extends OptionDataValue = OptionDataValue> =
    Array<Dictionary<VAL>>;

export interface ExternalDataTransform<TO extends DataTransformOption = DataTransformOption> {
    // Must include namespace like: 'ecStat:regression'
    type: string;
    __isBuiltIn?: boolean;
    transform: (
        param: ExternalDataTransformParam<TO>
    ) => ExternalDataTransformResultItem | ExternalDataTransformResultItem[];
}

interface ExternalDataTransformParam<TO extends DataTransformOption = DataTransformOption> {
    // This is the first source in upstreamList. In most cases,
    // there is only one upstream source.
    upstream: ExternalSource;
    upstreamList: ExternalSource[];
    config: TO['config'];
}

export interface ExternalDataTransformResultItem {
    /**
     * If `data` is null/undefined, inherit upstream data.
     */
    data: OptionSourceDataArrayRows | OptionSourceDataObjectRows;
    /**
     * A `transform` can optionally return a dimensions definition.
     * The rule:
     * If this `transform result` have different dimensions from the upstream, it should return
     * a new dimension definition. For example, this transform inherit the upstream data totally
     * but add a extra dimension.
     * Otherwise, do not need to return that dimension definition. echarts will inherit dimension
     * definition from the upstream.
     */
    dimensions?: DimensionDefinitionLoose[];
}

export type DataTransformDataItem = ExternalDataTransformResultItem['data'][number];

export interface ExternalDimensionDefinition extends Partial<DimensionDefinition> {
    // Mandatory
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
