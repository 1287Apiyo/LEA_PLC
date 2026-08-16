// Per-lesson assignment prompts for the LEA Labs courses.
// Flat map: lessonId -> assignment text (mini-markdown, see FORMAT.md markers).
// The seed script merges these into each course's lessons before writing.
export default {
  /* ------------------------------ Web Development ------------------------------ */
  "web-1": `# Your mission: explain the web like a superhero

You just learned the secret of the web — how your message travels from your computer to a far-away server and back. Now it's your turn to teach it.

- [ ] Write **five sentences** explaining what happens when you type a web address. Use the words **URL**, **DNS**, **server** and **browser**.
- [ ] Draw a simple picture of the journey: your computer → internet → server → back again. Add arrows and labels.
- [ ] Read your explanation to a friend or family member. If they can repeat one fact back to you, you win!

> **Stuck?** Pretend the server is a bakery and your browser is the hungry customer — the DNS is the address book that finds the bakery.

- [ ] Bonus: can you name the three parts of a web address (like https://www.example.com)?`,
  "web-2": `# Your mission: build your very first web page

Time to create something real! Your first HTML page — your name, your school, one thing you love.

- [ ] Open the coding workspace and start with the full HTML skeleton: **<!DOCTYPE html>**, **<html>**, **<head>**, **<body>**.
- [ ] Add a **<title>** with your page name inside the head.
- [ ] Add an **<h1>** heading with your name.
- [ ] Add a **<p>** paragraph: your school or your favourite subject.
- [ ] Add one more **<h2>** heading with "My favourite things" and a **<p>** under it.
- [ ] Run it. Check that every tag you opened has a closing tag — yes, every single one!
- [ ] Show your page to someone and tell them: "I made this page with my own code!"`,
  "web-3": `# Your mission: the link explorer

Your page needs friends — links to other pages and a picture to make it pop.

- [ ] Add a link to a website you love using **<a href="...">** — make sure the text you click says something clear, like "Visit Scratch".
- [ ] Add a second link that opens in a new tab using **target="_blank"**.
- [ ] Add an image with **<img src="..." alt="...">**. Give it a good **alt** description — imagine describing the picture to a friend over the phone.
- [ ] Turn one of your paragraphs into a link to a page you build yourself: make a second page called about.html and link them together.
- [ ] Test both links — click them and make sure they work.
- [ ] Check your alt text on all images. If an image ever breaks, your alt text saves the day!`,
  "web-4": `# Your mission: make your page beautiful

Your page works — now make it look amazing! Time to dress it up with CSS.

- [ ] Give your page a **background-color** you love.
- [ ] Change your **h1** colour with **color** and make it bigger with **font-size**.
- [ ] Pick a nicer **font-family** for your headings (try a few and compare).
- [ ] Add **margin** around your headings and **padding** inside a box you create.
- [ ] Wrap your content in a **div** and give it a background colour, rounded corners and padding — instant card!
- [ ] Check your page in light and dark looks — make sure text is always readable against its background.
- [ ] Show two different colour versions to a friend and ask which they like best.`,
  "web-5": `# Your mission: the flexbox navy

Learn to command your layout! Flexbox is your superpower for arranging things in rows and columns.

- [ ] Build a simple navigation bar: a **nav** with three links inside.
- [ ] Make the nav a flex container: **display: flex** on the parent.
- [ ] Spread the links out with **justify-content: space-between** — watch them magically space apart!
- [ ] Centre them with **justify-content: center** — see how one tiny change moves everything.
- [ ] Make a row of three cards using **flex** and **gap** so they never touch.
- [ ] Switch the direction with **flex-direction: column** and watch the row become a stack.
- [ ] Challenge: make a photo gallery with 6 images in a neat row of 3.`,
  "web-6": `# Your mission: launch day!

Your site is finished. Time to send it into the world — just like a real developer!

- [ ] Ask a parent or guardian to help you (publishing needs a grown-up's account).
- [ ] Put your site on **GitHub Pages** or **Netlify** following the steps from the lesson.
- [ ] Open your live link on **two different devices** (phone + computer) and check it looks good.
- [ ] Share your link with three people — family, friends, your teacher.
- [ ] Collect one piece of feedback and use it to make your site even better.
- [ ] Add your live link to your notes so you never lose it. Congratulations, developer!`,
  /* ------------------------------- Scratch ------------------------------------- */
  "scr-1": `# Your mission: scout the Scratch playground

Welcome, explorer! Your first mission is to get to know your new playground.

- [ ] Open the Scratch editor and find the **four zones**: stage, sprites, block palette, and scripts area.
- [ ] Click through **three different categories** in the block palette. What colour is each one?
- [ ] Drag a **"when flag clicked"** block onto the scripts area.
- [ ] Snap a **"say Hello!"** block under it.
- [ ] Click the **green flag** and watch your sprite say hello!
- [ ] Explain to a friend: "The green flag starts my program, the red stop button stops it."
- [ ] Bonus: what happens if you press the red stop button in the middle of a program?`,
  "scr-2": `# Your mission: cast your characters

Every great show needs great characters and a great stage. Cast yours!

- [ ] Pick a sprite you love from the sprite library (or draw your own!).
- [ ] Give your sprite **two costumes** — maybe one with a hat and one without.
- [ ] Switch costumes with a **"next costume"** block and watch your sprite change.
- [ ] Choose a **backdrop** that matches your story — space, castle, jungle, anywhere!
- [ ] Try the **"switch costume to"** block with your costume's name.
- [ ] Bonus challenge: make your sprite switch costume every time you click the green flag.
- [ ] Show your cast to a friend — tell them the story your characters will star in.`,
  "scr-3": `# Your mission: make it move and talk

Now your sprite becomes an actor — moving, spinning, speaking and growing!

- [ ] Start with **"when flag clicked"**.
- [ ] Add **"move 10 steps"** — click the flag, watch it walk.
- [ ] Add **"turn 15 degrees"** — now it spins! Change the number and see what happens.
- [ ] Add **"say Hello!"** and give your sprite a voice.
- [ ] Add **"change size by 10"** — your sprite is growing!
- [ ] Test your script a few times. What happens when your sprite reaches the edge of the stage?
- [ ] Challenge: write a script that moves the sprite in a square. (Hint: move, turn, repeat…).`,
  "scr-4": `# Your mission: events and the loop machine

Computers love repeating things — and so will your sprite once you learn loops!

- [ ] Build a **"when flag clicked"** script with a **"repeat 10"** block around a move and turn.
- [ ] Run it — count how many times your sprite moves. Is it 10?
- [ ] Swap **"repeat 10"** for **"forever"** — press the red stop button to escape the loop!
- [ ] Add a **"when space key pressed"** block that makes your sprite say "Boo!".
- [ ] Use **"broadcast"** — send a message and make another part of your project react.
- [ ] Build a dance: a forever loop with moves and costume changes, kicked off by a flag event.
- [ ] Challenge: make two sprites dance together using broadcasts.`,
  "scr-5": `# Your mission: direct your animated story

Lights, camera, action! Time to produce your own animated story with characters, scenes and dialogue.

1. Plan your story on paper: **who** are the characters, **where** does it happen, **what happens** in the beginning, middle and end?
2. Set up your sprites and a backdrop for scene one.
3. Write dialogue with **say** blocks — don't forget **wait** blocks so the lines don't rush past each other.
4. Switch scenes by **switching backdrops** (or use **broadcast** to trigger scene changes).
5. Add at least **two movements** — a walk, a spin, a jump.
6. Watch the whole story from start to finish, then fix anything that feels off.
7. Give your story a title and present it to an audience of one (a friend, sibling or grown-up).`,
  "scr-6": `# Your mission: share your creation with the world

Your project deserves an audience! Time to publish it like a real creator.

- [ ] Give your project a **catchy name**.
- [ ] Click **Share** on the Scratch website (with a grown-up's help if needed).
- [ ] Write clear **instructions** — how do you play or watch your project? What keys do you press?
- [ ] Write **notes and credits** — where did your idea come from? Did anyone help you?
- [ ] Add your project to a **studio** about your theme.
- [ ] Ask two friends to try it and leave a comment.
- [ ] Read their feedback and make **one improvement** to your project.
- [ ] Bonus: find another creator's project and leave a kind, helpful comment.`,
  /* ------------------------------ App Development ------------------------------ */
  "app-1": `# Your mission: the app idea blueprint

Every amazing app starts as an idea. Time to invent yours!

- [ ] Pick an app idea that solves a **real problem** — something annoying in your daily life.
- [ ] Write one sentence: "My app helps people by…"
- [ ] List the **three most important screens** your app needs.
- [ ] List **three features** your app must have (and three it definitely does NOT need).
- [ ] Who is your app for? Name your audience in one sentence.
- [ ] Sketch the app's name and a simple icon idea.
- [ ] Pitch your idea to a friend in 30 seconds. If they say "I'd use that!", you're onto something.`,
  "app-2": `# Your mission: the screen designer

Before any code, great apps are drawn on paper. Grab a pencil!

1. Take a blank sheet of paper — or three! Draw the **home screen** of your app: title, buttons, images.
2. Draw a **second screen** (e.g. a detail or settings screen).
3. Draw a **third screen** — what happens when something goes wrong (an error or empty screen)?
4. Draw arrows showing how users move between screens — that's your **navigation flow**.
5. Check: are the buttons big enough to tap with a thumb? Is the text easy to read?
6. Show your wireframes to a friend. Ask: "Where would you tap first?"
7. Redraw anything they found confusing. Designers do this all the time!`,
  "app-3": `# Your mission: make it respond

Time to make your app interactive — buttons that do things when you tap them!

- [ ] Add a **button** to your screen with a clear label like "Tap me!".
- [ ] Connect an **event** to the button — when it's tapped, something must happen.
- [ ] Make the button change a **label's text** when tapped (like a counter or a greeting).
- [ ] Add a **text input** where the user can type their name.
- [ ] Make your app say "Hello, [name]!" using the typed text.
- [ ] Test every control — what happens if you tap the button five times fast?
- [ ] Challenge: add a sound or a colour change when the button is tapped.`,
  "app-4": `# Your mission: talk to the web

Your app is about to get superpowers — fetching real data from the internet!

- [ ] Pick a fun public API (like a joke or advice API).
- [ ] Use **fetch()** to request data from the API in your code.
- [ ] Handle the response and **turn it into JSON**.
- [ ] Pull out the piece of data you want and **display it** on the screen.
- [ ] Add a button that fetches a **new** piece of data every time it's tapped.
- [ ] Test what happens when there's **no internet** — does your app handle it gracefully?
- [ ] Challenge: show a loading message while the data is coming.`,
  "app-5": `# Your mission: the bug hunter

Real developers spend a LOT of time testing. Now it's your turn to hunt bugs!

- [ ] Run your app on a **real device** (or the closest thing you have — an emulator works too).
- [ ] Tap through every screen and every button. Write down **everything** that misbehaves.
- [ ] Find at least **two bugs** — a crash, a wrong answer, a button that does nothing, a screen that looks broken.
- [ ] Fix bug number one. Test it again.
- [ ] Fix bug number two. Test it again.
- [ ] Ask a friend to use your app and watch what they do — you'll spot issues you never noticed.
- [ ] Finish with a short list: "I found and fixed these bugs today."`,
  "app-6": `# Your mission: get ready for launch

Your app is done and tested — time to prepare it for the world!

- [ ] Write a **one-line description** of your app (make it exciting but honest).
- [ ] Design a **launch icon** — simple, readable, recognisable.
- [ ] Take (or sketch) **three screenshots** showing your app's best screens.
- [ ] Write the **long description** for the store page — what does your app do, who is it for, why is it great?
- [ ] List the **categories** your app fits into.
- [ ] With a grown-up, look at what a real app release needs (accounts, fees, review).
- [ ] Write your launch checklist and put the date you'd love to launch.`,
  /* --------------------------- Basic Computer Skills --------------------------- */
  "bc-1": `# Your mission: the computer tour guide

You now know the crew — monitor, keyboard, mouse and the CPU. Give the tour!

- [ ] Point to **five parts** of a real computer and name them out loud.
- [ ] For each part, say one thing it does (the CPU thinks, the monitor shows…).
- [ ] Sort your parts into **input** (things you give the computer) and **output** (things the computer gives you).
- [ ] Find one extra part not in the lesson — a speaker, webcam, printer — and say what it does.
- [ ] Quiz a friend or family member: "What's the brain of the computer?"
- [ ] Draw your dream computer setup and label every part.`,
  "bc-2": `# Your mission: keyboard and mouse master

Your hands are about to become super-skilled. Time to drill like a pro!

- [ ] Practise **touch typing** for 5 minutes — keep your fingers on the home row!
- [ ] Type your name, your school and one sentence without looking down (as much as you can!).
- [ ] Practise **left click**, **right click** and **double-click** — find a file and open it with a double-click.
- [ ] Practise **drag and drop**: move a file into a folder using only the mouse.
- [ ] Use the **scroll wheel** to scroll a long page up and down smoothly.
- [ ] Try three keyboard shortcuts: **Ctrl+C**, **Ctrl+V** and **Ctrl+Z** — undo is magic!
- [ ] Sit up straight, elbows relaxed, and check your wrist position.`,
  "bc-3": `# Your mission: the file organiser

Messy files are a disaster waiting to happen. Become the organiser!

- [ ] Create **three folders** with clear names: School, Games, Projects.
- [ ] Create a new document and **save it** into the right folder. Give it a name you'll remember in a month!
- [ ] Move two existing files into folders where they belong (drag and drop!).
- [ ] **Rename** one file so its name tells you exactly what's inside.
- [ ] Use **search** to find a file you can't remember where you put it.
- [ ] Check what happens when you delete a file — find the **Recycle Bin** (it's a safety net!).
- [ ] Bonus: back up one important file to a USB stick or the cloud.`,
  "bc-4": `# Your mission: the email master

Email is how the world talks. Write your first proper message!

- [ ] With a trusted adult, open your email (or a practice account).
- [ ] Compose a new email and fill in the **To** address, a clear **Subject**, and a friendly **message**.
- [ ] Send it to someone you trust — then check it arrived in their inbox.
- [ ] **Reply** to their reply, and explain the difference between Reply and Reply All.
- [ ] **Attach a file** (like a drawing or photo) to an email.
- [ ] Check your **spam or junk** folder — see how the filter works.
- [ ] Rule to remember: never open attachments or links from strangers, and never share your password.`,
  "bc-5": `# Your mission: the safety agent

The internet is amazing — and you're the one in charge of staying safe on it.

- [ ] Invent a **super-strong password**: a long passphrase with letters, numbers and a symbol. (Example style: "BlueRocket#Jump42!")
- [ ] Write down the three golden rules: don't share personal info, don't talk to strangers, tell a trusted adult if something feels wrong.
- [ ] Spot-the-scam: find **two** suspicious messages or pop-ups (or make up two examples) and explain why they're tricks.
- [ ] Practise saying **no** — a fake message says you won a prize and needs your address. What do you do?
- [ ] Tell a trusted adult your new safety rules.
- [ ] Bonus: help a younger family member learn one safety rule.`,
  "bc-6": `# Your mission: the network engineer

Time to connect! Get a device online and understand the magic behind it.

- [ ] Find the **router** or modem at home and say what it does.
- [ ] Check the Wi-Fi settings on a device — can you see your network's name?
- [ ] Connect a device to Wi-Fi (or reconnect) by choosing the network and typing the password.
- [ ] Explain the difference between **Wi-Fi** (wireless, close by) and **mobile data** (uses the phone network).
- [ ] Open a website and watch the loading — that's your data travelling the internet!
- [ ] Think about what happens when the internet is slow: is it the network, the device, or the website?
- [ ] Draw your home network: internet → router → your devices.`,
};
