export default {
  id: "crs-web",
  lessons: [
    {
      id: "web-1",
      title: "How the web works",
      duration_minutes: 8,
      description: "What happens when you type a web address — browsers, servers and URLs.",
      order: 1,
      video_url: "https://www.youtube.com/watch?v=oWfjXbUNxCg",
      notes: `# Why this matters

Have you ever typed something like "google.com" into a browser and watched a whole page appear in less than a second? It feels like magic, but behind the scenes there is a clever system that finds, fetches, and builds the page just for you. Understanding how that system works is like learning the secret handshake of the internet. Once you know it, you will never look at a web page the same way again.

Think of the web as a giant library spread across thousands of computers all over the world. Your browser is your personal librarian. When you ask for a book — a web page — your librarian knows exactly how to find it, bring it back, and lay it out on your desk so you can read it. In this lesson, you are going to meet every character in that story: browsers, URLs, servers, and the messages they send to each other. By the end, you will be able to explain the journey of a single click from start to finish.

# What you'll learn

- What a browser really does when you type a web address
- How URLs work and what each part means
- What DNS is and why it is called the internet's address book
- How your computer talks to a server using HTTP requests and responses
- How a browser turns raw code into the colourful pages you see

# Let's learn

## The cast of characters

Before we follow a web page on its journey, let us meet the four main players. First, there is the **browser** — the program you use to visit websites, like Chrome, Firefox, Safari, or Edge. The browser is your window to the web. Second, there is the **URL**, which stands for Uniform Resource Locator. A URL is simply the address you type into the browser bar, like \`https://www.example.com/cats\`. Third, we have **DNS**, the Domain Name System. DNS is a massive address book that turns human-friendly names like "example.com" into computer-friendly numbers called IP addresses. Fourth, there is the **server** — a powerful computer somewhere in the world that stores the website's files and sends them out when people ask.

## Step by step: the journey of a click

Let us type \`https://www.funkyscience.org/dinosaurs\` into the browser bar and press Enter. Here is exactly what happens, step by step.

**Step 1 — Parsing the URL.** The browser looks at your URL and splits it into pieces. The \`https://\` part tells the browser which language to use when talking to the server. HTTPS is the secure version of HTTP, which stands for HyperText Transfer Protocol. Think of it as agreeing to speak English before you start a conversation. The \`www.funkyscience.org\` part is the domain name, which tells the browser whose computer to contact. The \`/dinosaurs\` part is the path, which tells the server which specific page you want, just like asking for the dinosaurs section in a library.

**Step 2 — DNS lookup.** Your browser does not actually understand the name "funkyscience.org". Computers talk to each other using numbers called IP addresses, which look like \`142.250.185.46\`. So the browser asks a DNS server: "Hey, what is the IP address for funkyscience.org?" The DNS server checks its enormous address book and replies with the right number. This all happens in milliseconds. If the DNS server has never heard of funkyscience.org before, it asks another DNS server, and so on, until someone knows the answer.

**Step 3 — Making the connection.** Now your browser knows the server's IP address. It reaches out across the internet and knocks on the server's door. Since we used HTTPS, the browser and server do a quick safety check — they agree on a secret code so nobody can spy on their conversation. This is called the TLS handshake, and it is why you see a little padlock icon next to HTTPS addresses.

**Step 4 — Sending the request.** The browser sends an HTTP request to the server. The request is a short message that says something like: "GET /dinosaurs HTTP/1.1 — please give me the dinosaurs page." It also includes extra details, like which browser you are using and what kind of content you can accept.

**Step 5 — The server responds.** The server reads the request, finds the right file for \`/dinosaurs\`, and sends back an HTTP response. The response starts with a status code. \`200 OK\` means everything worked. \`404 Not Found\` means the page does not exist — you have probably seen that one on a broken link. \`500 Internal Server Error\` means something broke on the server. After the status code comes the actual content — usually HTML, CSS, and JavaScript files.

**Step 6 — Rendering the page.** Your browser receives the response and starts building the page. It reads the HTML to understand the structure, then grabs any linked CSS files for styling and JavaScript files for interactivity. It assembles everything into the final page you see, placing images, colours, and text in the right spots. All of this happens in less than a second for most websites. Pretty impressive, right?

> Fun fact: the very first web page ever created is still online. It has no images, no colours — just text and blue links. Search for "world's first website" and have a look at where it all started.

# Try it yourself

- [ ] Open your browser and go to any website you like. Look at the address bar. Can you spot the protocol (\`https://\`), the domain name, and the path?
- [ ] Right-click anywhere on the page and choose "Inspect" or "Inspect Element". A panel will open up. Click the "Network" tab and then reload the page. Watch as every request flies by — each one is an HTTP request and response pair.
- [ ] Find a request in the list and click on it. Look for the status code. Can you find a \`200 OK\`?
- [ ] In the address bar, type a nonsense website name like "asdfghjkl12345.com" and press Enter. What happens? You will see a DNS error because no DNS server knows that name.
- [ ] Try visiting \`http://example.com\`. Notice how some sites still use HTTP without the S. Your browser might warn you it is not secure — that is why HTTPS was invented.

# Mini challenge

1. Open your computer's terminal or command prompt and type \`ping google.com\` and press Enter. You will see the IP address that your computer found through DNS. That number is the real address of Google's server — your browser uses it every time you visit. Try pinging a few other websites and compare their IP addresses. Share what you find with a friend or a family member and explain how DNS works in your own words. Teaching someone else is the best way to lock in what you have learned.

# Remember

- A URL is like a home address for a web page — it tells your browser exactly where to go and what to ask for.
- DNS is the internet's giant address book that turns names into numbers.
- Every time you visit a page, your browser sends an HTTP request and the server sends back an HTTP response.
- The browser takes raw code from the server and renders it into the beautiful pages you see.
- The whole journey — from typing a URL to seeing a fully-loaded page — happens in less than a second.`,
    },
    {
      id: "web-2",
      title: "Your first HTML page",
      duration_minutes: 12,
      description: "Structure a page with headings, paragraphs and the HTML skeleton.",
      order: 2,
      video_url: "https://www.youtube.com/watch?v=-kabJ8qDJ4k",
      notes: `# Why this matters

Every website you have ever visited — from video streaming platforms to online games — is built on the same foundation: HTML. HTML stands for HyperText Markup Language, and it is the skeleton of every web page. Just like your skeleton gives your body its shape and holds everything together, HTML gives a web page its structure and tells the browser where to put headings, paragraphs, images, and links.

In this lesson you are going to write your very first HTML page from scratch. It might not look like much at first — a heading, a paragraph, and a title — but this is exactly how every professional web developer starts. The pages behind the world's biggest websites all began the same way: with a blank file and a few simple tags. By the end of this lesson, you will have a complete, working HTML page that you built with your own hands. Let us get started.

# What you'll learn

- What the HTML skeleton looks like and why every page needs one
- How to use opening and closing tags to wrap your content
- How to create headings from \`<h1>\` down to \`<h6>\`
- How to write paragraphs using the \`<p>\` tag
- What nesting means and how to keep your code clean and readable

# Let's learn

## The HTML skeleton

Every HTML page starts with the same basic structure, and you will be typing it so often that it will become second nature. Here is the skeleton:

\`\`\`
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>Welcome to my first web page.</p>
  </body>
</html>
\`\`\`

Let us go through each piece. The very first line, \`<!DOCTYPE html>\`, tells the browser "this is an HTML5 document, so please render it using modern rules." Without it, older browsers might get confused and display your page in a weird compatibility mode. Always start with this line.

The \`<html>\` tag wraps the entire page. Everything you write goes inside it. Inside \`<html>\`, there are exactly two sections: \`<head>\` and \`<body>\`. Think of the head as the brain of the page and the body as, well, the body.

## The head — the brain

The \`<head>\` section contains information about the page that the user does not see directly. The most important thing inside the head is the \`<title>\` tag. Whatever you put between \`<title>\` and \`</title>\` becomes the text on the browser tab. Try it — change the title, save your file, and watch the tab text change.

The head can also contain links to CSS files, metadata for search engines, and other behind-the-scenes instructions, but for now the title is your main focus.

## The body — what people see

The \`<body>\` section is where all your visible content lives. Headings, paragraphs, images, links, lists — anything you want the user to see goes between \`<body>\` and \`</body>\`.

## Tags — the building blocks

HTML uses tags to wrap content. A tag is a keyword surrounded by angle brackets, like \`<h1>\`. Most tags come in pairs: an opening tag and a closing tag. The closing tag is the same as the opening tag but with a forward slash, like \`</h1>\`. The content goes in between. For example:

\`\`\`
<h1>This is a heading</h1>
<p>This is a paragraph.</p>
\`\`\`

Headings come in six sizes, from \`<h1>\` (the biggest and most important) down to \`<h6>\` (the smallest). Use \`<h1>\` for your page's main title and smaller headings for subsections, just like chapters and sub-chapters in a book.

> Common mistake: forgetting the closing tag. If you write \`<p>Hello\` without \`</p>\`, the browser might think everything after it is still part of the paragraph. Always check that every opening tag has a matching closing tag.

## Nesting — tags inside tags

HTML tags can go inside other HTML tags. This is called nesting. For example, a paragraph can live inside the body, and a heading can live before the paragraph. What you cannot do is overlap tags the wrong way. This is correct:

\`\`\`
<body><p>Hello</p></body>
\`\`\`

This is wrong:

\`\`\`
<body><p>Hello</body></p>
\`\`\`

Think of nesting like Russian dolls — you must close the inner doll before you close the outer one. The browser gets confused when tags overlap, and your page might not display correctly.

> Watch out: some tags are self-closing, meaning they do not need a separate closing tag. You will meet the most famous one — \`<img>\` — in the next lesson. For now, assume every tag needs a closing partner.

# Try it yourself

- [ ] Open your HTML workspace — the editor built into this course — and type out the complete HTML skeleton shown above, from \`<!DOCTYPE html>\` all the way to \`</html>\`.
- [ ] Change the title inside \`<title>\` to something fun and personal, like "Sarah's Awesome Page".
- [ ] Inside the body, add at least two more headings — try \`<h2>\` and \`<h3>\` — each with its own text.
- [ ] Write two or three paragraphs using \`<p>\` tags. Write about your favourite hobby, game, or animal.
- [ ] Run your code and look at the result. Do all your headings and paragraphs show up on the page? Does the title appear on the browser tab?
- [ ] Deliberately break something — delete a closing tag. Run the code and see what happens. Then fix it, and remember: bugs are just puzzles waiting to be solved.

# Mini challenge

1. Create a tiny "About Me" page that uses every heading level from \`<h1>\` to \`<h6>\`. Make \`<h1>\` your name, \`<h2>\` your age, \`<h3>\` your favourite colour, and keep going with smaller and smaller details about yourself. Add at least two paragraphs describing what you love about coding and why you want to learn web development. When you are done, show the page to someone in your house and ask them to guess which heading level is which. Can they tell h4 from h5 just by looking?

# Remember

- Every HTML page needs a \`<!DOCTYPE html>\` declaration, an \`<html>\` wrapper, and \`<head>\` and \`<body>\` sections.
- Tags come in pairs — an opening tag and a closing tag — and your content sits between them.
- Headings range from \`<h1>\` (biggest) to \`<h6>\` (smallest) and give your page structure.
- Paragraphs use \`<p>\` tags and handle all your body text.
- Nest tags cleanly — always close the inner tag before the outer tag.`,
    },
    {
      id: "web-3",
      title: "Text, links and images",
      duration_minutes: 14,
      description: "Add content to your page and link it to other pages and resources.",
      order: 3,
      video_url: "https://www.youtube.com/watch?v=dJe2BEAry_w",
      notes: `# Why this matters

A web page with only headings and paragraphs is like a book with no page numbers and no pictures — you can read it, but you cannot jump around, and it is not very exciting to look at. Links and images are what turn a plain document into a real web page. Links are the threads that tie the whole web together, letting you click from one page to another, from one site to another, across the entire internet. Images bring your pages to life with photos, drawings, icons, and illustrations.

In this lesson you are going to add two superpowers to your HTML toolkit: the \`<a>\` tag for creating links and the \`<img>\` tag for adding images. You will also learn the difference between absolute and relative paths, which is one of those skills that separates a beginner from someone who really understands how files work on the web. By the end, your pages will be connected and visual — a huge step towards building real websites.

# What you'll learn

- How to create clickable links using the \`<a>\` tag and the \`href\` attribute
- The difference between absolute links (to other websites) and relative links (to your own pages)
- How to add images with the \`<img>\` tag and the \`src\` attribute
- Why the \`alt\` attribute matters for accessibility and what to write in it
- How to link between multiple pages in your own project

# Let's learn

## The anchor tag — your ticket to anywhere

The \`<a>\` tag — short for "anchor" — creates a clickable link. It needs one special ingredient called an attribute. An attribute is extra information you put inside the opening tag to give the browser more instructions. For links, the essential attribute is \`href\`, which stands for "hypertext reference" — a fancy name for "the address to go to."

Here is a simple link:

\`\`\`
<a href="https://www.example.com">Click me!</a>
\`\`\`

The text between the opening and closing tags — "Click me!" — is what appears on the page, usually blue and underlined. When someone clicks it, the browser navigates to \`https://www.example.com\`.

> Watch out: if you forget the \`https://\` part, the browser will think you mean a file on your own computer instead of a website on the internet. Always include the full address for external links.

## Absolute versus relative links

There are two kinds of paths you can put in the \`href\` attribute. An **absolute link** is the full web address, starting with \`https://\`. You use absolute links when you want to point to a page on a completely different website, like linking to a Wikipedia article or a YouTube video.

A **relative link** points to another file in your own project. It does not start with \`https://\`. Instead, it uses the file's location relative to the current page. For example, if you have two files called \`index.html\` and \`about.html\` sitting in the same folder, you can link from one to the other like this:

\`\`\`
<a href="about.html">Learn about me</a>
\`\`\`

If the file is inside a subfolder, include the folder name: \`href="pages/contact.html"\`. If you need to go up one folder level, use two dots: \`href="../home.html"\`. Think of it like giving directions inside your own house — "go to the kitchen" (relative) instead of giving someone your full street address (absolute).

## Images — the img tag is special

The \`<img>\` tag works differently from most HTML tags. It is a **self-closing** tag, which means it does not have a separate closing tag. You write it once, and it stands alone. The \`src\` attribute tells the browser where to find the image file:

\`\`\`
<img src="cat.jpg" alt="A fluffy orange cat sleeping on a windowsill">
\`\`\`

The \`alt\` attribute provides a text description of the image. This description appears if the image fails to load, and it is read aloud by screen readers for people who cannot see the screen. Writing good alt text is a mark of a thoughtful web developer. Ask yourself: if I could not see this image, what would I need to know about it? Keep it short but descriptive.

> Pro tip: every \`<img>\` tag should have an \`alt\` attribute. If the image is purely decorative and adds no information, you can use an empty alt: \`alt=""\`. But never skip the alt attribute entirely — screen readers will read the file name instead, which sounds terrible.

## Images from the web

The \`src\` attribute can also point to an image already hosted on the internet using a full URL:

\`\`\`
<img src="https://www.example.com/photos/sunset.jpg" alt="A sunset over the ocean">
\`\`\`

This works just like linking to another website. The browser fetches the image from wherever it lives and displays it on your page. Just be aware that if that website takes the image down, your page will show a broken image icon instead.

# Try it yourself

- [ ] In your workspace, create a new HTML file called \`links.html\`. Add the full HTML skeleton — \`<!DOCTYPE html>\`, \`<html>\`, \`<head>\`, \`<title>\`, and \`<body>\`.
- [ ] Inside the body, create a heading that says "My Link Collection" using an \`<h1>\` tag.
- [ ] Add three \`<a>\` tags, each linking to a different website you like. Make the clickable text describe what the link is, like "Visit my favourite game site."
- [ ] Create a second HTML file called \`page2.html\`. Put a heading and a paragraph inside it. Then go back to \`links.html\` and add a relative link to \`page2.html\` using \`<a href="page2.html">Go to page 2</a>\`.
- [ ] Add an image to \`links.html\` using the \`<img>\` tag. You can use an image URL from the web. Make sure to include a thoughtful \`alt\` description.
- [ ] Click all your links and make sure they work. Check that clicking the relative link takes you to \`page2.html\` and that the image displays correctly. If something does not work, check your file names — they must match exactly, including capital letters.

# Mini challenge

1. Build a tiny three-page website. Page 1 is the home page with a welcome heading and links to pages 2 and 3. Page 2 is a "photo gallery" with at least three images, each with descriptive alt text. Page 3 is an "about" page with a paragraph about yourself and a link back home. Make sure every page can reach every other page through links. Test it thoroughly and then show a friend — navigate through all three pages and ask them to try it too. A website is just a collection of pages connected by links, and now you have built one.

# Remember

- Links are created with the \`<a>\` tag and the \`href\` attribute — \`href\` tells the browser where to go.
- Use absolute links (\`https://...\`) for other websites and relative links (\`page.html\`) for your own files.
- The \`<img>\` tag is self-closing and needs a \`src\` (where the image lives) and an \`alt\` (a text description).
- Alt text makes your pages accessible to everyone, including people using screen readers.
- A website is a collection of pages connected by links — now you can build one.`,
    },
    {
      id: "web-4",
      title: "Styling with CSS",
      duration_minutes: 16,
      description: "Colours, fonts and spacing — make your page look the way you want.",
      order: 4,
      video_url: "https://www.youtube.com/watch?v=Y5TYDo9Qcv4",
      notes: `# Why this matters

So far your web pages have been like a house with bare concrete walls — perfectly functional, but not exactly beautiful. CSS is what turns that concrete box into a home with paint, furniture, and style. CSS stands for Cascading Style Sheets, and it is the language that controls how your HTML looks: colours, fonts, sizes, spacing, backgrounds, and much more.

Think of it this way: if HTML is the skeleton, CSS is the skin, hair, and clothes. It is what makes every website look unique. The same HTML can look completely different with different CSS — one stylesheet can make a page look like a sleek tech company's site, and another can make it look like a playful children's book. In this lesson you will learn the basic CSS syntax and start transforming your plain pages into something you will be proud to show off.

# What you'll learn

- How CSS syntax works: selectors, properties, and values
- How to change text colour, background colour, and font family
- How to control font size, margins, and padding
- Two ways to add CSS to your HTML: the \`<style>\` tag and external \`.css\` files
- How to style multiple elements at once and target specific ones

# Let's learn

## The CSS recipe — three ingredients

Every CSS rule has three parts. Here is one:

\`\`\`
h1 {
  color: darkblue;
  font-size: 36px;
}
\`\`\`

Let us break it down. The **selector** (\`h1\`) tells the browser which HTML elements to style — in this case, all \`<h1>\` headings. The curly braces \`{ }\` wrap the styling instructions. Inside, you write **property: value** pairs, each ending with a semicolon. The property (\`color\`) is what you want to change, and the value (\`darkblue\`) is what you want to change it to.

> Common mistake: forgetting the semicolon at the end of each line. Without it, the browser might ignore that rule or apply the next rule incorrectly. Always double-check your semicolons.

## Colours and backgrounds

Colours in CSS can be written in several ways. The easiest for beginners is to use named colours like \`red\`, \`blue\`, \`green\`, \`orange\`, \`purple\`, \`gold\`, \`tomato\`, or \`teal\`. There are over 140 named colours, and you can find lists of them online.

The \`color\` property controls text colour, while \`background-color\` controls the colour behind the text. Try this:

\`\`\`
body {
  background-color: lightyellow;
  color: darkslategray;
}
\`\`\`

This gives your whole page a soft yellow background with dark grey text. Much more pleasant than the default black on white.

## Fonts and text

The \`font-family\` property lets you choose which font to use. You can specify a list of fonts, and the browser will use the first one it finds on the user's computer:

\`\`\`
p {
  font-family: Georgia, serif;
}
\`\`\`

This tells the browser "use Georgia if you have it, otherwise fall back to any serif font." Serif fonts have little decorative strokes at the ends of letters, like in a printed book. Sans-serif fonts are cleaner and more modern, like the text on most websites. Common safe choices include \`Arial, sans-serif\` and \`Georgia, serif\`.

The \`font-size\` property controls how big your text is. You can use pixels (\`px\`), which are tiny dots on the screen. A body font size of \`16px\` to \`18px\` is comfortable for reading. Headings might be \`24px\` to \`48px\`.

## Space — margin and padding

Two of the most important CSS properties are \`margin\` and \`padding\`. They both control space, but in different places. **Margin** is the space outside an element — it pushes other elements away. **Padding** is the space inside an element — it pushes the content away from the border.

Imagine a picture in a frame. The padding is the mat board between the picture and the frame. The margin is the space on the wall between this frame and the next one. Here is how you use them:

\`\`\`
h1 {
  margin-bottom: 20px;
  padding: 10px;
  background-color: lightblue;
}
\`\`\`

This puts 20 pixels of empty space below every heading, 10 pixels of padding inside the heading giving the text some breathing room, and a light blue background that extends through the padding.

## Adding CSS to your HTML

There are two main ways to connect CSS to your HTML. The first is using a \`<style>\` tag inside the \`<head>\`:

\`\`\`
<head>
  <style>
    body { background-color: mistyrose; }
    h1 { color: darkred; }
  </style>
</head>
\`\`\`

This is great when you are experimenting or building a single-page project. The second and more professional way is to write your CSS in a separate \`.css\` file and link it from your HTML:

\`\`\`
<head>
  <link rel="stylesheet" href="style.css">
</head>
\`\`\`

Then in \`style.css\`, you write only CSS rules — no HTML tags needed. This approach keeps your code organised, especially as your projects grow larger. You can change the look of an entire multi-page website by editing just one CSS file.

> Pro tip: when you use an external stylesheet, make sure the \`<link>\` tag is inside the \`<head>\` section and that the \`href\` path correctly points to your CSS file. A common mistake is a typo in the file name — \`style.css\` and \`Style.css\` are different files on most web servers.

# Try it yourself

- [ ] Take the HTML page you built in an earlier lesson (or create a new one) and add a \`<style>\` block inside the \`<head>\`. Write a rule that changes the \`background-color\` of the body to a light colour you like.
- [ ] Style your \`<h1>\` heading: give it a different colour, a larger font size, and some padding so the text is not squished against the edges.
- [ ] Style all your \`<p>\` paragraphs: set a comfortable \`font-family\` (try \`Arial, sans-serif\` or \`Georgia, serif\`), a readable \`font-size\`, and a \`line-height\` of \`1.6\` for nicer spacing between lines.
- [ ] Add \`margin-bottom\` to your headings and paragraphs so they do not crowd each other.
- [ ] Create a new file called \`style.css\`, move all your CSS rules into it, and link it from your HTML using the \`<link>\` tag. Verify everything still works by running the page.
- [ ] Experiment: add a \`border\` to an element using \`border: 2px solid navy;\`. Add \`border-radius: 8px;\` to round the corners. Try different values and see what happens.

# Mini challenge

1. Design a themed page using only HTML and CSS. Pick a theme — ocean, space, jungle, candy shop, or anything you like. Use colours, fonts, and spacing to bring that theme to life. The ocean page might have a deep blue background with white text. The space page might use a black background with yellow text. Add at least five different CSS rules across at least three different types of selectors (body, headings, paragraphs). When you are done, show someone and explain how your CSS choices match your theme. The goal is to make the theme clear without reading a single word.

# Remember

- CSS uses selectors to target HTML elements and property-value pairs inside curly braces to style them.
- \`color\` changes text colour, \`background-color\` changes the background, and \`font-family\` picks your font.
- Margin is space outside an element; padding is space inside an element.
- You can embed CSS with a \`<style>\` tag or link an external \`.css\` file for bigger projects.
- A few lines of CSS can completely transform how a page looks — experiment and have fun with it.`,
    },
    {
      id: "web-5",
      title: "Layouts with Flexbox",
      duration_minutes: 18,
      description: "Arrange elements into clean rows and columns with Flexbox.",
      order: 5,
      video_url: "https://www.youtube.com/watch?v=wsTv9y931o8",
      notes: `# Why this matters

Up until now, your web pages have mostly flowed from top to bottom — heading, paragraph, image, another paragraph, all stacked in one long column. That works for simple pages, but real websites need side-by-side layouts: navigation bars, photo galleries, card grids, and columns. How do you get elements to sit next to each other instead of stacking? That is where Flexbox comes in.

Flexbox is short for "Flexible Box Layout," and it is one of the most powerful tools in modern CSS. It lets you arrange elements in rows and columns with just a few lines of code, and the browser does all the heavy maths of spacing and alignment for you. Mastering Flexbox is a rite of passage for every web developer, and once you get it, you will wonder how you ever lived without it. In this lesson you will learn the five essential Flexbox properties and use them to build a navigation bar and a card layout.

# What you'll learn

- What Flexbox is and why it makes layouts so much easier
- How to turn any container into a flex container with \`display: flex\`
- How to control the direction of items with \`flex-direction\`
- How to align and space items using \`justify-content\`, \`align-items\`, and \`gap\`
- How to build a horizontal navigation bar and a row of cards

# Let's learn

## The flex container

Flexbox works with two kinds of elements: a **flex container** and its **flex items**. The container is the parent element — you set \`display: flex\` on it, and suddenly all its direct children (the flex items) line up in clever ways. Here is the simplest possible Flexbox setup:

\`\`\`
<div class="row">
  <div class="box">One</div>
  <div class="box">Two</div>
  <div class="box">Three</div>
</div>
\`\`\`

\`\`\`
.row {
  display: flex;
}
.box {
  background-color: lightblue;
  padding: 20px;
  margin: 5px;
}
\`\`\`

That is it. With just \`display: flex\`, the three boxes that would normally stack on top of each other now sit side by side in a neat row. No floats, no tricky positioning, no headaches — just one line of CSS.

> The \`<div>\` tag is a generic container. It has no built-in meaning and no default styling, which makes it perfect for grouping elements together for layout purposes.

## Direction — which way do we flow?

By default, flex items line up from left to right in a row. But you can change that with \`flex-direction\`. The four options are \`row\` (left to right), \`row-reverse\` (right to left), \`column\` (top to bottom), and \`column-reverse\` (bottom to top). For most layouts, \`row\` and \`column\` are the ones you will use. A vertical card stack might use \`flex-direction: column\`, while a navigation bar uses the default \`row\`.

\`\`\`
.row {
  display: flex;
  flex-direction: row;
}
\`\`\`

## Alignment — the real magic

Three properties control where your flex items sit, and together they handle almost every layout you can imagine.

\`justify-content\` controls alignment along the **main axis** — the direction your items are flowing. If your flex direction is row, the main axis is horizontal. Common values:

- \`flex-start\` — items pack at the beginning
- \`center\` — items gather in the middle
- \`space-between\` — items spread out with equal gaps between them
- \`space-around\` — items have equal space around each one

\`align-items\` controls alignment along the **cross axis** — perpendicular to the main axis. If your items flow in a row, the cross axis is vertical. Common values:

- \`stretch\` — items stretch to fill the container height (the default)
- \`center\` — items sit in the middle vertically
- \`flex-start\` — items sit at the top
- \`flex-end\` — items sit at the bottom

The \`gap\` property adds consistent spacing between flex items. Instead of fiddling with margins on individual items, just set \`gap: 16px\` on the container and every item gets the same breathing room.

## A real example — navigation bar

Here is a simple navigation bar built with Flexbox. The HTML:

\`\`\`
<nav>
  <a href="#">Home</a>
  <a href="#">About</a>
  <a href="#">Gallery</a>
  <a href="#">Contact</a>
</nav>
\`\`\`

The CSS:

\`\`\`
nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #333;
  padding: 16px;
  gap: 10px;
}
nav a {
  color: white;
  text-decoration: none;
  font-family: Arial, sans-serif;
  font-size: 18px;
}
\`\`\`

The links spread evenly across the bar, are vertically centred, and have a dark background. Clean, professional, and only a handful of CSS rules.

> Pro tip: you can centre a single element perfectly inside its container using Flexbox. Set \`display: flex\`, \`justify-content: center\`, and \`align-items: center\` on the container, and your item will land smack in the middle both horizontally and vertically. This is one of the most useful Flexbox tricks.

# Try it yourself

- [ ] In your workspace, create a new HTML page with a \`<nav>\` element containing four or five \`<a>\` links, just like the example above. Add the Flexbox CSS in a \`<style>\` block inside the \`<head>\` to turn them into a horizontal navigation bar.
- [ ] Create a \`<div>\` with the class \`card-row\` and put three \`<div>\` elements inside it, each with the class \`card\`. Give each card some content — a heading and a short paragraph. Add \`display: flex\`, \`gap: 20px\`, and \`justify-content: center\` to the card row.
- [ ] Style the individual cards: give each one a \`background-color\`, \`padding: 16px\`, \`border-radius: 8px\`, and a fixed \`width\` (try \`250px\`) so they look like actual cards.
- [ ] Experiment with \`justify-content\` — try \`flex-start\`, \`center\`, \`space-between\`, and \`space-around\` and watch how the cards rearrange. Each value produces a completely different look.
- [ ] Change \`flex-direction\` to \`column\` on the card row and see what happens. Now change it back to \`row\`.

# Mini challenge

1. Build a "team section" for a pretend company website. Create a flex row of four profile cards. Each card should have a coloured background, a name in an \`<h3>\`, a job title in a \`<p>\`, and a border. Use Flexbox to space them evenly and centre-align the text inside each card. Then add a second row below using \`flex-direction: column\` containing a "Join our team" heading and a styled button (just a link with a background colour and padding). The challenge is to mix two different flex layouts on the same page. When you finish, show someone the page and walk them through which Flexbox properties you used to achieve each layout.

# Remember

- \`display: flex\` on a container turns its direct children into flexible items that can be arranged in rows or columns.
- \`flex-direction\` controls whether items flow in a row (default) or a column.
- \`justify-content\` aligns items along the main axis; \`align-items\` aligns along the cross axis.
- \`gap\` adds consistent spacing between flex items without the hassle of individual margins.
- Flexbox is the modern, clean way to build page layouts — learn it well and you will use it on almost every project.`,
    },
    {
      id: "web-6",
      title: "Publishing your site",
      duration_minutes: 10,
      description: "Put your finished site online and share the link with the world.",
      order: 6,
      video_url: "https://www.youtube.com/watch?v=-tNcdd7Xy2k",
      notes: `# Why this matters

You have built something real — HTML pages with headings, paragraphs, links, images, and beautiful CSS layouts. Until now, your website has lived only on your own computer, where nobody else can see it. That changes today. Publishing your site means putting it on the internet so anyone in the world with the link can visit it. This is the step that turns a coding exercise into a real, live website.

Sharing your work is one of the most exciting parts of building for the web. That moment when you send a link to a friend or family member and they see something you made from scratch — that feeling never gets old, even for professional developers. In this lesson you will learn how to take your HTML and CSS files and publish them on the internet using free tools that millions of developers use every day. By the end, you will have a live URL you can share with the world.

# What you'll learn

- What web hosting means and why you need it
- How to publish a website for free using GitHub Pages
- How to publish a website for free using Netlify's drag-and-drop
- What a custom domain is and how it works
- How to share your link and what to do when you update your site

# Let's learn

## What is hosting?

When you visit a website, the files — HTML, CSS, images — are stored on a server somewhere and sent to your browser when you ask for them. **Hosting** is the service of keeping those files on a server connected to the internet 24 hours a day, 7 days a week. Without hosting, your files only exist on your own computer, and nobody else can reach them.

For small projects like the ones you are building now, there are excellent free hosting options. Two of the most popular are GitHub Pages and Netlify. Both are used by professional developers for real projects, and both are simple enough that you can publish your first site in under five minutes.

## Option 1 — GitHub Pages

GitHub Pages is a free hosting service built into GitHub, which is a platform where developers store and share code. Here is the basic workflow.

First, you create a free GitHub account. Then you create a new repository — think of a repository as a project folder that lives on GitHub's servers. You upload your HTML and CSS files to the repository. Then, in the repository settings, you find the Pages section, choose which branch to publish from (usually "main"), and click Save. Within a minute, GitHub gives you a URL that usually looks like \`https://yourusername.github.io/your-repo-name\`.

That URL is your live website. Anyone who visits it will see your page. When you make changes to your files, you upload the new versions to GitHub, and GitHub Pages updates your live site automatically.

> If uploading files through the GitHub website feels slow, you can use GitHub Desktop, a free program that makes it easy to sync files between your computer and GitHub. It is worth exploring once your projects start growing.

## Option 2 — Netlify drag-and-drop

If you want something even simpler, Netlify has a drag-and-drop deploy feature. Go to the Netlify website, create a free account, and find the "Deploy manually" or drag-and-drop area on your dashboard. Take your project folder — the one with your \`index.html\` and \`style.css\` files — and drag it right onto the Netlify page.

Netlify uploads your files instantly and gives you a URL like \`https://amazing-site-abc123.netlify.app\`. You can rename this to something nicer in the site settings, like \`https://my-first-website.netlify.app\`. Every time you want to update your site, just drag and drop the folder again.

Netlify also has a feature that connects to GitHub, which works similarly to GitHub Pages but with some extra features. For now, the drag-and-drop method is the quickest way to get online.

## Custom domains

The URLs you get from GitHub Pages and Netlify are perfectly functional, but they include the platform's name. If you want your own custom web address — like \`www.sarahs-site.com\` — you can buy a domain name from a domain registrar. A domain typically costs a few dollars per year. Once you own a domain, both GitHub Pages and Netlify let you connect it to your site so that typing your custom domain brings up your pages. This is entirely optional — plenty of great sites use the free default URLs — but it is fun to know that the option exists for when you are ready.

## Sharing and updating

Once your site is live, copy the URL and send it to friends, family, classmates — anyone you want to show. Ask them to open it on their phone, on a tablet, on a different computer. Web developers call this "testing on different devices," and it is a great habit to build early. Does your layout still look good on a small screen? Are your images loading? Are your links working?

When you make improvements to your site, publish the updated files the same way you did the first time. Your site stays at the same URL — it just gets better and better with each update. That is the rhythm of web development: build, publish, share, improve, and publish again.

> Important tip: make sure your main page is named exactly \`index.html\`. Web servers look for this file first when someone visits your site's address. If your main page has a different name, visitors might see an error or a list of files instead of your beautiful home page.

# Try it yourself

- [ ] Gather all the files for your best project so far into one folder. Make sure your main page is named \`index.html\` — this is the file that hosting services look for first.
- [ ] Choose either GitHub Pages or Netlify. For GitHub Pages: create a GitHub account, make a new repository, and upload your files. Then enable GitHub Pages in the repository settings. For Netlify: create an account and drag your project folder onto the deploy area.
- [ ] Wait for your site to go live (usually under two minutes). Copy the URL it gives you.
- [ ] Open the URL in a new browser tab. Does it load? Do your styles and images show up? If something is broken, check that your file names match exactly — \`index.html\` not \`Index.html\` or \`INDEX.HTML\` (file names on most web servers are case-sensitive).
- [ ] Share the URL with at least one other person and ask them to visit on their own device. This is your first real deployment — congratulations.

# Mini challenge

1. Make a small improvement to your published site — add a new heading, change a colour, or add a new link between pages. Publish the updated version by uploading the changed files to GitHub or dragging your folder onto Netlify again. Visit your URL and confirm the change is visible to the world. Then share the link with two more people and ask each one to tell you one thing they like and one thing they would change. Real web developers collect feedback like this all the time, and it is one of the best ways to grow your skills. Write down the suggestions — they might inspire your next project.

# Remember

- Hosting puts your files on a server so anyone on the internet can visit your site.
- GitHub Pages and Netlify both offer free, beginner-friendly hosting that professionals also use.
- Your main page should be named \`index.html\` — it is the default page that web servers look for.
- A custom domain is optional and can be added later when you want a personalised web address.
- The build-publish-share-improve cycle is the heartbeat of web development — repeat it forever.`,
    },
  ],
};
