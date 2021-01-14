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

export function assert(condition: any, message?: string) {
    if (!condition) {
        throw new Error(message);
    }
}

export function hasOwn(own: object, prop: string): boolean {
    return own.hasOwnProperty(prop);
}

export function quantile(ascArr: number[], p: number): number {
    const H = (ascArr.length - 1) * p + 1;
    const h = Math.floor(H);
    const v = +ascArr[h - 1];
    const e = H - h;
    return e ? v + e * (ascArr[h] - v) : v;
}
