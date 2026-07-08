console.log("CAMERA.JS YÜKLENDİ");

document
    .getElementById("kameraButon")
    ?.addEventListener("click", kameraAc);

let aktifStream = null;

async function kameraAc() {

    try {

        aktifStream = await navigator.mediaDevices.getUserMedia({

            video: {
                facingMode: "environment"
            }

        });

        kameraPenceresi();

    } catch (err) {

        alert("Kamera açılamadı.");

        console.log(err);

    }

}

function kameraPenceresi() {

    const eski = document.getElementById("kameraModal");

    if(eski){
        eski.remove();
    }

    const pencere = document.createElement("div");

    pencere.id = "kameraModal";

    pencere.innerHTML = `

    <div class="kameraBox">

        <video
            id="kameraVideo"
            autoplay
            playsinline
        ></video>

        <button id="taraBtn">
            🔍 Sayıyı Oku
        </button>

        <button id="kapatKamera">
            ❌ Kapat
        </button>

    </div>

    `;

    document.body.appendChild(pencere);

    const video = document.getElementById("kameraVideo");

    video.srcObject = aktifStream;

    document
        .getElementById("taraBtn")
        .onclick = oku;

    document
        .getElementById("kapatKamera")
        .onclick = kapatKamera;

}
// =====================================
// Kamera Kapat
// =====================================

function kapatKamera() {

    if (aktifStream) {

        aktifStream.getTracks().forEach(track => track.stop());

        aktifStream = null;

    }

    const modal = document.getElementById("kameraModal");

    if (modal) {

        modal.remove();

    }

}

// =====================================
// OCR
// =====================================

async function oku() {

    console.log("OCR Başladı...");

    const video = document.getElementById("kameraVideo");

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0);

    try {

        const sonuc = await Tesseract.recognize(
            canvas,
            "eng",
            {
                logger: m => console.log(m)
            }
        );

        console.log(sonuc.data.text);

        const kod = sonuc.data.text.match(/\d{10,14}/);

        if (kod) {

            console.log("Bulunan Kod:", kod[0]);

            document.getElementById("aramaKutusu").value = kod[0];

            document.getElementById("oneriler").innerHTML = "";

            ara();

            kapatKamera();

        } else {

            alert("Etikette kod bulunamadı.");

        }

    } catch (err) {

        console.error(err);

        alert("OCR okunurken hata oluştu.");

    }

}