const introOverlay = document.querySelector("#introOverlay");
const introBlockButton = document.querySelector("#introBlockButton");
const introBlockImage = document.querySelector("#introBlockImage");
const introMushroom = document.querySelector("#introMushroom");
const siteContent = document.querySelector("#siteContent");
const blockButton = document.querySelector("#blockButton");
const blockStage = document.querySelector("#blockStage");
const coinCounter = document.querySelector("#coinCounter");
const musicButton = document.querySelector("#musicButton");
const backgroundMusic = document.querySelector("#backgroundMusic");
const gallerySlide = document.querySelector("#gallerySlide");
const galleryImage = document.querySelector("#galleryImage");
const galleryName = document.querySelector("#galleryName");
const galleryTagline = document.querySelector("#galleryTagline");
const galleryDescription = document.querySelector("#galleryDescription");
const galleryAppearance = document.querySelector("#galleryAppearance");
const galleryDots = document.querySelector("#galleryDots");
const prevToad = document.querySelector("#prevToad");
const nextToad = document.querySelector("#nextToad");
const coinSoundPath = "./audio/mario_coin_sound.mp3";

const toads = [
    {
        name: "Red Toad",
        image: "./fanpage-pics/red.webp",
        color: "#e52521",
        tagline: "THE ORIGINAL",
        description: "The red-and-white Toad design became the most iconic look associated with the Mushroom Kingdom's Toads. It is also the appearance most commonly associated with the individual character simply known as Toad.",
        appearance: "SUPER MARIO BROS. • 1985"
    },
    {
        name: "Blue Toad",
        image: "./fanpage-pics/blue.webp",
        color: "#1d4fff",
        tagline: "THE 8-BIT BLUE",
        description: "Blue Toads have become one of the most recognisable colour variations in the series. The individual Toad was also famously shown with blue spots in the NES version of Super Mario Bros. 2 because of the game's graphical limitations.",
        appearance: "SUPER MARIO BROS. 2 • 1988"
    },
    {
        name: "Green Toad",
        image: "./fanpage-pics/green.webp",
        color: "#22b83a",
        tagline: "PLAYER TWO",
        description: "Green Toad gained an early playable role as the second player's counterpart to Red Toad in Wario's Woods. Green has since become one of the recurring colours used for Toads throughout the Mushroom Kingdom.",
        appearance: "WARIO'S WOODS • 1994"
    },
    {
        name: "Yellow Toad",
        image: "./fanpage-pics/yellow.webp",
        color: "#f0b800",
        tagline: "BRIGHT & CHEERFUL",
        description: "Yellow Toads are now a familiar sight throughout the Mario series and have even taken playable roles in several adventures. Their bright colour makes them one of the easiest Toad variations to recognise.",
        appearance: "THE SUPER MARIO BROS. SUPER SHOW! • 1989"
    },
    {
        name: "Purple Toad",
        image: "./fanpage-pics/purple.webp",
        color: "#9c27d9",
        tagline: "A COLOURFUL ADDITION",
        description: "Purple Toads helped expand the colourful variety of Mushroom Kingdom residents beyond the more familiar red and blue designs. They have since appeared alongside other Toad colours across Mario games and media.",
        appearance: "THE ADVENTURES OF SUPER MARIO BROS. 3 • 1990"
    },
    {
        name: "Toadette",
        image: "./fanpage-pics/pink.webp",
        color: "#ff5ab7",
        tagline: "TOAD'S RACING PARTNER",
        description: "Toadette is one of the most recognisable individual members of the Toad species. Originally introduced as Toad's racing partner, she later became a recurring playable character with adventures and abilities of her own.",
        appearance: "MARIO KART: DOUBLE DASH!! • 2003"
    },
    {
        name: "Toadsworth",
        image: "./fanpage-pics/old.webp",
        color: "#8b4a22",
        tagline: "THE ROYAL STEWARD",
        description: "With his moustache, spectacles, cane and brown-spotted cap, Toadsworth stands apart from most other Toads. He serves as Princess Peach's elderly steward and is often portrayed as protective and deeply concerned for her well-being.",
        appearance: "SUPER MARIO SUNSHINE • 2002"
    },
    {
        name: "Captain Toad",
        image: "./fanpage-pics/captain.webp",
        color: "#8b4a22",
        tagline: "READY FOR ADVENTURE",
        description: "Captain Toad is an adventurous explorer and leader of the Toad Brigade. Carrying his oversized backpack and headlamp, he searches for treasure and eventually became the star of his own puzzle-platforming adventure.",
        appearance: "SUPER MARIO GALAXY • 2007"
    }
];

let coins = 0;
let musicPlaying = false;
let introStarted = false;
let currentToad = 0;
let galleryAnimating = false;

function bumpBlock() {
    blockButton.classList.remove("bump");
    void blockButton.offsetWidth;
    blockButton.classList.add("bump");
}

