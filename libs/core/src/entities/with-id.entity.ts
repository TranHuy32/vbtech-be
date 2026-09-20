import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

type Constructor<T = Record<string, any>> = new (...args: any[]) => T;

export function WithId<TBase extends Constructor>(Base: TBase) {
  @Entity()
  class WithIdHost extends Base {
    @PrimaryColumn('char', { length: 21 })
    @PrimaryGeneratedColumn('uuid')
    id: string;
  }

  return WithIdHost;
}

export function WithIdIncrement<TBase extends Constructor>(Base: TBase) {
  @Entity()
  class WithIdNumberHost extends Base {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: string;
  }

  return WithIdNumberHost;
}

export class Empty {}
export class IdString extends WithId(Empty) {}
