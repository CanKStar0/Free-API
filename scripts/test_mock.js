// Kapsamli 10/10 API Endpoint Entegrasyon ve Fonksiyonellik Testi
const { GET: getUuid } = require('../src/app/api/v1/tools/uuid/route.ts');
const { POST: postJsonFormat } = require('../src/app/api/v1/tools/json-format/route.ts');
const { POST: postBase64, GET: getBase64 } = require('../src/app/api/v1/tools/base64/route.ts');
const { GET: getPassword } = require('../src/app/api/v1/tools/password/route.ts');
const { GET: getQrCode } = require('../src/app/api/v1/tools/qr-code/route.ts');
const { POST: postMarkdown } = require('../src/app/api/v1/tools/markdown-to-html/route.ts');
const { POST: postHash, GET: getHash } = require('../src/app/api/v1/tools/hash/route.ts');
const { GET: getLorem } = require('../src/app/api/v1/tools/lorem-ipsum/route.ts');
const { GET: getTimestamp } = require('../src/app/api/v1/tools/timestamp/route.ts');
const { POST: postUrlCodec, GET: getUrlCodec } = require('../src/app/api/v1/tools/url-codec/route.ts');
