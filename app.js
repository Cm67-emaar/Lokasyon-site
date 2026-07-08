// =============================
// LOKASYON SİSTEMİ APP.JS V2
// BÖLÜM 1
// =============================

const aramaKutusu = document.getElementById("aramaKutusu");
const araButon = document.getElementById("araButon");
const kameraButon = document.getElementById("kameraButon");
const sonuc = document.getElementById("sonuc");
const oneriler = document.getElementById("oneriler");

// İstatistikleri yükle
istatistikleriGuncelle();

// Olaylar
araButon.addEventListener("click", ara);

aramaKutusu.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        ara();
    }
});

aramaKutusu.addEventListener("input", canliAra);

// =============================

function istatistikleriGuncelle() {

    document.getElementById("toplamUrun").textContent = urunler.length;

    document.getElementById("toplamReyon").textContent =
        new Set(
            urunler
                .map(u => u.reyon)
                .filter(Boolean)
        ).size;

    document.getElementById("toplamDepo").textContent =
        new Set(
            urunler
                .map(u => u.depo)
                .filter(Boolean)
        ).size;

}

// =============================

function ara() {

    const aranan = aramaKutusu.value.trim().toLowerCase();

    if (!aranan) {

        sonuc.innerHTML = `
            <div class="result-card">
                <h2>⚠️ Uyarı</h2>
                <p>Lütfen malzeme, barkod veya ürün adı giriniz.</p>
            </div>
        `;

        return;
    }

    const bulunan = urunler.find(u =>

        (u.malzeme || "").toLowerCase() === aranan ||

        (u.barkod || "").toLowerCase() === aranan ||

        (u.ad || "").toLowerCase().includes(aranan)

    );

    if (!bulunan) {

        sonuc.innerHTML = `
            <div class="result-card">
                <h2>❌ Ürün Bulunamadı</h2>
                <p>Aradığınız ürün sistemde bulunamadı.</p>
            </div>
        `;

        return;

    }

    kartiGoster(bulunan);

}

// =============================

function kartiGoster(urun) {

    sonuc.innerHTML = `

    <div class="result-card">

        <h2>📦 ${urun.ad}</h2>

        <div class="result-item">
            <b>Malzeme</b><br>
            ${urun.malzeme}
        </div>

        <div class="result-item">
            <b>Barkod</b><br>
            ${urun.barkod}
        </div>

        <div
            class="location"
            onclick="lokasyonListele('reyon','${urun.reyon}')">

            🏬 <b>Reyon</b><br>

            ${urun.reyon || "-"}

        </div>

        <div
            class="location"
            onclick="lokasyonListele('depo','${urun.depo}')">

            📦 <b>Depo</b><br>

            ${urun.depo || "-"}

        </div>

        <div id="lokasyonSonuc"></div>

    </div>

    `;

}
// =============================
// LOKASYON SİSTEMİ APP.JS V2
// BÖLÜM 2
// =============================

function lokasyonListele(tip, deger) {

    if (!deger) return;

    const liste = urunler.filter(u => {

        if (tip === "reyon") {
            return u.reyon === deger;
        }

        return u.depo === deger;

    });

    let html = `
        <hr>
        <h3>📍 Aynı ${tip === "reyon" ? "Reyondaki" : "Depodaki"} Ürünler</h3>
        <p><b>Toplam:</b> ${liste.length}</p>
    `;

    liste.slice(0, 50).forEach(u => {

        html += `
            <div class="oneri"
                 onclick="kartiGoster(urunler.find(x => x.malzeme==='${u.malzeme}'))">

                <b>${u.malzeme}</b><br>
                ${u.ad}

            </div>
        `;

    });

    if (liste.length > 50) {

        html += `
            <p style="margin-top:10px;">
                İlk 50 ürün gösteriliyor...
            </p>
        `;

    }

    document.getElementById("lokasyonSonuc").innerHTML = html;

}

// =============================

function canliAra() {

    const q = aramaKutusu.value
        .trim()
        .toLowerCase();

    oneriler.innerHTML = "";

    if (q.length < 2) return;

    const liste = urunler.filter(u =>

        (u.malzeme || "").toLowerCase().includes(q) ||

        (u.barkod || "").toLowerCase().includes(q) ||

        (u.ad || "").toLowerCase().includes(q)

    ).slice(0, 10);

    liste.forEach(u => {

        const div = document.createElement("div");

        div.className = "oneri";

        div.innerHTML = `
            <b>${u.malzeme}</b><br>
            ${u.ad}
        `;

        div.onclick = () => {

            aramaKutusu.value = u.malzeme;

            oneriler.innerHTML = "";

            kartiGoster(u);

        };

        oneriler.appendChild(div);

    });

}

// =============================

// Sayfa açılır açılmaz istatistikleri güncelle
istatistikleriGuncelle();
{

   
}
    