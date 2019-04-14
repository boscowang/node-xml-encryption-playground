import forge from 'node-forge';
import xmlenc from 'xml-encryption';
import xmlencUtils from 'xml-encryption/lib/utils';
import fs from 'fs';
import ejs from 'ejs';

const config = {
  key: fs.readFileSync('./cert/server.key').toString(),
  certPem: fs.readFileSync('./cert/server.crt').toString(),
};
config.cert = forge.pki.certificateFromPem(config.certPem);
config.publicKeyPem = forge.pki.publicKeyToPem(config.cert.publicKey);

const templates = {
  'encrypted-key': fs.readFileSync('./templates/encrypted-key.tpl.xml').toString(),
  keyinfo: fs.readFileSync('./templates/keyinfo.tpl.xml').toString(),
};


function renderTemplate(file, data) {
  return ejs.render(templates[file], data);
}

const overrideTemplate = () => {
  xmlencUtils.renderTemplate = renderTemplate;
};

const encrypt = contentToBeEncrypt => new Promise(((resolve, reject) => {
  const options = {
    rsa_pub: config.publicKeyPem,
    pem: config.certPem,
    encryptionAlgorithm: 'http://www.w3.org/2001/04/xmlenc#aes256-cbc',
    keyEncryptionAlgorighm: 'http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p',
  };
  xmlenc.encrypt(contentToBeEncrypt, options, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
}));

const replaceXmlTag = (xml) => {
  const result = xml;
  return result;
};

const decrypt = contentToBeDecrypt => new Promise(((resolve, reject) => {
  const editedTagEncryptedData = replaceXmlTag(contentToBeDecrypt);
  const options = {
    key: config.key,
  };
  xmlenc.decrypt(editedTagEncryptedData, options, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
}));

const startPlay = async () => {
  const encryptedData = await encrypt('hihi');
  console.log(encryptedData);
  const decryptedData = await decrypt(encryptedData);
  console.log(decryptedData);
};

overrideTemplate();
startPlay();
