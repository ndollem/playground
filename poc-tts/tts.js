var msg = document.getElementById("msg"),
    btnPlay = document.getElementById("play"),
    spectrum = document.getElementById("spectrum"),
    btnStop = document.getElementById("stop"),
    SPEECH,
    VOICES,
    VOICE_SPEAKING = false,
    selectedLang = 0,
    speechTimer,
    predefinedText = {
        'en': 'Last week brought a relentless deluge of legal news for former President Donald J. Trump. All of it was bad, and some of it came courtesy of judges he or former Republican President Ronald Reagan had appointed.',
        'id': 'Belum lama ini, peneliti di Kyushu University dan University of Tokyo Jepang menghadirkan metode baru untuk membuka smartphone, di mana pengguna hanya perlu bernapas.'
    };

initialize();

function initialize() {
    if ('speechSynthesis' in window) {
        SYNTHESIS = window.speechSynthesis;

        let fetchVoicesTimer = setInterval(function () {
            let voices = SYNTHESIS.getVoices();

            if (voices.length > 0) {
                document.querySelector("textarea").value = predefinedText.en;
                getVoices();

                SPEECH = new SpeechSynthesisUtterance();

                clearInterval(fetchVoicesTimer);
            }
        }, 200);
    } else {

        let message = 'Text-to-speech not supported by your browser.';
        console.log(message);
        msg.innerHTML = message;

    }
}

// Shows an element
function showControl(control) {
    control.addClass('d-inline-block').removeClass('d-none');
}

// Hides an element
function hideControl(control) {
    control.addClass('d-none').removeClass('d-inline-block');
}

// Get the available voices, filter the list to have only English filters
function getVoices() {
    // Regex to match all Indonesian & English language tags e.g id, id-ID, en, en-US, en-GB
    let langRegex = /^(id|en)[a-zA-Z0-9-_]+$/i;

    // Get the available voices and filter the list to only have English speakers
    VOICES = SYNTHESIS.getVoices()
        .filter(function (voice) {
            return langRegex.test(voice.lang);
        })
        .map(function (voice) {
            return {
                voice: voice,
                name: voice.name,
                lang: voice.lang,
            };
        });

    listVoices();
}

function listVoices() {

    let voiceSelect = document.querySelector("#voices");
    VOICES.forEach((voice, i) => {
        (voiceSelect.options[i] = new Option(voice.lang + ' | ' + voice.name, i));
        if (voice.lang == 'id-ID') {
            selectedLang = i;
            voiceSelect.options[i].selected = true;
            document.querySelector("textarea").value = predefinedText.id;
        }
    });
}

function play() {
    console.log(VOICES);
    window.speechSynthesis.cancel();
    SPEECH.text = document.querySelector("textarea").value;
    SPEECH.voice = VOICES[selectedLang].voice;
    SPEECH.lang = VOICES[selectedLang].lang;
    window.speechSynthesis.speak(SPEECH);
    console.log(SPEECH);


    SPEECH.onstart = () => {
        VOICE_SPEAKING = true;
        btnPlay.classList.add("d-none");
        spectrum.classList.remove("d-none");

        // detection for android devices
        const ua = navigator.userAgent.toLowerCase();
        const isAndroid = ua.indexOf("android") > -1;

        console.log(isAndroid);

        if (!isAndroid) {
            resumeInfinity(SPEECH);
        }
    }

    const clear = () => { clearTimeout(speechTimer) }

    SPEECH.onerror = clear;
    //capture event when speech is ended
    SPEECH.onend = (event) => {
        btnPlay.classList.remove("d-none");
        spectrum.classList.add("d-none");
        console.log(`Utterance has finished being spoken after ${event.elapsedTime} seconds.`);
    }
}


const resumeInfinity = (target) => {
    // prevent memory-leak in case speech is deleted, while this is ongoing
    if (!target && speechTimer) { return clear() }

    //immediatelly paused and resume every 5 second
    window.speechSynthesis.pause()
    window.speechSynthesis.resume()

    speechTimer = setTimeout(function () {
        resumeInfinity(target);
    }, 5000)
}
/*--END workaround for chrome known bug that muted speech after 15 second--*/

document.querySelector("#voices").addEventListener("change", () => {
    selectedLang = document.querySelector("#voices").value;
});

document.querySelector("#play").addEventListener("click", () => {
    play();
});
document.querySelector("#stop").addEventListener("click", () => {
    window.speechSynthesis.cancel();
});