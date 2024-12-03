// GLOBAL VARIABLES
let canvasWidth = 1200;
let canvasHeight = 849;
let scaleFactor;

let icons = [];
let backdrops = [];
let photos = [];
let highlights = [];
let hotspots = [];
let iconImages = [];

let currentBackdrop;
let stage = "landing";
let currentIcon = null;

let customFont; // Store the font
let polaroidIcon; // Polaroid icon image
let displayText = false; // Toggle for showing/hiding text
let sectionTexts = [
  "Long before I came into her life, she was herself—a whole world I could only sense in glimpses, a story told through fragments. She had her routines, her secrets, her habits that seemed to have taken shape long before I arrived, as if I’d slipped seamlessly into a rhythm already in place. And yet, she made space for me, allowing me to exist alongside her in quiet, unassuming ways, never once demanding that I understand the life she led before.\n\nThere were small signs of this world she carried within her. She would leaf through an old address book, pausing over familiar names, a faraway look crossing her face as she dialed, her voice softening into a dialect that held pieces of a life I’d never know. I’d watch her call up people who felt like characters from another time, her conversations winding through memories I’d never hear, but whose echoes lingered in her voice. In her way, she let me feel her past, inviting me into it without ever explaining, letting it exist alongside my own.\n\nShe didn’t need to tell me what love was; she simply showed me, her care a quiet thread that wove through my days without asking for attention. It wasn’t the big gestures but the uncounted ones that drew us together, as natural as breath. Her influence seeped into my life in ways I could barely see but somehow always felt. She taught me that true closeness doesn’t need words, that love is as simple as the quiet comfort of just being there.\n\nMaybe that’s how it’s meant to be—two lives intertwined, bound by the ordinary moments that seem so small yet hold the weight of all we are. Her presence lives on in me, like a whisper of continuity, a silent reminder of the strength we inherit, woven into who we become.",
  "During those turbulent years, when the world seemed like an endless source of irritation, she was the one person I never grew tired of. In a life filled with chaos and change, her steady presence grounded me, quietly watching over me without pressing or demanding—like a calm anchor I could rely on without question. She absorbed my teenage moods with a patience that softened everything, offering me the comfort of knowing I was never truly alone.\n\nLooking back, her influence feels like a quiet thread woven into the fabric of who I am, a part of me that I didn’t notice at the time but that shaped me deeply. She taught me the meaning of dedication, not through words but through her quiet constancy—the small routines, the little rituals that, to me, became as familiar as her hands. In her way of moving through life with gentleness and resilience, she showed me that strength doesn’t have to be loud, that love doesn’t have to be grand to be unbreakable.\n\nIn those years, I thought I was only trying to find myself, to carve out a place in a chaotic world. But maybe, without knowing it, she was guiding me all along, her love a quiet reminder that there was something to return to, a place where I didn’t have to be anything but myself. And in her presence, I discovered that true loyalty is simply the willingness to be there, day after day, a quiet strength to lean on.",
  "Death and loss linger quietly in the spaces between me and her, subtle and unspoken, like a shadow cast by the passing of time. They are the quiet acknowledgments we don’t speak of, yet they weave themselves into the fabric of our days together. When I was younger, the idea of her absence was distant, as if something too far away to consider. But as the years slipped by, that distance faded. I began to see, in the smallest changes, a fragile reminder that time is moving us forward, carrying us to a point where she might only live in memory.\n\nThere’s a quiet fear that accompanies this awareness, a slow realization that with every shared day, the time left grows shorter. I find myself noticing details I never paid attention to before: the traces of aging on her face are deepening, the pace of her steps slowing, and her hearing is getting worse... There’s something grounding and yet painfully fleeting in each of these moments, as if they are gentle warnings that our moments together are finite.\n\nSometimes I imagine her thinking of those she has already lost, the quiet way she remembers them without a word. She lets their memory linger in the silence, as if holding their presence within her. I wonder if one day, I will remember her the same way—if her absence will sit in the small, ordinary spaces she once filled, leaving an ache softened only by memory.\n\nI want to somehow outpace loss, to hold her closer, to keep her presence from fading, as though by remembering every detail I can somehow preserve her against the tide of time. There is a kind of eternity in memory, in the scattered fragments she will leave behind—a comfort, perhaps, in knowing that as long as I remember, she will never truly be gone."
];

let baseWidth = 1200; // Original canvas width
let baseHeight = 849; // Original canvas height

function preload() {
  customFont = loadFont('assets/Newsreader-Medium.ttf');
  polaroidIcon = loadImage('assets/polaroid.png');
  
  // Load other assets
  backdrops.push(loadImage('assets/backdrop1.png'));
  backdrops.push(loadImage('assets/backdrop2.png'));
  backdrops.push(loadImage('assets/backdrop3.png'));

  for (let i = 1; i <= 15; i++) {
    photos.push(loadImage(`assets/photo${i}.PNG`));
    highlights.push(loadImage(`assets/highlight${i}.png`));
    hotspots.push(loadImage(`assets/hotspot${i}.png`));
    iconImages.push(loadImage(`assets/icon${i}.png`));
  }
}

