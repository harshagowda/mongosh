import { ShellApiClass, shellApiClassDefault } from './decorators';
import { shellApiType, asPrintable } from './enums';
import { addHiddenDataProperty } from './helpers';

@shellApiClassDefault
export class CommandResult extends ShellApiClass {
  value: any;
  type: string;
  constructor(type, value) {
    super();
    this.type = type;
    this.value = value;
    this[shellApiType] = type;
  }

  /**
   * Internal method to determine what is printed for this class.
   */
  [asPrintable](): string {
    return this.value;
  }
}

@shellApiClassDefault
export class BulkWriteResult extends ShellApiClass {
  acknowledged: boolean;
  insertedCount: number;
  insertedIds: string[];
  matchedCount: number;
  modifiedCount: number;
  deletedCount: number;
  upsertedCount: number;
  upsertedIds: string[];
  constructor(acknowledged, insertedCount, insertedIds, matchedCount, modifiedCount, deletedCount, upsertedCount, upsertedIds) {
    super();
    this.acknowledged = acknowledged;
    this.insertedCount = insertedCount;
    this.insertedIds = insertedIds;
    this.matchedCount = matchedCount;
    this.modifiedCount = modifiedCount;
    this.deletedCount = deletedCount;
    this.upsertedCount = upsertedCount;
    this.upsertedIds = upsertedIds;
  }
}

@shellApiClassDefault
export class InsertManyResult extends ShellApiClass {
  acknowledged: boolean;
  insertedIds: string[];
  constructor(acknowledged, insertedIds) {
    super();
    this.acknowledged = acknowledged;
    this.insertedIds = insertedIds;
  }
}

@shellApiClassDefault
export class InsertOneResult extends ShellApiClass {
  acknowledged: boolean;
  insertedId: string;
  constructor(acknowledged, insertedId) {
    super();
    this.acknowledged = acknowledged;
    this.insertedId = insertedId;
  }
}

@shellApiClassDefault
export class UpdateResult extends ShellApiClass {
  acknowledged: boolean;
  insertedId: string;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
  constructor(acknowledged, matchedCount, modifiedCount, upsertedCount, insertedId) {
    super();
    this.acknowledged = acknowledged;
    this.insertedId = insertedId;
    this.matchedCount = matchedCount;
    this.modifiedCount = modifiedCount;
    this.upsertedCount = upsertedCount;
  }
}

@shellApiClassDefault
export class DeleteResult extends ShellApiClass {
  acknowledged: boolean;
  deletedCount: number;
  constructor(acknowledged, deletedCount) {
    super();
    this.acknowledged = acknowledged;
    this.deletedCount = deletedCount;
  }
}

// NOTE: because this is inherited, the decorator does not add attributes. So no help() function.
@shellApiClassDefault
export class CursorIterationResult extends Array {
  [shellApiType]: string;

  constructor(...args) {
    super(...args);
    addHiddenDataProperty(this, shellApiType, 'CursorIterationResult');
  }
}
