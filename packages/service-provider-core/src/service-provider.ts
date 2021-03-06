import Readable from './readable';
import Writable from './writable';
import Closable from './closable';
import Admin from './admin';
import makePrintableBson from './printable-bson';
import { MongoshInternalError } from '@mongosh/errors';

/**
 * Interface for all service providers.
 */
export default interface ServiceProvider extends Readable, Writable, Closable, Admin {}

export class ServiceProviderCore {
  public bsonLibrary;
  constructor(bsonLibrary) {
    if (bsonLibrary === undefined) {
      throw new MongoshInternalError('BSON Library is undefined. This is an internal error, please file a ticket!');
    }
    makePrintableBson(bsonLibrary);
    this.bsonLibrary = bsonLibrary;
  }
}