function setup() {
  scaleFactor = min(windowWidth / canvasWidth, windowHeight / canvasHeight);
  createCanvas(canvasWidth * scaleFactor, canvasHeight * scaleFactor);

  currentBackdrop = backdrops[0]; // Initialize currentBackdrop
  setupIcons(); // Initialize icons
}

function draw() {
  // Ensure scaleFactor is valid before scaling
  if (isNaN(scaleFactor) || scaleFactor <= 0) {
    console.error("Invalid scaleFactor. Skipping draw loop.");
    return;
  }

  scale(scaleFactor); // Scale everything proportionally

  // Render based on the current stage
  if (stage === "landing") {
    drawLandingPage();
  } else if (stage === "secondPage") {
    drawSecondPage();
  } else if (stage === "thirdPage") {
    drawThirdPage();
  }

  // Draw back button last if not on the landing page
  if (stage !== "landing") {
    drawBackButton();
  }
}

function windowResized() {
  let newHeight = windowWidth / canvasAspect; // Maintain the aspect ratio
  resizeCanvas(windowWidth, newHeight);

  // Recalculate the scaling factor
  scaleFactor = min(windowWidth / baseWidth, windowHeight / baseHeight);

  // Dynamically update icon positions and sizes
  icons.forEach((icon) => {
    let centerX = width / 2;
    let centerY = height / 2;
    let radius = min(width, height) * 0.35;
    let angle = (TWO_PI / 15) * icon.id;
    icon.x = centerX + radius * cos(angle);
    icon.y = centerY + radius * sin(angle);
    icon.size = 100 * scaleFactor; // Adjust size dynamically
  });
}

// ICON SETUP
function setupIcons() {
  icons = []; // Reset icons array
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = min(width, height) * 0.35;
  let baseSizes = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  let scaledSizes = baseSizes.map((size) => size * scaleFactor);

  for (let i = 0; i < 15; i++) {
    let angle = (TWO_PI / 15) * i;
    let x = centerX + radius * cos(angle);
    let y = centerY + radius * sin(angle);

    let section = floor(i / 5);
    icons.push({ x, y, size: scaledSizes[i], section, id: i });
  }
}

// LANDING PAGE
function drawLandingPage() {
  // Ensure the current backdrop is loaded
  if (!currentBackdrop) {
    console.error("Current backdrop is undefined. Skipping drawLandingPage.");
    return;
  }

  // Update the backdrop based on hover state
  updateLandingBackdrop();

  // Draw the backdrop
  image(currentBackdrop, 0, 0, width, height);

  // If text display is active, dim the backdrop
  if (displayText) {
    push();
    fill(0, 150); // Black with 150/255 transparency
    rect(0, 0, width, height); // Cover the entire canvas
    pop();
  }

  // Calculate the center of the circle
  let centerX = width / 2;
  let centerY = height / 2;

  // Draw the 15 icons only if text is not displayed
  if (!displayText) {
    icons.forEach((icon, index) => {
      if (iconImages[index]) {
        image(
          iconImages[index],
          icon.x - icon.size / 2,
          icon.y - icon.size / 2,
          icon.size,
          icon.size
        );
      } else {
        console.error(`Icon image ${index} is undefined.`);
      }
    });
  }

  // Draw the polaroid icon at the center of the frame
  let polaroidSize = 100; // Adjust size as needed
  let polaroidAspectRatio = polaroidIcon.height / polaroidIcon.width; // Preserve aspect ratio
  let polaroidHeight = polaroidSize * polaroidAspectRatio; // Calculate height
  let polaroidWidth = polaroidSize; // Maintain the width based on aspect ratio
  let polaroidX = centerX - polaroidWidth / 2; // Center horizontally
  let polaroidY = centerY - polaroidHeight / 2; // Center vertically
  image(polaroidIcon, polaroidX, polaroidY, polaroidWidth, polaroidHeight);

  // If text display is active, draw section-specific text
  if (displayText) {
    fill(255); // White text
    textFont(customFont); // Use the custom font
    textSize(16); // Adjust size as needed
    textAlign(CENTER, CENTER);

    // Determine which section's text to show based on the current backdrop
    let sectionIndex =
      currentBackdrop === backdrops[0]
        ? 0
        : currentBackdrop === backdrops[1]
        ? 1
        : 2;

    // Draw the text centered based on the circle's center
    text(
      sectionTexts[sectionIndex],
      centerX - width * 0.4, // Text block starts slightly left of the circle center
      centerY - height * 0.4, // Text block starts slightly above the circle center
      width * 0.8, // Text block width (80% of the canvas)
      height * 0.8 // Text block height (80% of the canvas)
    );
  }
}

