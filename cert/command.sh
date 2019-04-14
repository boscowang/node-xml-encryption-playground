# reference: https://www.akadia.com/services/ssh_test_certificate.html 
openssl genrsa -des3 -out server.key 1024
p@ssw0rd
openssl req -new -key server.key -out server.csr
cp server.key server.key.org
openssl rsa -in server.key.org -out server.key
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt