/**
 * The object-storage port. Domain modules depend on this interface, never on
 * the concrete S3 adapter, so storage can be swapped or faked in tests.
 */
export interface StoragePort {
  /** Upload bytes to `key`. Overwrites if the key already exists. */
  upload(key: string, body: Uint8Array | Buffer | string, contentType?: string): Promise<void>;

  /** Download the object at `key` as a single byte buffer. */
  download(key: string): Promise<Uint8Array>;

  /**
   * A time-limited presigned URL for the given operation on `key`.
   * `expiresInSeconds` defaults to 900 (15 min).
   */
  getSignedUrl(
    key: string,
    operation: 'get' | 'put',
    expiresInSeconds?: number,
  ): Promise<string>;

  /** Verify the configured bucket exists and is reachable (HEAD bucket). */
  headBucket(): Promise<void>;
}

export interface StorageConfig {
  /** Custom endpoint for S3-compatible storage (MinIO/LocalStack). Omit for AWS. */
  endpoint?: string | undefined;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
}