function updateLandingBackdrop() {
  let hoveredSection = null;

  // Check if the mouse is hovering over any icon
  icons.forEach((icon) => {
    if (dist(mouseX / scaleFactor, mouseY / scaleFactor, icon.x, icon.y) < icon.size / 2) {
      hoveredSection = icon.section;
    }
  });

  // Update the backdrop based on the hovered section
  if (hoveredSection !== null) {
    currentBackdrop = backdrops[hoveredSection];
  }
}

// PHOTO PAGE
function drawSecondPage() {
  // Display the photo as the background
  image(photos[currentIcon], 0, 0, width, height);

  // Remove any visualization of the hotspot, even in debug mode
  if (debugMode) {
    console.log("Debug Mode: Hotspot active but not rendered visually.");
  }
}

function drawThirdPage() {
  // Display the original photo as the background without blur
  image(photos[currentIcon], 0, 0, width, height);

  // Overlay the highlight image
  image(highlights[currentIcon], 0, 0, width, height);
}


// BACK BUTTON
function drawBackButton() {
  push();
  fill(255); // Pure white arrow
  noStroke();
  translate(30, 30); // Adjust to match clickable area positioning

  // Draw the arrow
  beginShape();
  vertex(0, 0); // Arrow tip
  vertex(20, -10); // Top corner
  vertex(20, -5); // Top mid
  vertex(40, -5); // Top of shaft
  vertex(40, 5); // Bottom of shaft
  vertex(20, 5); // Bottom mid
  vertex(20, 10); // Bottom corner
  endShape(CLOSE);
  pop();

  // Invisible clickable rectangle for easier interaction
  push();
  noFill();
  noStroke();
  rectMode(CORNER); // Match the button's positioning
  rect(20, 20, 60, 60); // Match the click area
  pop();
}

// MOUSE EVENTS
function mousePressed() {
  // Scale mouse coordinates to the original canvas size
  let scaledMouseX = mouseX / scaleFactor;
  let scaledMouseY = mouseY / scaleFactor;

function goBack() {
  if (stage === "thirdPage") {
    stage = "secondPage"; // Go back to the second page
  } else if (stage === "secondPage") {
    stage = "landing"; // Go back to the landing page
  }
  console.log(`Returning to stage: ${stage}`);
}

// Check if the back button is clicked
  let backButtonSize = 60; // Match the clickable area size
  if (
    scaledMouseX > 20 &&
    scaledMouseX < 20 + backButtonSize &&
    scaledMouseY > 20 &&
    scaledMouseY < 20 + backButtonSize
  ) {
    goBack(); // Call the goBack function
    return;
  }
  
// Check if the polaroid icon is clicked
  let polaroidSize = 100; // Polaroid width (set in drawLandingPage)
  let polaroidAspectRatio = polaroidIcon.height / polaroidIcon.width;
  let polaroidHeight = polaroidSize * polaroidAspectRatio;

  let polaroidX = width / 2 - polaroidSize / 2; // Center horizontally
  let polaroidY = height / 2 - polaroidHeight / 2; // Center vertically

  if (
    scaledMouseX > polaroidX &&
    scaledMouseX < polaroidX + polaroidSize &&
    scaledMouseY > polaroidY &&
    scaledMouseY < polaroidY + polaroidHeight
  ) {
    // Toggle text display and icons
    displayText = !displayText;
    return;
  }
  
  // Handle other interactions based on the current stage
  if (stage === "secondPage") {
    checkHotspotClick(scaledMouseX, scaledMouseY); // Check hotspot clicks
  } else if (stage === "landing" && !displayText) {
    icons.forEach((icon) => {
      if (dist(scaledMouseX, scaledMouseY, icon.x, icon.y) < icon.size / 2) {
        currentIcon = icon.id;
        stage = "secondPage"; // Go to the second page
      }
    });
  }
}

// HOTSPOT CHECK
function checkHotspotClick(scaledMouseX, scaledMouseY) {
  if (!hotspots[currentIcon]) {
    console.error(`Hotspot for currentIcon ${currentIcon} is undefined.`);
    return;
  }

  // Dimensions of the hotspot image
  let hotspotWidth = hotspots[currentIcon].width;
  let hotspotHeight = hotspots[currentIcon].height;

  // Map the mouse coordinates from the canvas to the hotspot image
  let mappedX = (scaledMouseX / width) * hotspotWidth;
  let mappedY = (scaledMouseY / height) * hotspotHeight;

  // Load the pixel data of the hotspot
  hotspots[currentIcon].loadPixels();

  // Calculate the pixel index in the hotspot image
  let pixelIndex = (floor(mappedY) * hotspotWidth + floor(mappedX)) * 4;

  // Ensure the index is within bounds
  if (pixelIndex < 0 || pixelIndex >= hotspots[currentIcon].pixels.length) {
    console.error(`Pixel index ${pixelIndex} is out of bounds.`);
    return;
  }

  // Check the alpha value at the clicked location
  let alphaValue = hotspots[currentIcon].pixels[pixelIndex + 3];

  if (alphaValue > 0) {
    console.log("Hotspot clicked! Transitioning to the third page.");
    stage = "thirdPage";
  } else {
    console.log("Click was not on a hotspot.");
  }
}