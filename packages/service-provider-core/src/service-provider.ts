import Readable from './readable';
import Writable from './writable';
import Closable from './closable';
import Admin from './admin';
import makePrintableBson from './printable-bson';

/**
 * Interface for all service providers.
 */
export default interface ServiceProvider extends Readable, Writable, Closable, Admin {}

export class ServiceProviderCore {
  public bsonLibrary;
  constructor(bsonLibrary) {
    makePrintableBson(bsonLibrary);
    this.bsonLibrary = bsonLibrary;
  }
}