function createCoin() {
    const coin = document.createElement("img");
    coin.src = "./fanpage-pics/coin.webp";
    coin.alt = "Coin";
    coin.classList.add("flying-coin");
    blockStage.appendChild(coin);

    coin.addEventListener("animationend", function () {
        coin.remove();
    });
}

function playCoinSound() {
    const coinSound = new Audio(coinSoundPath);
    coinSound.volume = 0.65;
    coinSound.play().catch(function () {
        // If a browser blocks this tiny effect, the coin animation still works.
    });
}

function hitBlock() {
    bumpBlock();
    coins = coins + 1;
    coinCounter.textContent = "Coins: " + coins;
    createCoin();
    playCoinSound();
}

function updateGalleryContent(index) {
    galleryImage.src = toads[index].image;
    galleryImage.alt = toads[index].name;
    galleryName.textContent = toads[index].name;
    galleryName.style.color = toads[index].color;
    galleryTagline.textContent = toads[index].tagline;
    galleryDescription.textContent = toads[index].description;
    galleryAppearance.textContent = toads[index].appearance;

    document.querySelectorAll(".gallery-dot").forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
    });
}

function showToad(index, direction) {
    if (galleryAnimating || index === currentToad) {
        return;
    }

    galleryAnimating = true;
    const nextIndex = (index + toads.length) % toads.length;
    const outClass = direction === "previous" ? "prev-out" : "next-out";
    const inClass = direction === "previous" ? "prev-in" : "next-in";

    gallerySlide.classList.add(outClass);

    setTimeout(function () {
        currentToad = nextIndex;
        updateGalleryContent(currentToad);
        gallerySlide.classList.remove(outClass);
        gallerySlide.classList.add(inClass);
        galleryImage.classList.remove("pop");
        void galleryImage.offsetWidth;
        galleryImage.classList.add("pop");
    }, 220);

    setTimeout(function () {
        gallerySlide.classList.remove(inClass);
        galleryAnimating = false;
    }, 520);
}

// Create clickable dots for the six gallery slides.
toads.forEach(function (toad, index) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.classList.add("gallery-dot");
    dot.setAttribute("aria-label", "Show " + toad.name);
    dot.addEventListener("click", function () {
        const direction = index < currentToad ? "previous" : "next";
        showToad(index, direction);
    });
    galleryDots.appendChild(dot);
});

updateGalleryContent(currentToad);

function playMusic() {
    backgroundMusic.volume = 0.45;
    backgroundMusic.play().then(function () {
        musicPlaying = true;
        musicButton.textContent = "♫ Music Off";
    }).catch(function () {
        musicPlaying = false;
        musicButton.textContent = "♫ Music On";
    });
}

function pauseMusic() {
    backgroundMusic.pause();
    musicPlaying = false;
    musicButton.textContent = "♫ Music On";
}

function startIntro() {
    if (introStarted) {
        return;
    }

    introStarted = true;
    introBlockButton.classList.add("bump");

    // After the quick bump, swap the question block to a brick and raise the mushroom.
    setTimeout(function () {
        introBlockImage.src = "./fanpage-pics/brick.png";
        introBlockImage.alt = "Brown Mario brick block";
        introMushroom.classList.add("rise");
    }, 200);

    // Fade from the intro screen into the Mario level background.
    setTimeout(function () {
        document.body.classList.add("entered");
        siteContent.setAttribute("aria-hidden", "false");
        introOverlay.classList.add("fade-out");
    }, 1400);

    // Once the level is visible, remove the overlay, start music, and launch the title.
    setTimeout(function () {
        introOverlay.style.display = "none";
        introOverlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("intro-active");
        playMusic();
        document.body.classList.add("title-entered");
    }, 1900);

    // Show the scroll instruction after the TOAD title lands.
    setTimeout(function () {
        document.body.classList.add("prompt-entered");
        document.body.classList.add("hero-ready");
    }, 2750);
}

// Reveal page sections once as the user scrolls through the fan page.
const revealItems = document.querySelectorAll(".reveal, .reveal-pop");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.18
    });

    revealItems.forEach(function (item) {
        revealObserver.observe(item);

        // Pop animations use keyframes; remove the reveal class afterwards so hover still works.
        if (item.classList.contains("reveal-pop")) {
            item.addEventListener("animationend", function cleanupPop(event) {
                if (event.target !== item) {
                    return;
                }
                item.style.opacity = "1";
                item.style.transform = "none";
                item.classList.remove("reveal-pop");
                item.classList.remove("visible");
                item.removeEventListener("animationend", cleanupPop);
            });
        }
    });
} else {
    revealItems.forEach(function (item) {
        item.classList.add("visible");
    });
}

introBlockButton.addEventListener("click", startIntro);
blockButton.addEventListener("click", hitBlock);
prevToad.addEventListener("click", function () {
    showToad(currentToad - 1, "previous");
});
nextToad.addEventListener("click", function () {
    showToad(currentToad + 1, "next");
});

musicButton.addEventListener("click", function () {
    if (musicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});