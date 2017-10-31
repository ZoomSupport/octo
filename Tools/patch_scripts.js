const fs = require('fs')

const vars = {
    '@PUBLIC_KEY': "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzxnpuvoNTS2OIU79hLyb\nxFN6nZjx17DLHLbI1IR3FkOc9oSKfBCj2Q4SaN9LKzcjhXMERrntzzmuU0fCia3p\n4wT/3PErqfVaPTFwjtYHRXaqcwcWUCP+93hQ/MDys+TmNtyRQrZO/mvFUbY2zasp\nuidV23SHGQBBQRjP3vdU7pDItUpo2qENvnX+5OyQRfmkYoOlfbemtdayPlvQu298\nvIN9FS7qX/HNdtF6rAC47e8uwZ5XBXP24dumf1E/72u3EsLafeBjZd+n6C8pl+Qk\nlMuQiyKwVhQs0zY1JcMVbyz/ifog1gDeLn3SkeK5ojmxWmjZJRZ6E3qkMZfCblGU\nswIDAQAB\n-----END PUBLIC KEY-----",
    '@VERSION': "1.0.3",
    '@ZN_GUID': "6165E8D6-04F5-4DDB-808A-97C62665E73B"
}

const scripts = {
    decrypt: {
        in: "resources/decrypt-ex.sh",
        out: "resources/decrypt.sh",
    },
    installer: {
        in: "Installers/Distribution/Package/Scripts/postinstall-ex.sh",
        out: "Installers/Distribution/Package/Scripts/postinstall.sh",
    },
}

for (var s in scripts) {
    var f = fs.readFileSync(scripts[s].in, 'utf-8')

    for (var v in vars) {
        f = f.replace(v, JSON.stringify(vars[v]))
    }

    fs.writeFileSync(scripts[s].out, f)
}