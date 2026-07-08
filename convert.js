const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Excel dosyasının adı
const excelDosya = "stok.xlsx";

// Dosya var mı kontrol et
if (!fs.existsSync(excelDosya)) {
    console.log("❌ Excel dosyası bulunamadı!");
    console.log("👉 Excel dosyasını convert.js ile aynı klasöre koy.");
    process.exit();
}

// Excel'i oku
const workbook = XLSX.readFile(excelDosya);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

// Veriyi dönüştür
const urunler = rows.map(r => ({

    barkod: String(r["BARKOD"] ?? "").trim(),

    malzeme: String(r["MALZEME NUMARASI"] ?? "").trim(),

    ad: String(r["ÜRÜN AÇIKLAMASI"] ?? "").trim(),

    depo: String(r["DEPO LOKASYON"] ?? "").trim(),

    reyon: String(r["REYON LOKASYON"] ?? "").trim()

}));

// data klasörü yoksa oluştur
if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
}

// urunler.js oluştur
const js = `const urunler = ${JSON.stringify(urunler, null, 2)};`;

fs.writeFileSync(
    path.join("data", "urunler.js"),
    js,
    "utf8"
);

console.log("✅ İşlem tamamlandı!");
console.log(`📦 ${urunler.length} ürün aktarıldı.`);
console.log("📁 data/urunler.js oluşturuldu.");
