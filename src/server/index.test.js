import 'regenerator-runtime/runtime'
import app from './index.js'

const request = require("supertest");

describe('get /keys', () => {
    test('should return 3 keys', async () => {
      const response = await request(app).get('/keys');
      let str = JSON.stringify(response.body);
      expect(str).toContain("wth_key");
      expect(str).toContain("pix_key");
      expect(str).toContain("geo_name");
    });
});