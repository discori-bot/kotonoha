/*
 * Copyright (C) 2023  Discori Authors
 * Copyright (C) 2016-2022  Yomichan Authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable no-continue */
/* eslint-disable no-bitwise */
type Reason = string;

type Variants = Array<Array<string | number>>;

type Result = {
  reasons: Array<Reason>;
  rules: number;
  term: string;
};

class Deinflector {
  static ruleTypes: Map<string, number>;

  private reasons: Array<Array<Reason | Variants>>;

  constructor(reasons: object) {
    this.reasons = Deinflector.normalizeReasons(reasons);
  }

  deinflect(source: string) {
    const results: Array<Result> = [Deinflector.createDeinflection(source, 0, [])];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < results.length; ++i) {
      const { rules, term, reasons } = results[i];
      for (const [reason, variants] of this.reasons) {
        for (const [kanaIn, kanaOut, rulesIn, rulesOut] of variants) {
          if (typeof rulesIn !== 'number' || typeof rulesOut !== 'number')
            throw TypeError('Expected rulesIn or rulesOut to be of type number');

          if (typeof kanaIn !== 'string' || typeof kanaOut !== 'string')
            throw TypeError('Expected kanaIn or kanaOut to be of type string');

          if (
            (rules !== 0 && (rules & rulesIn) === 0) ||
            !term.endsWith(kanaIn) ||
            term.length - kanaIn.length + kanaOut.length <= 0
          ) {
            continue;
          }

          results.push(
            Deinflector.createDeinflection(
              term.substring(0, term.length - kanaIn.length) + kanaOut,
              rulesOut,
              [reason as Reason, ...reasons],
            ),
          );
        }
      }
    }
    return results;
  }

  static createDeinflection(term: string, rules: number, reasons: Array<Reason>): Result {
    return { term, rules, reasons };
  }

  static normalizeReasons(reasons: object) {
    const normalizedReasons = [];
    for (const [reason, reasonInfo] of Object.entries(reasons)) {
      const variants = [];
      for (const { kanaIn, kanaOut, rulesIn, rulesOut } of reasonInfo) {
        if (!Array.isArray(rulesIn) || !Array.isArray(rulesOut)) {
          throw TypeError('Expected rulesIn and rulesOut to be Arrays');
        }

        if (typeof kanaIn !== 'string' || typeof kanaOut !== 'string')
          throw TypeError('Expected kanaIn and kanaOut to be of type string');

        variants.push([
          kanaIn,
          kanaOut,
          this.rulesToRuleFlags(rulesIn as string[]),
          this.rulesToRuleFlags(rulesOut as string[]),
        ]);
      }
      normalizedReasons.push([reason, variants]);
    }
    return normalizedReasons;
  }

  static rulesToRuleFlags(rules: Array<string>) {
    const { ruleTypes } = Deinflector;
    let value = 0;
    for (const rule of rules) {
      const ruleBits = ruleTypes.get(rule);
      if (typeof ruleBits === 'undefined') {
        continue;
      }
      value |= ruleBits;
    }
    return value;
  }
}

Deinflector.ruleTypes = new Map([
  ['v1', 0b00000001], // Verb ichidan
  ['v5', 0b00000010], // Verb godan
  ['vs', 0b00000100], // Verb suru
  ['vk', 0b00001000], // Verb kuru
  ['vz', 0b00010000], // Verb zuru
  ['adj-i', 0b00100000], // Adjective i
  ['iru', 0b01000000], // Intermediate -iru endings for progressive or perfect tense
]);

// const deinflectorReasons = JSON.parse(
//   readFileSync(path.join('src/utils/data/deinflect.json')).toString(),
// ) as object;
// const deinflector = new Deinflector(deinflectorReasons);

// console.log(deinflector.deinflect('食べます'));

export default Deinflector;
