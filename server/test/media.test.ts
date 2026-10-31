import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mediaService } from '../src/services/media.service.js';

describe('Media Service & Image Upload Tests', () => {
  test('Rejects invalid file mime types', async () => {
    await assert.rejects(
      async () => {
        await mediaService.uploadImage({
          fileName: 'malicious.exe',
          fileType: 'application/x-msdownload',
          base64Data: 'dGVzdA==',
        });
      },
      (err: any) => {
        assert.match(err.message, /Invalid file format/);
        assert.equal(err.statusCode, 400);
        return true;
      }
    );
  });

  test('Rejects payload missing required fields', async () => {
    await assert.rejects(
      async () => {
        await mediaService.uploadImage({
          fileName: '',
          fileType: 'image/png',
          base64Data: '',
        });
      },
      (err: any) => {
        assert.match(err.message, /required/);
        assert.equal(err.statusCode, 400);
        return true;
      }
    );
  });

  test('Rejects file exceeding 5 MB limit', async () => {
    // 6 MB of dummy data in base64
    const sixMbBuffer = Buffer.alloc(6 * 1024 * 1024, 0);
    const largeBase64 = sixMbBuffer.toString('base64');

    await assert.rejects(
      async () => {
        await mediaService.uploadImage({
          fileName: 'oversized.png',
          fileType: 'image/png',
          base64Data: largeBase64,
        });
      },
      (err: any) => {
        assert.match(err.message, /exceeds maximum limit/);
        assert.equal(err.statusCode, 400);
        return true;
      }
    );
  });
});
