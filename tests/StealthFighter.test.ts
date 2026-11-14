import StealthFighter from '../StealthFighter';
import Air from '@civ-clone/base-unit-type-air/Air';
import Unit from '@civ-clone/core-unit/Unit';
import { instance as ruleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { existsSync, readFileSync } from 'fs';
import { expect } from 'chai';
import { join } from 'path';
import { typeNameOf } from '@civ-clone/core-data-object/DataObject';

describe('StealthFighter', (): void => {
  it('should extend Air directly, and nothing else', (): void => {
    expect(Object.getPrototypeOf(StealthFighter)).to.equal(Air);
    expect(StealthFighter.prototype).to.be.instanceOf(Unit);
  });

  it('should be saved by its own name', (): void => {
    expect(typeNameOf(StealthFighter)).to.equal('StealthFighter');
  });

  it('should be a library that registers nothing', (): void => {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8')
    );

    ['main', 'module', 'exports', 'bin'].forEach((field: string): void => {
      expect(packageJson).not.to.have.property(field);
    });
    expect(existsSync(join(process.cwd(), 'index.ts'))).to.be.false;
    expect(existsSync(join(process.cwd(), 'index.js'))).to.be.false;

    const entries = (): unknown[][] => [ruleRegistry.entries()],
      before = entries(),
      path = require.resolve('../StealthFighter');

    // Load the module afresh, as a plugin loader importing it would.
    delete require.cache[path];
    require(path);

    const after = entries();

    after.forEach((list: unknown[], index: number): void => {
      expect(list).to.have.ordered.members(before[index]);
    });
  });
});
