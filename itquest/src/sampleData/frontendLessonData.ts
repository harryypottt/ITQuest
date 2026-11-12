export const frontendLessons = [
  {
    id: 'frontend-1',
    thumbnail: 'https://readdy.ai/api/search-image?query=Clean%20modern%20code%20editor%20on%20a%20laptop%20screen%20showing%20colorful%20HTML%20markup%20with%20semantic%20structure%20blocks%2C%20minimal%20flat%20design%20aesthetic%2C%20soft%20natural%20lighting%2C%20light%20neutral%20background&width=640&height=360&seq=fe-thumb-1&orientation=landscape',
    title: 'Introduction to HTML',
    category: 'frontend',
    categoryName: 'Frontend Developer',
    description: 'Learn the foundations of HTML, how web pages are structured, how browsers interpret HTML, and how to create your first web page.',
    difficulty: 1,
    estimatedMinutes: 45,
    orderIndex: 1,
    prerequisites: [],
    xpReward: 80,
    icon: 'ri-html5-line',
    content: [
      { type: 'heading', content: 'What is HTML?' },
      { type: 'text', content: 'HTML stands for HyperText Markup Language. It is the standard markup language used to create and structure web pages. HTML describes the structure and meaning of content on a web page using elements such as headings, paragraphs, links, images, lists, tables, and forms.' },
      { type: 'text', content: 'HTML is not a programming language because it does not contain programming logic such as loops, conditions, or functions. Instead, HTML uses markup to tell the browser what different pieces of content are and how they are organized.' },
      { type: 'video', videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE', videoTitle: 'HTML Crash Course — Introduction to HTML for Beginners' },
      { type: 'heading', content: 'What Does HTML Do?' },
      { type: 'text', content: 'HTML provides the structure of a web page. For example, HTML can identify a piece of text as a heading, another piece as a paragraph, and another piece as a link. CSS can later be used to control how these elements look, while JavaScript can be used to make the page interactive.' },
      { type: 'text', content: 'A useful way to think about frontend development is that HTML provides the structure, CSS provides the presentation, and JavaScript provides behavior and interactivity.' },
      { type: 'code', language: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My First Web Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <p>Welcome to my first web page.</p>\n</body>\n</html>' },
      { type: 'heading', content: 'How Does a Browser Read HTML?' },
      { type: 'text', content: 'When a browser receives an HTML document, it reads the HTML markup and builds a representation of the document. The browser then uses that structure to display the web page. Different HTML elements tell the browser what type of content is being displayed.' },
      { type: 'text', content: 'Browsers such as Chrome, Firefox, Safari, and Edge interpret HTML documents and render them on the screen. HTML is therefore one of the fundamental technologies behind websites and web applications.' },
      { type: 'heading', content: 'HTML Documents' },
      { type: 'text', content: 'An HTML document is normally a text file containing HTML elements. HTML files commonly use the .html file extension. A basic HTML document contains a document type declaration, an html element, a head section, and a body section.' },
      { type: 'heading', content: 'The DOCTYPE Declaration' },
      { type: 'text', content: 'The <!DOCTYPE html> declaration tells the browser that the document is an HTML5 document. It should appear at the beginning of an HTML document before the html element.' },
      { type: 'code', language: 'html', content: '<!DOCTYPE html>' },
      { type: 'heading', content: 'The HTML Element' },
      { type: 'text', content: 'The html element is the root element of an HTML document. Other elements are placed inside it. The html element normally contains two major sections: the head and the body.' },
      { type: 'code', language: 'html', content: '<html>\n  <head>\n    <!-- Document information goes here -->\n  </head>\n  <body>\n    <!-- Visible page content goes here -->\n  </body>\n</html>' },
      { type: 'heading', content: 'The Head Element' },
      { type: 'text', content: 'The head element contains information about the document that is not normally displayed as the main page content. It can contain the page title, metadata, links to stylesheets, scripts, and other document information.' },
      { type: 'code', language: 'html', content: '<head>\n  <title>Frontend Quest</title>\n</head>' },
      { type: 'heading', content: 'The Body Element' },
      { type: 'text', content: 'The body element contains the visible content of the web page. Headings, paragraphs, images, links, buttons, lists, forms, and other visible elements are normally placed inside the body.' },
      { type: 'code', language: 'html', content: '<body>\n  <h1>Frontend Quest</h1>\n  <p>Start your HTML adventure!</p>\n</body>' },
      { type: 'heading', content: 'HTML Elements' },
      { type: 'text', content: 'HTML documents are built from elements. An HTML element is generally made up of an opening tag, content, and a closing tag. The opening and closing tags identify where the element begins and ends.' },
      { type: 'code', language: 'html', content: '<p>This is a paragraph.</p>' },
      { type: 'text', content: 'In this example, <p> is the opening tag, the text is the content, and </p> is the closing tag. Together they form a paragraph element.' },
      { type: 'heading', content: 'HTML Tags' },
      { type: 'text', content: 'HTML tags use angle brackets. Most HTML elements have an opening tag and a closing tag. The closing tag contains a forward slash before the element name.' },
      { type: 'code', language: 'html', content: '<h1>Frontend Developer</h1>\n<p>Learn the foundations of HTML.</p>' },
      { type: 'heading', content: 'Nested HTML Elements' },
      { type: 'text', content: 'HTML elements can be placed inside other HTML elements. This is called nesting. Proper nesting is important because it creates a clear structure for the browser and for developers reading the code.' },
      { type: 'code', language: 'html', content: '<body>\n  <h1>HTML Quest</h1>\n  <p>\n    Learn <strong>HTML</strong> step by step.\n  </p>\n</body>' },
      { type: 'heading', content: 'Empty Elements' },
      { type: 'text', content: 'Some HTML elements do not contain content and therefore do not require a closing tag. These are often called empty or void elements. Examples include br for a line break and img for an image.' },
      { type: 'code', language: 'html', content: '<p>First line<br>Second line</p>\n<img src="quest.png" alt="Quest icon">' },
      { type: 'heading', content: 'HTML Is Not Case Sensitive' },
      { type: 'text', content: 'HTML tag names are not case sensitive, but lowercase is the standard convention and is recommended for writing clean and consistent HTML. For example, <P> and <p> are interpreted as the same element, but <p> is the preferred style.' },
      { type: 'heading', content: 'Your First HTML Page' },
      { type: 'text', content: 'You can create a basic web page by combining the document structure, a heading, and a paragraph. This gives you the foundation for everything you will build in later frontend lessons.' },
      { type: 'code', language: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My First Quest</title>\n</head>\n<body>\n  <h1>Welcome to My Quest</h1>\n  <p>I am learning HTML!</p>\n</body>\n</html>' },
      { type: 'heading', content: 'HTML Comments' },
      { type: 'text', content: 'HTML comments allow developers to leave notes inside the source code without displaying those notes as page content. Comments are useful for explaining sections of code or temporarily documenting an idea.' },
      { type: 'code', language: 'html', content: '<!-- This is an HTML comment -->\n<h1>Frontend Quest</h1>' },
      { type: 'heading', content: 'HTML and Frontend Development' },
      { type: 'text', content: 'HTML is the starting point for frontend development. Before learning advanced styling or JavaScript interactions, it is important to understand how HTML creates the structure of a page. In the next lessons, you will learn more HTML elements and how to organize real web page content.' },
      { type: 'heading', content: 'Key Takeaways' },
      { type: 'text', content: 'HTML stands for HyperText Markup Language and is used to structure web pages. HTML documents contain elements represented by tags. The DOCTYPE declaration identifies an HTML5 document. The html element is the root of the document, the head contains document information, and the body contains visible page content. HTML elements can be nested, and some elements are empty or void elements.' },
      { type: 'tip', content: 'Think of HTML as the skeleton of a web page. Focus on creating clear structure first. You will learn CSS later to make that structure look better and JavaScript later to make it interactive.' },
    ],
  },
  {
    id: 'frontend-2',
    thumbnail: 'https://readdy.ai/api/search-image?query=Clean%20web%20layout%20design%20mockup%20with%20color%20swatches%2C%20typography%20samples%20and%20CSS%20style%20rules%2C%20minimal%20flat%20illustration%2C%20soft%20pastel%20tones%2C%20light%20neutral%20background&width=640&height=360&seq=fe-thumb-2&orientation=landscape',
    title: 'HTML Elements and Page Structure',
    category: 'frontend',
    categoryName: 'Frontend Developer',
    description: 'Learn how HTML elements work together to create structured web pages using headings, paragraphs, line breaks, and basic document organization.',
    difficulty: 1,
    estimatedMinutes: 50,
    orderIndex: 2,
    prerequisites: ['frontend-1'],
    xpReward: 90,
    icon: 'ri-layout-line',
    content: [
      { type: 'heading', content: 'Building on HTML Foundations' },
      { type: 'text', content: 'In the previous lesson, you learned that HTML provides the structure of a web page. Now it is time to work with common HTML elements and learn how they organize information. Understanding these elements will help you create readable and meaningful pages before you move on to links, images, lists, tables, and forms.' },
      { type: 'video', videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU', videoTitle: 'HTML Crash Course — Elements and Page Structure for Beginners' },
      { type: 'heading', content: 'HTML Headings' },
      { type: 'text', content: 'HTML provides six levels of headings, from h1 to h6. The h1 element represents the most important heading, while h6 represents the least important heading level. Headings help organize content into sections and create a hierarchy that makes pages easier to understand.' },
      { type: 'code', language: 'html', content: '<h1>Frontend Developer Quest</h1>\n<h2>HTML Skills</h2>\n<h3>HTML Elements</h3>\n<h4>Headings</h4>\n<h5>Paragraphs</h5>\n<h6>Practice</h6>' },
      { type: 'text', content: 'A page should generally have a clear heading structure. Do not choose heading levels only because of how large they look. Headings communicate structure and meaning, while CSS should be used when you want to control their visual appearance.' },
      { type: 'heading', content: 'The h1 Element' },
      { type: 'text', content: 'The h1 element is commonly used for the main heading of a page or major piece of content. It helps users and assistive technologies understand what the page is about.' },
      { type: 'code', language: 'html', content: '<h1>HTML Adventure</h1>' },
      { type: 'heading', content: 'The h2 and h3 Elements' },
      { type: 'text', content: 'Lower-level headings can organize sections and subsections. An h2 can introduce a major section, while an h3 can introduce a subsection inside that section.' },
      { type: 'code', language: 'html', content: '<h1>Frontend Quest</h1>\n\n<h2>HTML</h2>\n<p>Learn how web pages are structured.</p>\n\n<h2>CSS</h2>\n<p>Learn how web pages are styled.</p>\n\n<h3>CSS Colors</h3>\n<p>Learn how to work with colors.</p>' },
      { type: 'heading', content: 'HTML Paragraphs' },
      { type: 'text', content: 'The p element defines a paragraph. Paragraphs are one of the most commonly used elements because most pages contain explanatory or informational text.' },
      { type: 'code', language: 'html', content: '<p>HTML creates the structure of a web page.</p>\n<p>CSS controls presentation and layout.</p>' },
      { type: 'heading', content: 'HTML Ignores Extra Whitespace' },
      { type: 'text', content: 'Browsers normally ignore extra spaces and line breaks in HTML source code. This means writing several spaces or pressing Enter multiple times does not necessarily create the same spacing on the rendered page.' },
      { type: 'code', language: 'html', content: '<p>Hello          World</p>\n\n<p>This text\ncontains a line break in the source.</p>' },
      { type: 'text', content: 'Both examples are generally displayed with normal browser whitespace rules. If you need a specific layout or spacing, CSS is the appropriate tool.' },
      { type: 'heading', content: 'HTML Line Breaks' },
      { type: 'text', content: 'The br element creates a line break inside content. It is useful when a line break is actually part of the content, such as an address or a poem.' },
      { type: 'code', language: 'html', content: '<p>Welcome to the quest!<br>Prepare for your first challenge.</p>' },
      { type: 'heading', content: 'The Horizontal Rule' },
      { type: 'text', content: 'The hr element represents a thematic break between sections of content. Browsers commonly display it as a horizontal line, although its appearance can be changed with CSS.' },
      { type: 'code', language: 'html', content: '<h2>Quest Introduction</h2>\n<p>Learn the basics.</p>\n\n<hr>\n\n<h2>Quest Challenge</h2>\n<p>Build your first page.</p>' },
      { type: 'heading', content: 'HTML Text Formatting' },
      { type: 'text', content: 'HTML provides elements that communicate meaning or formatting for text. Common examples include strong for important text, em for emphasized text, mark for highlighted text, small for smaller side comments, and del for deleted text.' },
      { type: 'code', language: 'html', content: '<p><strong>Important:</strong> Complete this quest.</p>\n<p><em>Remember to practice.</em></p>\n<p><mark>New Quest</mark></p>\n<p><small>Optional bonus challenge.</small></p>\n<p><del>Old quest requirement.</del></p>' },
      { type: 'heading', content: 'Strong and Emphasized Text' },
      { type: 'text', content: 'The strong element indicates strong importance, while em indicates emphasis. These elements communicate meaning rather than simply telling the browser to make text bold or italic.' },
      { type: 'code', language: 'html', content: '<p><strong>Warning:</strong> Save your work.</p>\n<p>You should <em>practice</em> HTML every day.</p>' },
      { type: 'heading', content: 'HTML Quotations' },
      { type: 'text', content: 'HTML provides elements for representing quotations. The blockquote element is commonly used for longer quotations, while q can represent a short inline quotation.' },
      { type: 'code', language: 'html', content: '<blockquote>\n  The journey of a frontend developer begins with understanding the web.\n</blockquote>\n\n<p>The mentor said, <q>Keep practicing.</q></p>' },
      { type: 'heading', content: 'HTML Structure Example' },
      { type: 'text', content: 'The following example combines headings, paragraphs, emphasis, and a thematic break to create a small structured page.' },
      { type: 'code', language: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>HTML Quest</title>\n</head>\n<body>\n  <h1>Frontend Quest</h1>\n  <p>Welcome to the <strong>HTML</strong> training area.</p>\n\n  <hr>\n\n  <h2>Current Mission</h2>\n  <p>Learn how HTML elements create page structure.</p>\n  <p><em>Practice makes progress!</em></p>\n</body>\n</html>' },
      { type: 'heading', content: 'Why Structure Matters' },
      { type: 'text', content: 'Good HTML structure makes a page easier for people and software to understand. Clear headings and meaningful elements help organize information and create a foundation for accessibility, styling, search engines, and JavaScript.' },
      { type: 'heading', content: 'Preparing for the Next Quest' },
      { type: 'text', content: 'You now know how to create a basic page and organize its text content. The next step is learning how HTML attributes provide additional information about elements and how links, images, and other elements can connect pages and display media.' },
      { type: 'heading', content: 'Key Takeaways' },
      { type: 'text', content: 'HTML headings range from h1 through h6 and create a content hierarchy. Paragraphs use the p element. The br element creates a line break, while hr represents a thematic break. HTML also provides elements such as strong and em to communicate meaning in text. Good structure makes HTML easier to read, style, maintain, and use.' },
      { type: 'tip', content: 'Do not use headings just to make text look bigger. Use them to describe the structure of your content. Visual appearance can be controlled later with CSS.' },
    ],
  },
  {
    id: 'frontend-3',
    thumbnail: 'https://readdy.ai/api/search-image?query=HTML%20code%20editor%20showing%20element%20tags%20with%20highlighted%20attributes%20like%20class%20id%20and%20href%2C%20minimal%20flat%20design%20aesthetic%2C%20soft%20natural%20lighting%2C%20light%20neutral%20background&width=640&height=360&seq=fe-thumb-3&orientation=landscape&nocache=true',
    title: 'HTML Attributes and Formatting',
    category: 'frontend',
    categoryName: 'Frontend Developer',
    description: 'Learn how HTML attributes provide extra information about elements and how to work with common attributes and text formatting elements.',
    difficulty: 1,
    estimatedMinutes: 50,
    orderIndex: 3,
    prerequisites: ['frontend-2'],
    xpReward: 95,
    icon: 'ri-code-s-slash-line',
    content: [
      { type: 'heading', content: 'What Are HTML Attributes?' },
      { type: 'text', content: 'HTML attributes provide additional information about HTML elements. Attributes are written inside the opening tag and normally use a name and a value. They can control behavior, identify elements, provide alternative text, specify destinations, or give the browser additional information.' },
      { type: 'video', videoUrl: 'https://www.youtube.com/embed/N8YMl4Ezp4g', videoTitle: 'HTML Crash Course — Attributes, Links and Text Formatting' },
      { type: 'code', language: 'html', content: '<p class="quest-description">Complete your first HTML quest.</p>' },
      { type: 'text', content: 'In this example, class is the attribute name and quest-description is its value. The element still contains its normal content, but the attribute gives the element additional information.' },
      { type: 'heading', content: 'The href Attribute' },
      { type: 'text', content: 'The href attribute specifies the destination of a link created with the a element. It can point to another page, a section of the current page, or another type of supported URL.' },
      { type: 'code', language: 'html', content: '<a href="https://www.example.com">Visit Example</a>' },
      { type: 'heading', content: 'The src Attribute' },
      { type: 'text', content: 'The src attribute specifies the source of external content, such as an image. The img element uses src to tell the browser where the image file is located.' },
      { type: 'code', language: 'html', content: '<img src="quest-map.png" alt="A map of the HTML quest">' },
      { type: 'heading', content: 'The alt Attribute' },
      { type: 'text', content: 'The alt attribute provides alternative text for an image. It is important for accessibility because users who cannot see an image can still understand its purpose. Alternative text can also be displayed or used when an image cannot be loaded.' },
      { type: 'code', language: 'html', content: '<img src="hero.png" alt="Frontend developer standing beside a computer">' },
      { type: 'heading', content: 'The title Attribute' },
      { type: 'text', content: 'The title attribute can provide additional information about an element. Browsers may display the value as a tooltip when a user points to the element.' },
      { type: 'code', language: 'html', content: '<p title="HTML training information">Hover over this paragraph.</p>' },
      { type: 'heading', content: 'The class Attribute' },
      { type: 'text', content: 'The class attribute assigns one or more class names to an element. Classes are commonly used by CSS to style elements and by JavaScript to select groups of elements.' },
      { type: 'code', language: 'html', content: '<div class="quest-card">\n  <h2>HTML Quest</h2>\n  <p>+100 XP</p>\n</div>' },
      { type: 'heading', content: 'The id Attribute' },
      { type: 'text', content: 'The id attribute gives an element a unique identifier within a document. IDs are useful for linking to specific sections, styling individual elements, and selecting elements with JavaScript.' },
      { type: 'code', language: 'html', content: '<h2 id="html-quest">HTML Quest</h2>' },
      { type: 'heading', content: 'Boolean Attributes' },
      { type: 'text', content: 'Some HTML attributes are boolean attributes. Their presence represents a true state. Examples include disabled, checked, required, readonly, and multiple. These attributes do not normally need a value.' },
      { type: 'code', language: 'html', content: '<button disabled>Locked Quest</button>\n<input type="checkbox" checked>\n<input type="text" required>' },
      { type: 'heading', content: 'HTML Links' },
      { type: 'text', content: 'Links are created with the a element. A link can take a user to another page or another location. The href attribute defines where the link points.' },
      { type: 'code', language: 'html', content: '<a href="frontend-2.html">Previous Quest</a>\n<a href="frontend-4.html">Next Quest</a>' },
      { type: 'heading', content: 'Opening Links in a New Tab' },
      { type: 'text', content: 'The target attribute can control where a linked document is opened. The _blank value requests that the destination be opened in a new browsing context, commonly a new tab or window.' },
      { type: 'code', language: 'html', content: '<a href="https://www.example.com" target="_blank">Open Example</a>' },
      { type: 'heading', content: 'HTML Images' },
      { type: 'text', content: 'Images are added using the img element. The src attribute specifies the image source and alt provides alternative text. Images are empty elements, so they do not have a closing img tag.' },
      { type: 'code', language: 'html', content: '<img src="html-logo.png" alt="HTML5 logo">' },
      { type: 'heading', content: 'Image Width and Height' },
      { type: 'text', content: 'The width and height attributes can specify the displayed dimensions of an image. CSS is generally preferred when controlling responsive layouts and presentation, but these attributes can communicate the expected dimensions of an image.' },
      { type: 'code', language: 'html', content: '<img src="quest.png" alt="Quest icon" width="200" height="200">' },
      { type: 'heading', content: 'HTML Formatting Elements' },
      { type: 'text', content: 'HTML includes elements that communicate different types of text meaning or presentation. Common elements include b for attention without added importance, strong for strong importance, i for alternate voice or mood, em for emphasis, mark for highlighting, small for smaller side comments, del for deleted content, ins for inserted content, sub for subscript, and sup for superscript.' },
      { type: 'code', language: 'html', content: '<p><b>Quest:</b> HTML Basics</p>\n<p><strong>Important:</strong> Complete every challenge.</p>\n<p><i>Bonus Challenge</i></p>\n<p><em>Practice carefully.</em></p>\n<p><mark>New</mark> quest available!</p>\n<p>Reward: 100<sup>XP</sup></p>\n<p>H<sub>2</sub>O example</p>' },
      { type: 'heading', content: 'Combining Attributes' },
      { type: 'text', content: 'Real HTML elements often contain several attributes at the same time. For example, an image may have a source, alternative text, dimensions, and a class used for styling.' },
      { type: 'code', language: 'html', content: '<img\n  src="quest-map.png"\n  alt="Map showing the frontend quest path"\n  width="600"\n  class="quest-image"\n>' },
      { type: 'heading', content: 'A Complete Quest Card' },
      { type: 'text', content: 'The following example combines headings, links, images, classes, IDs, and text formatting into a small piece of structured HTML.' },
      { type: 'code', language: 'html', content: '<article id="html-quest" class="quest-card">\n  <img\n    src="html.png"\n    alt="HTML5 logo"\n    class="quest-icon"\n  >\n\n  <h2>HTML Fundamentals</h2>\n  <p>Learn the <strong>building blocks</strong> of the web.</p>\n  <p><mark>Reward:</mark> 100 XP</p>\n\n  <a href="frontend-4.html">Start Quest</a>\n</article>' },
      { type: 'heading', content: 'Why Attributes Matter' },
      { type: 'text', content: 'Attributes allow HTML elements to carry information beyond their basic element type. They connect HTML with CSS, JavaScript, accessibility features, links, media resources, and browser behavior. You will use attributes constantly as you build frontend applications.' },
      { type: 'heading', content: 'Preparing for Links, Lists, and Tables' },
      { type: 'text', content: 'You now know how elements can carry additional information through attributes. The next lesson expands your toolkit with navigation links, images, lists, tables, and other ways to organize and present information.' },
      { type: 'heading', content: 'Key Takeaways' },
      { type: 'text', content: 'HTML attributes provide additional information about elements. Common attributes include href, src, alt, title, class, id, width, height, and target. Boolean attributes such as disabled and checked represent a state through their presence. Links use a with href, while images use img with src and alt. HTML formatting elements can communicate meaning such as importance and emphasis.' },
      { type: 'tip', content: 'When adding an image, do not forget the alt attribute. When creating links, always provide a meaningful destination. When using class and id, choose names that clearly describe the element or its purpose.' },
    ],
  },
  {
    id: 'frontend-4',
    thumbnail: 'https://readdy.ai/api/search-image?query=HTML%20concept%20illustration%20showing%20hyperlink%20arrows%20connecting%20pages%2C%20bulleted%20list%20items%20and%20a%20structured%20data%20table%20grid%2C%20minimal%20flat%20design%20aesthetic%2C%20soft%20pastel%20tones%2C%20clean%20light%20background&width=640&height=360&seq=fe-thumb-4&orientation=landscape&nocache=true',
    title: 'Links, Images, Lists and Tables',
    category: 'frontend',
    categoryName: 'Frontend Developer',
    description: 'Learn how to connect pages, display images, organize information with lists, and represent structured data with HTML tables.',
    difficulty: 2,
    estimatedMinutes: 55,
    orderIndex: 4,
    prerequisites: ['frontend-3'],
    xpReward: 105,
    icon: 'ri-links-line',
    content: [
      { type: 'heading', content: 'Connecting Your Web Pages' },
      { type: 'text', content: 'A web page becomes much more useful when it can connect to other pages and resources. HTML provides links through the a element. Images allow pages to display visual content, lists organize related items, and tables represent data arranged in rows and columns.' },
      { type: 'video', videoUrl: 'https://www.youtube.com/embed/e62D-aayveY', videoTitle: 'HTML Tables, Lists and Links Explained for Beginners' },
      { type: 'heading', content: 'Creating Links' },
      { type: 'text', content: 'The a element creates a hyperlink. The href attribute specifies the destination. The text inside the element becomes the clickable link content.' },
      { type: 'code', language: 'html', content: '<a href="https://www.example.com">Visit Example</a>' },
      { type: 'heading', content: 'Internal Links' },
      { type: 'text', content: 'Internal links connect pages or resources within the same website. Relative URLs are commonly used for these links.' },
      { type: 'code', language: 'html', content: '<nav>\n  <a href="index.html">Home</a>\n  <a href="frontend-1.html">HTML</a>\n  <a href="frontend-2.html">Elements</a>\n  <a href="frontend-3.html">Attributes</a>\n</nav>' },
      { type: 'heading', content: 'Links to Sections on the Same Page' },
      { type: 'text', content: 'An element with an id can be used as a target for a link. A URL fragment beginning with # can point to that ID. This is useful for navigation menus and long pages.' },
      { type: 'code', language: 'html', content: '<a href="#rewards">Jump to Rewards</a>\n\n<h2 id="rewards">Quest Rewards</h2>\n<p>Complete quests to earn XP.</p>' },
      { type: 'heading', content: 'Email Links' },
      { type: 'text', content: 'An a element can use a mailto URL to create a link that opens the user\'s default email application.' },
      { type: 'code', language: 'html', content: '<a href="mailto:mentor@example.com">Contact Your Mentor</a>' },
      { type: 'heading', content: 'Images' },
      { type: 'text', content: 'The img element displays an image. Its src attribute specifies the image resource and its alt attribute provides alternative text. Images can be used for logos, illustrations, screenshots, icons, photos, and other visual content.' },
      { type: 'code', language: 'html', content: '<img src="frontend-map.png" alt="Frontend development learning map">' },
      { type: 'heading', content: 'Images as Links' },
      { type: 'text', content: 'An image can be placed inside an a element to make the image clickable.' },
      { type: 'code', language: 'html', content: '<a href="frontend-5.html">\n  <img src="next-quest.png" alt="Go to the next frontend quest">\n</a>' },
      { type: 'heading', content: 'Unordered Lists' },
      { type: 'text', content: 'The ul element creates an unordered list, while li creates each list item. Browsers normally display unordered list items with bullet points.' },
      { type: 'code', language: 'html', content: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>' },
      { type: 'heading', content: 'Ordered Lists' },
      { type: 'text', content: 'The ol element creates an ordered list. Ordered lists are useful when the sequence of items matters, such as instructions, rankings, or steps in a process.' },
      { type: 'code', language: 'html', content: '<ol>\n  <li>Create an HTML file</li>\n  <li>Add the document structure</li>\n  <li>Write your content</li>\n  <li>Open the page in a browser</li>\n</ol>' },
      { type: 'heading', content: 'Nested Lists' },
      { type: 'text', content: 'Lists can contain other lists. This allows you to represent hierarchical information.' },
      { type: 'code', language: 'html', content: '<ul>\n  <li>Frontend\n    <ul>\n      <li>HTML</li>\n      <li>CSS</li>\n      <li>JavaScript</li>\n    </ul>\n  </li>\n  <li>Backend</li>\n</ul>' },
      { type: 'heading', content: 'Description Lists' },
      { type: 'text', content: 'A description list uses dl, dt, and dd elements. The dt element represents a term and dd provides its description.' },
      { type: 'code', language: 'html', content: '<dl>\n  <dt>HTML</dt>\n  <dd>Structures web page content.</dd>\n\n  <dt>CSS</dt>\n  <dd>Styles web page content.</dd>\n\n  <dt>JavaScript</dt>\n  <dd>Adds behavior and interactivity.</dd>\n</dl>' },
      { type: 'heading', content: 'HTML Tables' },
      { type: 'text', content: 'Tables are used to represent data organized into rows and columns. A table normally contains table rows, header cells, and data cells.' },
      { type: 'code', language: 'html', content: '<table>\n  <tr>\n    <th>Quest</th>\n    <th>XP</th>\n  </tr>\n  <tr>\n    <td>HTML Basics</td>\n    <td>100</td>\n  </tr>\n  <tr>\n    <td>HTML Attributes</td>\n    <td>120</td>\n  </tr>\n</table>' },
      { type: 'heading', content: 'Table Rows and Cells' },
      { type: 'text', content: 'The tr element represents a table row. The th element represents a header cell, while td represents a regular data cell.' },
      { type: 'code', language: 'html', content: '<tr>\n  <th>Player</th>\n  <th>Level</th>\n  <th>XP</th>\n</tr>\n<tr>\n  <td>Alex</td>\n  <td>5</td>\n  <td>450</td>\n</tr>' },
      { type: 'heading', content: 'Table Head, Body, and Foot' },
      { type: 'text', content: 'Larger tables can be organized with thead, tbody, and tfoot elements. These elements divide the table into a header section, main data section, and footer section.' },
      { type: 'code', language: 'html', content: '<table>\n  <thead>\n    <tr>\n      <th>Quest</th>\n      <th>XP</th>\n    </tr>\n  </thead>\n\n  <tbody>\n    <tr>\n      <td>HTML</td>\n      <td>100</td>\n    </tr>\n    <tr>\n      <td>CSS</td>\n      <td>120</td>\n    </tr>\n  </tbody>\n\n  <tfoot>\n    <tr>\n      <td>Total</td>\n      <td>220</td>\n    </tr>\n  </tfoot>\n</table>' },
      { type: 'heading', content: 'When Should You Use a Table?' },
      { type: 'text', content: 'Tables should be used for tabular data, such as scores, schedules, prices, comparisons, or records. They should not be used simply to create page layouts. Modern CSS provides better tools for arranging page layouts.' },
      { type: 'heading', content: 'A Complete Quest Dashboard' },
      { type: 'text', content: 'The following example combines navigation, images, lists, and a table into a small HTML quest dashboard.' },
      { type: 'code', language: 'html', content: '<header>\n  <h1>Frontend Quest</h1>\n  <nav>\n    <a href="index.html">Home</a>\n    <a href="frontend-1.html">HTML</a>\n    <a href="frontend-5.html">Forms</a>\n  </nav>\n</header>\n\n<main>\n  <img src="quest.png" alt="Frontend quest illustration">\n\n  <h2>Available Quests</h2>\n  <ul>\n    <li>HTML Fundamentals</li>\n    <li>HTML Attributes</li>\n    <li>HTML Forms</li>\n  </ul>\n\n  <h2>Quest Rewards</h2>\n  <table>\n    <tr>\n      <th>Quest</th>\n      <th>XP</th>\n    </tr>\n    <tr>\n      <td>HTML Fundamentals</td>\n      <td>100</td>\n    </tr>\n    <tr>\n      <td>HTML Attributes</td>\n      <td>120</td>\n    </tr>\n  </table>\n</main>' },
      { type: 'heading', content: 'Preparing for Forms' },
      { type: 'text', content: 'Links, images, lists, and tables let you build increasingly useful pages. The next lesson introduces forms and semantic HTML, which will prepare you to create interfaces that collect user input and organize page sections in a meaningful way.' },
      { type: 'heading', content: 'Key Takeaways' },
      { type: 'text', content: 'The a element creates links and uses href to specify destinations. Images use img with src and alt. Unordered lists use ul and li, while ordered lists use ol and li. Description lists use dl, dt, and dd. Tables use table, tr, th, and td, with thead, tbody, and tfoot available for larger tables. Tables should represent data rather than page layout.' },
      { type: 'tip', content: 'Choose HTML elements based on what your content means. Use links for navigation, lists for groups of related items, and tables for actual tabular data. Good semantic choices make your pages easier to understand and maintain.' },
    ],
  },
  {
    id: 'frontend-5',
    thumbnail: 'https://readdy.ai/api/search-image?query=HTML%20forms%20and%20semantic%20structure%20concept%20with%20input%20fields%20and%20landmark%20layout%20blocks%2C%20minimal%20flat%20design%20aesthetic%2C%20soft%20natural%20lighting%2C%20light%20neutral%20background&width=640&height=360&seq=fe-thumb-5&orientation=landscape&nocache=true',
    title: 'HTML Forms and Semantic Structure',
    category: 'frontend',
    categoryName: 'Frontend Developer',
    description: 'Learn how to collect user input with HTML forms and organize pages using semantic HTML elements. Prepare your HTML skills for JavaScript and DOM manipulation.',
    difficulty: 2,
    estimatedMinutes: 60,
    orderIndex: 5,
    prerequisites: ['frontend-4'],
    xpReward: 120,
    icon: 'ri-file-list-3-line',
    content: [
      { type: 'heading', content: 'From Static Pages to User Interaction' },
      { type: 'text', content: 'So far, you have learned how HTML creates page structure, headings, paragraphs, attributes, links, images, lists, and tables. The next step is learning how HTML can collect information from users and organize a page into meaningful sections.' },
      { type: 'video', videoUrl: 'https://www.youtube.com/embed/VLeERv_dR6Q', videoTitle: 'HTML Forms and Semantic Structure Explained for Beginners' },
      { type: 'heading', content: 'What Is an HTML Form?' },
      { type: 'text', content: 'An HTML form is a section of a web page that can contain controls for collecting user input. Forms are commonly used for login pages, registration, search boxes, contact forms, surveys, checkout pages, and application settings.' },
      { type: 'code', language: 'html', content: '<form>\n  <label for="username">Username:</label>\n  <input type="text" id="username" name="username">\n\n  <button type="submit">Start Quest</button>\n</form>' },
      { type: 'heading', content: 'The Form Element' },
      { type: 'text', content: 'The form element groups form controls together. A form can contain inputs, labels, buttons, select menus, text areas, and other form-related elements.' },
      { type: 'heading', content: 'The Input Element' },
      { type: 'text', content: 'The input element creates an interactive form control. Its type attribute determines what kind of input is displayed. Common types include text, password, email, number, date, checkbox, radio, and submit.' },
      { type: 'code', language: 'html', content: '<input type="text">\n<input type="password">\n<input type="email">\n<input type="number">\n<input type="date">\n<input type="checkbox">\n<input type="radio">' },
      { type: 'heading', content: 'Text Input' },
      { type: 'text', content: 'A text input allows users to enter a short piece of text. It is commonly used for usernames, names, search terms, and similar information.' },
      { type: 'code', language: 'html', content: '<label for="username">Username</label>\n<input type="text" id="username" name="username">' },
      { type: 'heading', content: 'Password Input' },
      { type: 'text', content: 'The password input type allows users to enter sensitive text while the browser normally hides the characters as they are typed.' },
      { type: 'code', language: 'html', content: '<label for="password">Password</label>\n<input type="password" id="password" name="password">' },
      { type: 'heading', content: 'Email Input' },
      { type: 'text', content: 'The email input type is designed for email addresses. Browsers can provide appropriate input behavior and basic validation support for this type.' },
      { type: 'code', language: 'html', content: '<label for="email">Email</label>\n<input type="email" id="email" name="email">' },
      { type: 'heading', content: 'Number Input' },
      { type: 'text', content: 'The number input type is intended for numeric values. Additional attributes such as min, max, and step can define useful constraints.' },
      { type: 'code', language: 'html', content: '<label for="level">Starting Level</label>\n<input type="number" id="level" name="level" min="1" max="100">' },
      { type: 'heading', content: 'Checkboxes' },
      { type: 'text', content: 'Checkboxes allow users to select zero or more options. They are useful when several independent choices can be selected at the same time.' },
      { type: 'code', language: 'html', content: '<p>Select your skills:</p>\n\n<label>\n  <input type="checkbox" name="skill" value="html">\n  HTML\n</label>\n\n<label>\n  <input type="checkbox" name="skill" value="css">\n  CSS\n</label>\n\n<label>\n  <input type="checkbox" name="skill" value="javascript">\n  JavaScript\n</label>' },
      { type: 'heading', content: 'Radio Buttons' },
      { type: 'text', content: 'Radio buttons are used when a user should choose one option from a group. Radio buttons that belong to the same group normally share the same name attribute.' },
      { type: 'code', language: 'html', content: '<p>Choose your difficulty:</p>\n\n<label>\n  <input type="radio" name="difficulty" value="beginner">\n  Beginner\n</label>\n\n<label>\n  <input type="radio" name="difficulty" value="advanced">\n  Advanced\n</label>' },
      { type: 'heading', content: 'The Label Element' },
      { type: 'text', content: 'The label element provides a text label for a form control. Connecting a label to an input using the for attribute and the input id improves usability and accessibility because users can interact with the label to focus or select the associated control.' },
      { type: 'code', language: 'html', content: '<label for="quest-name">Quest Name</label>\n<input type="text" id="quest-name" name="quest-name">' },
      { type: 'heading', content: 'The Textarea Element' },
      { type: 'text', content: 'The textarea element allows users to enter multiple lines of text. It is useful for comments, descriptions, messages, feedback, and other longer responses.' },
      { type: 'code', language: 'html', content: '<label for="message">Quest Message</label>\n<textarea id="message" name="message" rows="5" cols="30"></textarea>' },
      { type: 'heading', content: 'The Select Element' },
      { type: 'text', content: 'The select element creates a dropdown list. Each available option is represented by an option element.' },
      { type: 'code', language: 'html', content: '<label for="class">Choose a Class</label>\n<select id="class" name="class">\n  <option value="frontend">Frontend Developer</option>\n  <option value="backend">Backend Developer</option>\n  <option value="fullstack">Full Stack Developer</option>\n</select>' },
      { type: 'heading', content: 'Buttons' },
      { type: 'text', content: 'The button element creates a clickable button. Inside a form, a button can submit the form, reset its controls, or perform another action depending on its type.' },
      { type: 'code', language: 'html', content: '<button type="submit">Submit Quest</button>\n<button type="reset">Reset</button>\n<button type="button">Regular Button</button>' },
      { type: 'heading', content: 'Required Fields' },
      { type: 'text', content: 'The required attribute indicates that a form control must have a value before the form can be submitted. This allows the browser to perform basic client-side validation.' },
      { type: 'code', language: 'html', content: '<label for="username">Username</label>\n<input type="text" id="username" name="username" required>' },
      { type: 'heading', content: 'Placeholder Text' },
      { type: 'text', content: 'The placeholder attribute provides a short hint about the expected input. Placeholder text should not replace a proper label because it disappears when the user starts entering a value.' },
      { type: 'code', language: 'html', content: '<label for="username">Username</label>\n<input\n  type="text"\n  id="username"\n  name="username"\n  placeholder="Enter your username"\n>' },
      { type: 'heading', content: 'The Name Attribute' },
      { type: 'text', content: 'The name attribute identifies form controls when form data is submitted. It is especially important when communicating form data to a server or processing the form with JavaScript.' },
      { type: 'code', language: 'html', content: '<input type="text" id="username" name="username">\n<input type="email" id="email" name="email">' },
      { type: 'heading', content: 'A Complete Quest Form' },
      { type: 'text', content: 'The following example combines several form controls into a simple quest registration form.' },
      { type: 'code', language: 'html', content: '<form id="quest-form">\n  <h2>Join the Frontend Quest</h2>\n\n  <label for="username">Username</label>\n  <input\n    type="text"\n    id="username"\n    name="username"\n    placeholder="Enter your username"\n    required\n  >\n\n  <label for="email">Email</label>\n  <input\n    type="email"\n    id="email"\n    name="email"\n    required\n  >\n\n  <label for="class">Choose a class</label>\n  <select id="class" name="class">\n    <option value="frontend">Frontend Developer</option>\n    <option value="backend">Backend Developer</option>\n  </select>\n\n  <p>Experience level</p>\n  <label>\n    <input type="radio" name="level" value="beginner">\n    Beginner\n  </label>\n\n  <label>\n    <input type="radio" name="level" value="intermediate">\n    Intermediate\n  </label>\n\n  <label for="message">Why do you want to learn?</label>\n  <textarea id="message" name="message" rows="4"></textarea>\n\n  <label>\n    <input type="checkbox" name="terms" required>\n    I agree to the quest rules.\n  </label>\n\n  <button type="submit">Start Quest</button>\n</form>' },
      { type: 'heading', content: 'What Is Semantic HTML?' },
      { type: 'text', content: 'Semantic HTML uses elements that describe the meaning and purpose of their content. Instead of using generic containers for everything, semantic elements such as header, nav, main, section, article, aside, and footer communicate the structure of a page.' },
      { type: 'heading', content: 'The Header Element' },
      { type: 'text', content: 'The header element represents introductory content for a page or section. It can contain a logo, heading, navigation, or other introductory information.' },
      { type: 'code', language: 'html', content: '<header>\n  <h1>Frontend Quest</h1>\n  <p>Level up your web development skills.</p>\n</header>' },
      { type: 'heading', content: 'The Nav Element' },
      { type: 'text', content: 'The nav element represents a section containing navigation links. It is useful for primary navigation menus and other major groups of navigation links.' },
      { type: 'code', language: 'html', content: '<nav>\n  <a href="index.html">Home</a>\n  <a href="frontend-1.html">HTML</a>\n  <a href="frontend-5.html">Forms</a>\n</nav>' },
      { type: 'heading', content: 'The Main Element' },
      { type: 'text', content: 'The main element represents the primary content of the document. A page generally has one main element containing the central content of that page.' },
      { type: 'code', language: 'html', content: '<main>\n  <h1>Frontend Developer Quest</h1>\n  <p>Complete your HTML training here.</p>\n</main>' },
      { type: 'heading', content: 'The Section Element' },
      { type: 'text', content: 'The section element represents a thematic grouping of content. Sections commonly contain a heading and related content.' },
      { type: 'code', language: 'html', content: '<section>\n  <h2>HTML Quests</h2>\n  <p>Complete these quests to master HTML.</p>\n</section>' },
      { type: 'heading', content: 'The Article Element' },
      { type: 'text', content: 'The article element represents a self-contained piece of content that could potentially stand on its own. Examples include blog posts, news articles, forum posts, or individual quest cards.' },
      { type: 'code', language: 'html', content: '<article>\n  <h2>HTML Quest Complete</h2>\n  <p>You have learned the foundations of HTML.</p>\n</article>' },
      { type: 'heading', content: 'The Aside Element' },
      { type: 'text', content: 'The aside element represents content that is related to the surrounding content but is not part of its main flow. It can be used for tips, related links, side information, or supplementary content.' },
      { type: 'code', language: 'html', content: '<aside>\n  <h2>Quest Tip</h2>\n  <p>Use semantic HTML whenever possible.</p>\n</aside>' },
      { type: 'heading', content: 'The Footer Element' },
      { type: 'text', content: 'The footer element represents footer information for a page or section. It can contain copyright information, related links, contact information, or other closing content.' },
      { type: 'code', language: 'html', content: '<footer>\n  <p>&copy; 2026 Frontend Quest</p>\n</footer>' },
      { type: 'heading', content: 'Putting Semantic HTML Together' },
      { type: 'text', content: 'Semantic elements can be combined to create a clear page structure. This structure will become especially important when JavaScript begins interacting with the page through the DOM in the next lesson.' },
      { type: 'code', language: 'html', content: '<header>\n  <h1>Frontend Quest</h1>\n\n  <nav>\n    <a href="index.html">Home</a>\n    <a href="quests.html">Quests</a>\n    <a href="profile.html">Profile</a>\n  </nav>\n</header>\n\n<main>\n  <section>\n    <h2>Current Quest</h2>\n\n    <article>\n      <h3>HTML Fundamentals</h3>\n      <p>Learn how HTML structures the web.</p>\n    </article>\n  </section>\n\n  <aside>\n    <h2>Tip</h2>\n    <p>Practice by building small pages.</p>\n  </aside>\n</main>\n\n<footer>\n  <p>&copy; 2026 Frontend Quest</p>\n</footer>' },
      { type: 'heading', content: 'HTML Before JavaScript' },
      { type: 'text', content: 'You have now built a strong HTML foundation. You know how to structure documents, create headings and paragraphs, use attributes, create links, display images, organize data with lists and tables, collect user input with forms, and create meaningful page sections with semantic HTML.' },
      { type: 'text', content: 'In the next lesson, JavaScript will begin interacting with this HTML through the Document Object Model, commonly called the DOM. The elements and IDs, classes, buttons, forms, and other structures you learned here will become targets that JavaScript can select and manipulate.' },
      { type: 'heading', content: 'Key Takeaways' },
      { type: 'text', content: 'Forms collect user input using elements such as form, input, label, textarea, select, option, and button. Input types determine the kind of data a control accepts. Attributes such as required, placeholder, name, min, and max provide additional information and constraints. Semantic elements such as header, nav, main, section, article, aside, and footer communicate page structure and meaning.' },
      { type: 'tip', content: 'Use semantic HTML whenever an appropriate element exists. Give form controls clear labels, use meaningful names and IDs, and remember that HTML provides structure while CSS and JavaScript handle presentation and behavior.' },
    ],
  },

  {
    id: 'frontend-6',
    thumbnail: 'https://readdy.ai/api/search-image?query=DOM%20tree%20diagram%20with%20connected%20nodes%20and%20a%20cursor%20clicking%20an%20element%2C%20web%20development%20concept%2C%20minimal%20flat%20illustration%2C%20soft%20pastel%20tones%2C%20light%20neutral%20background&width=640&height=360&seq=fe-thumb-6&orientation=landscape',
    title: 'DOM Manipulation and Events',
    category: 'frontend',
    categoryName: 'Frontend Developer',
    description: 'Learn how JavaScript interacts with HTML through the DOM. Manipulate elements, create dynamic content, handle user events, and build interactive web pages.',
    difficulty: 3,
    estimatedMinutes: 60,
    orderIndex: 6,
    prerequisites: ['frontend-5'],
    xpReward: 120,
    icon: 'ri-code-box-line',
    content: [
      { type: 'heading', content: 'What is the DOM?' },
      { type: 'text', content: 'The Document Object Model (DOM) is the browser\'s internal representation of an HTML document. It represents the page as a hierarchy of objects called nodes. JavaScript can use the DOM to access, change, create, and remove elements and content on a web page. This allows websites to become dynamic and interactive instead of remaining as static HTML documents.' },
      { type: 'video', videoUrl: 'https://www.youtube.com/embed/0ik6X4DJKCc', videoTitle: 'JavaScript DOM Crash Course — Manipulate the DOM with Confidence' },
      { type: 'text', content: 'The DOM represents the structure of a document as a tree. At the top is the document object, followed by elements such as html, head, and body. Elements inside other elements are called children, while the containing elements are called parents. Elements at the same level are siblings, and elements contained anywhere inside another element are descendants.' },
      { type: 'heading', content: 'The Browser, Window, and Document Objects' },
      { type: 'text', content: 'JavaScript running in a browser has access to several important browser objects. The Window object represents the browser window or tab and provides access to browser features. The Navigator object provides information about the browser and environment. The Document object represents the current web page and provides methods for accessing and manipulating the DOM.' },
      { type: 'code', language: 'javascript', content: '// Accessing browser objects\nconsole.log(window);\nconsole.log(navigator);\nconsole.log(document);\n\n// Accessing the page title\nconsole.log(document.title);\n\n// Changing the page title\ndocument.title = "IT Quest - Frontend Quest";' },
      { type: 'heading', content: 'Selecting DOM Elements' },
      { type: 'text', content: 'Before JavaScript can modify an element, it needs to obtain a reference to that element. The document object provides several methods for selecting elements. Common methods include getElementById(), querySelector(), and querySelectorAll(). The querySelector() method returns the first element that matches a CSS selector, while querySelectorAll() returns all matching elements.' },
      { type: 'code', language: 'javascript', content: '// Select an element by its ID\nconst questTitle = document.getElementById("quest-title");\n\n// Select the first element matching a CSS selector\nconst firstButton = document.querySelector(".quest-button");\n\n// Select all matching elements\nconst buttons = document.querySelectorAll(".quest-button");\n\nconsole.log(questTitle);\nconsole.log(firstButton);\nconsole.log(buttons);' },
      { type: 'heading', content: 'Changing Text and HTML Content' },
      { type: 'text', content: 'Once an element has been selected, JavaScript can change the content displayed inside it. The textContent property changes the text inside an element and treats the value as plain text. The innerHTML property can be used to read or replace HTML content inside an element. When working with user-provided information, textContent is generally safer because it does not interpret the value as HTML.' },
      { type: 'code', language: 'javascript', content: 'const title = document.querySelector("#quest-title");\nconst message = document.querySelector("#quest-message");\n\ntitle.textContent = "JavaScript DOM Quest";\nmessage.textContent = "Quest started!";\n\n// Changing HTML content\nmessage.innerHTML = "<strong>Quest completed!</strong>";' },
      { type: 'heading', content: 'Changing Attributes' },
      { type: 'text', content: 'HTML elements contain attributes such as id, class, src, href, alt, and disabled. JavaScript can read, change, add, and remove attributes using DOM methods such as getAttribute(), setAttribute(), hasAttribute(), and removeAttribute(). These methods are useful when the behavior or appearance of an element needs to change dynamically.' },
      { type: 'code', language: 'javascript', content: 'const questButton = document.querySelector("#quest-button");\n\n// Read an attribute\nconsole.log(questButton.getAttribute("class"));\n\n// Add or change an attribute\nquestButton.setAttribute("data-xp", "100");\n\n// Check if an attribute exists\nif (questButton.hasAttribute("data-xp")) {\n  console.log("XP attribute exists");\n}\n\n// Remove an attribute\nquestButton.removeAttribute("disabled");' },
      { type: 'heading', content: 'Changing CSS with JavaScript' },
      { type: 'text', content: 'JavaScript can also modify the appearance of elements. The style property allows individual CSS properties to be changed directly through JavaScript. Class names can also be changed to apply CSS rules that are already defined in a stylesheet. The classList property provides methods such as add(), remove(), toggle(), and contains() for managing classes.' },
      { type: 'code', language: 'javascript', content: 'const card = document.querySelector(".quest-card");\n\n// Change an individual style\ncard.style.backgroundColor = "lavender";\ncard.style.borderRadius = "12px";\n\n// Manage CSS classes\ncard.classList.add("completed");\ncard.classList.remove("locked");\ncard.classList.toggle("active");\n\nif (card.classList.contains("completed")) {\n  console.log("Quest is completed!");\n}' },
      { type: 'heading', content: 'Creating New DOM Elements' },
      { type: 'text', content: 'JavaScript can create completely new elements and add them to the page. The document.createElement() method creates a new element node. After creating it, you can add text, attributes, classes, or other elements before placing it into the document.' },
      { type: 'code', language: 'javascript', content: 'const questList = document.querySelector("#quest-list");\n\n// Create a new list item\nconst newQuest = document.createElement("li");\nnewQuest.textContent = "Complete DOM Manipulation";\nnewQuest.classList.add("quest-item");\n\n// Add the new element to the page\nquestList.appendChild(newQuest);' },
      { type: 'heading', content: 'Adding and Removing Elements' },
      { type: 'text', content: 'New elements can be inserted into the DOM using methods such as appendChild() and append(). Elements can also be removed using remove(). These methods allow JavaScript applications to dynamically update lists, cards, notifications, menus, and other parts of a web page without manually editing the HTML.' },
      { type: 'code', language: 'javascript', content: 'const questContainer = document.querySelector("#quest-container");\n\nconst questCard = document.createElement("div");\nquestCard.textContent = "New Quest Available";\nquestCard.classList.add("quest-card");\n\n// Add the element\nquestContainer.append(questCard);\n\n// Remove the element later\nquestCard.remove();' },
      { type: 'heading', content: 'What Are Events?' },
      { type: 'text', content: 'Events are signals fired by the browser when something significant happens. JavaScript can listen for these events and execute code in response. Events can be triggered by user actions such as clicking a button, moving the mouse, pressing a keyboard key, submitting a form, or focusing an input. Events can also occur when a page loads, a video starts or stops, or an error happens.' },
      { type: 'heading', content: 'Common JavaScript Events' },
      { type: 'text', content: 'Some commonly used browser events include click for mouse clicks, dblclick for double-clicks, mouseover and mouseout for pointer movement, focus and blur for form fields, keydown for keyboard input, submit for forms, and load for page or resource loading. Different HTML elements can support different types of events.' },
      { type: 'code', language: 'javascript', content: 'const button = document.querySelector("#start-quest");\n\nbutton.addEventListener("click", () => {\n  console.log("Quest started!");\n});\n\nconst input = document.querySelector("#quest-input");\n\ninput.addEventListener("keydown", (event) => {\n  console.log("Key pressed:", event.key);\n});' },
      { type: 'heading', content: 'Using addEventListener()' },
      { type: 'text', content: 'The addEventListener() method is the recommended way to register event handlers. It takes the event type and a function that should run when the event occurs. Using addEventListener() keeps JavaScript separate from HTML and allows multiple listeners to respond to the same event.' },
      { type: 'code', language: 'javascript', content: 'const questButton = document.querySelector("#quest-button");\n\nfunction startQuest() {\n  console.log("The quest has started!");\n}\n\nquestButton.addEventListener("click", startQuest);\n\n// Multiple listeners can respond to the same event\nquestButton.addEventListener("click", () => {\n  console.log("Awarding starting XP...");\n});' },
      { type: 'heading', content: 'Removing Event Listeners' },
      { type: 'text', content: 'An event listener added with addEventListener() can be removed with removeEventListener(). The same function reference used when registering the listener must be provided when removing it. Removing unnecessary listeners can help keep larger applications organized and efficient.' },
      { type: 'code', language: 'javascript', content: 'const button = document.querySelector("#quest-button");\n\nfunction completeQuest() {\n  console.log("Quest completed!");\n}\n\nbutton.addEventListener("click", completeQuest);\n\n// Remove the listener when it is no longer needed\nbutton.removeEventListener("click", completeQuest);' },
      { type: 'heading', content: 'Event Handler Properties' },
      { type: 'text', content: 'Another way to handle events is by assigning a function to an event handler property such as onclick. Although this method works, it has limitations because assigning a new function replaces the previous handler. For larger applications, addEventListener() is generally preferred because multiple listeners can be registered for the same event.' },
      { type: 'code', language: 'javascript', content: 'const button = document.querySelector("#quest-button");\n\nbutton.onclick = () => {\n  console.log("Quest clicked!");\n};' },
      { type: 'heading', content: 'Avoid Inline Event Handlers' },
      { type: 'text', content: 'Inline event handlers place JavaScript directly inside HTML attributes, such as onclick="startQuest()". Although this approach may appear simple, it is considered outdated and bad practice. It mixes HTML and JavaScript, becomes difficult to maintain when many elements are involved, and can also be restricted by security policies. Using addEventListener() keeps the structure and behavior of the page separate.' },
      { type: 'code', language: 'javascript', content: '// Avoid this in HTML:\n// <button onclick="startQuest()">Start Quest</button>\n\n// Preferred approach:\nconst button = document.querySelector("#start-quest");\n\nbutton.addEventListener("click", startQuest);' },
      { type: 'heading', content: 'The Event Object' },
      { type: 'text', content: 'When an event occurs, the browser automatically provides an event object to the event handler. This object contains useful information about what happened. One commonly used property is target, which refers to the element where the event occurred. Different event types can also provide specialized information, such as the key property of a keyboard event.' },
      { type: 'code', language: 'javascript', content: 'const button = document.querySelector("#quest-button");\n\nbutton.addEventListener("click", (event) => {\n  console.log("Event:", event);\n  console.log("Clicked element:", event.target);\n});\n\nconst input = document.querySelector("#quest-input");\n\ninput.addEventListener("keydown", (event) => {\n  console.log("You pressed:", event.key);\n});' },
      { type: 'heading', content: 'Preventing Default Behavior' },
      { type: 'text', content: 'Some browser events have default behaviors. For example, submitting a form normally causes the browser to submit the form and may reload or navigate the page. The preventDefault() method of the event object can stop the browser from performing its default action. This is commonly used for client-side form validation and custom interactions.' },
      { type: 'code', language: 'javascript', content: 'const form = document.querySelector("#quest-form");\nconst username = document.querySelector("#username");\nconst message = document.querySelector("#message");\n\nform.addEventListener("submit", (event) => {\n  if (username.value.trim() === "") {\n    event.preventDefault();\n    message.textContent = "Please enter your username.";\n  }\n});' },
      { type: 'heading', content: 'Event Bubbling' },
      { type: 'text', content: 'Event bubbling describes how an event can move from the element where it occurred upward through its parent elements. For example, if a button is inside a div and the button is clicked, the click event can also be handled by the div and other parent elements. The target property identifies the original element where the event occurred, while currentTarget identifies the element whose event handler is currently running.' },
      { type: 'code', language: 'javascript', content: 'const container = document.querySelector("#quest-container");\nconst button = document.querySelector("#quest-button");\n\ncontainer.addEventListener("click", (event) => {\n  console.log("Target:", event.target);\n  console.log("Current target:", event.currentTarget);\n});\n\nbutton.addEventListener("click", () => {\n  console.log("Quest button clicked!");\n});' },
      { type: 'heading', content: 'Event Delegation' },
      { type: 'text', content: 'Event delegation uses event bubbling to handle events from multiple child elements through a single event listener on their parent. Instead of adding separate listeners to every button, a parent element can listen for the event and determine which child triggered it. This is especially useful for dynamic lists where new elements may be added after the page loads.' },
      { type: 'code', language: 'javascript', content: 'const questList = document.querySelector("#quest-list");\n\nquestList.addEventListener("click", (event) => {\n  if (event.target.matches(".complete-quest")) {\n    const questId = event.target.dataset.questId;\n    console.log(`Quest ${questId} completed!`);\n  }\n});' },
      { type: 'heading', content: 'Building an Interactive Quest List' },
      { type: 'text', content: 'DOM manipulation and events can be combined to create interactive web applications. The following example creates quest items, updates their status when clicked, and dynamically changes the page using JavaScript. This demonstrates how the DOM and event system work together to create responsive user interfaces.' },
      { type: 'code', language: 'javascript', content: 'const quests = [\n  { id: 1, title: "HTML Mastery", xp: 100, completed: true },\n  { id: 2, title: "CSS Fundamentals", xp: 120, completed: false },\n  { id: 3, title: "DOM Manipulation", xp: 150, completed: false }\n];\n\nconst questList = document.querySelector("#quest-list");\nconst status = document.querySelector("#status");\n\nfunction renderQuests() {\n  questList.innerHTML = "";\n\n  quests.forEach((quest) => {\n    const item = document.createElement("li");\n    const button = document.createElement("button");\n\n    item.classList.add("quest-item");\n    button.classList.add("complete-quest");\n    button.dataset.questId = quest.id;\n    button.textContent = quest.completed\n      ? `${quest.title} — Completed`\n      : `${quest.title} — +${quest.xp} XP`;\n\n    item.appendChild(button);\n    questList.appendChild(item);\n  });\n}\n\nquestList.addEventListener("click", (event) => {\n  if (!event.target.matches(".complete-quest")) return;\n\n  const questId = Number(event.target.dataset.questId);\n  const quest = quests.find((item) => item.id === questId);\n\n  if (quest && !quest.completed) {\n    quest.completed = true;\n    status.textContent = `You earned ${quest.xp} XP!`;\n    renderQuests();\n  }\n});\n\nrenderQuests();' },
      { type: 'heading', content: 'DOM Manipulation and Events in Frontend Development' },
      { type: 'text', content: 'DOM manipulation and events are fundamental parts of interactive frontend development. By selecting elements, changing their content and attributes, creating new nodes, modifying classes and styles, and responding to browser events, JavaScript can turn a static HTML page into an interactive application. These skills are especially important for forms, menus, buttons, dashboards, quest systems, notifications, interactive lists, and other user interface features.' },
      { type: 'heading', content: 'Key Takeaways' },
      { type: 'text', content: 'The DOM represents an HTML document as a tree of objects that JavaScript can manipulate. The document object provides methods for finding and changing elements. JavaScript can create, add, modify, and remove DOM nodes. Events allow code to respond to user and browser actions. addEventListener() is the recommended way to register event handlers. Event objects provide information about events, preventDefault() can stop default browser behavior, and event bubbling makes event delegation possible.' },
      { type: 'tip', content: 'Keep your HTML, CSS, and JavaScript responsibilities separate. Use the DOM to update the page dynamically, use addEventListener() instead of inline event handlers, and use event delegation when many similar elements need the same type of interaction.' },
    ],
  },

  {
    id: 'frontend-7',
    thumbnail: 'https://readdy.ai/api/search-image?query=Nested%20reusable%20React%20component%20blocks%20connected%20with%20data%20flow%20arrows%2C%20minimal%20flat%20design%20aesthetic%2C%20soft%20light%20blue%20accents%2C%20clean%20light%20background&width=640&height=360&seq=fe-thumb-7&orientation=landscape',
    title: 'React Components and Props',
    category: 'frontend',
    categoryName: 'Frontend Developer',
    description: 'Learn how React components work, how to pass data with props, how to compose reusable components, and why props should be treated as read-only.',
    difficulty: 2,
    estimatedMinutes: 40,
    orderIndex: 7,
    prerequisites: ['frontend-6'],
    xpReward: 70,
    icon: 'ri-reactjs-line',
    content: [
      { type: 'heading', content: 'What Are React Components?' },
      { type: 'text', content: 'React components are reusable building blocks for user interfaces. A component describes what should appear on the screen and can be reused throughout an application. Conceptually, a React component works much like a JavaScript function: it receives inputs called props and returns React elements that describe the UI. Breaking an interface into components makes applications easier to understand, maintain, and reuse.' },
      { type: 'video', videoUrl: 'https://www.youtube.com/embed/LDB4uaJ87e0', videoTitle: 'React Crash Course — Components and Props' },
      { type: 'code', language: 'javascript', content: `function Welcome() {
  return <h1>Hello, world!</h1>;
}

function App() {
  return (
    <div>
      <Welcome />
    </div>
  );
}` },
      { type: 'tip', content: 'Think of a component as a reusable UI building block. Instead of creating the same HTML structure repeatedly, create a component once and reuse it wherever you need it.' },
      { type: 'heading', content: 'Function Components' },
      { type: 'text', content: 'The simplest way to create a React component is with a JavaScript function. A function component receives a props object and returns JSX. Modern React applications primarily use function components, making them the most important style to understand.' },
      { type: 'code', language: 'javascript', content: `function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}` },
      { type: 'text', content: 'The props parameter contains the data passed into the component. In this example, the component expects a name property and uses props.name inside the JSX.' },
      { type: 'heading', content: 'Passing Props to Components' },
      { type: 'text', content: 'Props, short for properties, allow a parent component to send data to a child component. Props are passed using JSX attributes. When React renders a component such as <Welcome name="Sara" />, it provides the component with a props object containing the name value.' },
      { type: 'code', language: 'javascript', content: `function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Alex" />
      <Welcome name="Jordan" />
    </div>
  );
}` },
      { type: 'text', content: 'Each instance of Welcome receives a different props object. The same component can therefore display different information without duplicating its implementation.' },
      { type: 'heading', content: 'Destructuring Props' },
      { type: 'text', content: 'Because props is a JavaScript object, you can destructure the values you need directly in the component parameters. This can make components easier to read when they use several props.' },
      { type: 'code', language: 'javascript', content: `function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

function UserCard({ name, role }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}` },
      { type: 'heading', content: 'Rendering Components' },
      { type: 'text', content: 'React components can be used in JSX just like HTML elements, but component names must start with a capital letter. React uses capitalization to distinguish user-defined components from built-in HTML elements. For example, <div /> is an HTML element while <Welcome /> represents a React component.' },
      { type: 'code', language: 'javascript', content: `function Button() {
  return <button>Click Me</button>;
}

function App() {
  return (
    <main>
      <Button />
    </main>
  );
}` },
      { type: 'tip', content: 'Always start React component names with a capital letter. Names like Button, UserCard, and Navigation are recognized as components, while lowercase names such as button and div are treated as HTML elements.' },
      { type: 'heading', content: 'Composing Components' },
      { type: 'text', content: 'Components can contain other components. This is called composition and is one of the most important ideas in React. Instead of building an entire page as one large component, you can create smaller components and combine them to build more complex interfaces.' },
      { type: 'code', language: 'javascript', content: `function Header() {
  return <header>My Website</header>;
}

function Welcome({ name }) {
  return <h2>Welcome, {name}!</h2>;
}

function Footer() {
  return <footer>Copyright 2026</footer>;
}

function App() {
  return (
    <div>
      <Header />
      <Welcome name="Alex" />
      <Footer />
    </div>
  );
}` },
      { type: 'text', content: 'This approach creates a component hierarchy. App acts as the parent component, while Header, Welcome, and Footer are smaller child components. Each component is responsible for a specific part of the interface.' },
      { type: 'heading', content: 'Extracting Reusable Components' },
      { type: 'text', content: 'When a component becomes too large or contains UI that could be reused, you can extract that part into its own component. For example, a large Comment component might contain an avatar, user information, comment text, and a date. These pieces can be separated into smaller components such as Avatar and UserInfo.' },
      { type: 'code', language: 'javascript', content: `function Avatar({ user }) {
  return (
    <img
      src={user.avatarUrl}
      alt={user.name}
    />
  );
}

function UserInfo({ user }) {
  return (
    <div>
      <Avatar user={user} />
      <span>{user.name}</span>
    </div>
  );
}

function Comment({ author, text }) {
  return (
    <article>
      <UserInfo user={author} />
      <p>{text}</p>
    </article>
  );
}` },
      { type: 'text', content: 'Extracting components improves reusability and readability. A good candidate for extraction is a UI element that is reused in multiple places or a section that is complex enough to have a clear responsibility of its own.' },
      { type: 'heading', content: 'Passing Objects as Props' },
      { type: 'text', content: 'Props can contain more than simple strings and numbers. You can pass objects, arrays, functions, and other JavaScript values to components. This is useful when a component needs several related pieces of information.' },
      { type: 'code', language: 'javascript', content: `const user = {
  name: 'Alex',
  role: 'Frontend Developer',
  avatarUrl: '/images/alex.png'
};

function UserCard({ user }) {
  return (
    <div>
      <img src={user.avatarUrl} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.role}</p>
    </div>
  );
}

function App() {
  return <UserCard user={user} />;
}` },
      { type: 'heading', content: 'Props Are Read-Only' },
      { type: 'text', content: 'A component should never modify its own props. Props should be treated as read-only inputs. A component receives data from its parent and uses that data to determine what it renders. If the UI needs to change over time, React provides state for managing changing data instead of modifying props.' },
      { type: 'code', language: 'javascript', content: `function User({ name }) {
  // Good: use the prop
  return <h2>{name}</h2>;
}

// Bad: never modify props
function User({ name }) {
  name = 'Someone Else';

  return <h2>{name}</h2>;
}` },
      { type: 'text', content: 'This follows the idea of pure functions: given the same inputs, a component should produce the same output. Keeping props immutable makes components more predictable and easier to reason about.' },
      { type: 'tip', content: 'Remember the rule: props come from the parent and should not be changed by the child. If a component needs to manage changing information, use React state instead.' },
      { type: 'heading', content: 'Putting Components and Props Together' },
      { type: 'text', content: 'Components and props work together to create reusable interfaces. The parent component decides which data to provide, while the child component decides how that data should be displayed. This separation allows the same component to be reused with different data.' },
      { type: 'code', language: 'javascript', content: `function ProductCard({ name, price, category }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>Category: {category}</p>
      <strong>\${price}</strong>
    </article>
  );
}

function App() {
  return (
    <main>
      <ProductCard
        name="Mechanical Keyboard"
        price={89}
        category="Accessories"
      />

      <ProductCard
        name="Wireless Mouse"
        price={45}
        category="Accessories"
      />

      <ProductCard
        name="USB-C Monitor"
        price={299}
        category="Displays"
      />
    </main>
  );
}` },
      { type: 'text', content: 'Notice that ProductCard only needs to know how to display a product. It does not need to know where the product data came from. App supplies the data through props, allowing ProductCard to remain reusable.' },
      { type: 'heading', content: 'Key Takeaways' },
      { type: 'text', content: 'React components are reusable UI building blocks. Function components receive props and return JSX. Props allow parent components to pass data to child components. Components can be composed together to build larger interfaces, and complex UI can be split into smaller reusable components. Most importantly, props should be treated as read-only and should never be directly modified by the component receiving them.' },
      { type: 'tip', content: 'A useful mental model is: Parent owns the data, props carry the data, and the child displays the data. Mastering this relationship is essential for building reusable React interfaces.' },
    ],
  },
  {
    id: 'frontend-8',
    thumbnail: 'https://readdy.ai/api/search-image?query=React%20state%20and%20hooks%20concept%20with%20toggle%20switches%20and%20data%20flow%20arrows%2C%20minimal%20flat%20illustration%2C%20soft%20light%20blue%20accents%2C%20clean%20light%20background&width=640&height=360&seq=fe-thumb-8&orientation=landscape',
    title: 'Frontend Development Fundamentals',
    category: 'frontend',
    categoryName: 'Frontend Developer',
    description: 'Understand the foundations of frontend development, including HTML, CSS, JavaScript, responsive design, browser-based development, frontend frameworks, and how these technologies work together to create modern web interfaces.',
    difficulty: 2,
    estimatedMinutes: 45,
    orderIndex: 8,
    prerequisites: ['frontend-7'],
    xpReward: 75,
    icon: 'ri-layout-line',
    content: [
      { type: 'heading', content: 'What Is Frontend Development?' },
      { type: 'text', content: 'Frontend development is the part of web development focused on what users see and interact with in their web browser. Frontend developers build user interfaces, layouts, navigation, forms, buttons, animations, and interactive features. The three core technologies of frontend development are HTML, CSS, and JavaScript.' },
      { type: 'video', videoUrl: 'https://www.youtube.com/embed/2OVLZtRYVok', videoTitle: 'Web Development Fundamentals — Everything You Need to Know' },
      { type: 'code', language: 'text', content: `FRONTEND DEVELOPMENT

HTML
  ↓
Structure and Content

CSS
  ↓
Design and Layout

JavaScript
  ↓
Behavior and Interactivity

        ↓

   USER INTERFACE` },
      { type: 'text', content: 'A frontend developer combines these technologies to turn a design or idea into an interface that users can interact with. Modern frameworks and libraries such as React, Vue, and Angular build on top of these fundamental web technologies.' },
      { type: 'tip', content: 'HTML, CSS, and JavaScript are the foundation of frontend development. Frameworks like React do not replace these technologies—they help developers build larger and more maintainable interfaces with them.' },
      { type: 'heading', content: 'HTML: Building the Structure' },
      { type: 'text', content: 'HTML stands for HyperText Markup Language. It defines the structure and meaning of content on a webpage. HTML uses elements, tags, and attributes to organize headings, paragraphs, images, links, lists, forms, buttons, and other content.' },
      { type: 'code', language: 'html', content: `<!DOCTYPE html>
<html>
  <head>
    <title>My Website</title>
  </head>

  <body>
    <header>
      <h1>My Portfolio</h1>
    </header>

    <main>
      <p>Welcome to my website.</p>

      <a href="/projects">
        View My Projects
      </a>
    </main>
  </body>
</html>` },
      { type: 'text', content: 'HTML provides meaning and structure, but it does not primarily control how the page looks. For example, an h1 element tells the browser that some text is an important heading. CSS can then control how that heading appears visually.' },
      { type: 'heading', content: 'Semantic HTML' },
      { type: 'text', content: 'Semantic HTML means choosing HTML elements based on their meaning and purpose rather than using generic elements for everything. Semantic elements make websites easier to understand, maintain, and navigate, and they provide important information to browsers and assistive technologies.' },
      { type: 'code', language: 'html', content: `<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>

<main>
  <article>
    <h1>Frontend Development</h1>
    <p>Learn how the web works.</p>
  </article>
</main>

<footer>
  <p>© 2026 My Website</p>
</footer>` },
      { type: 'tip', content: 'Prefer meaningful HTML elements such as header, nav, main, article, section, and footer when they describe the purpose of your content.' },
      { type: 'heading', content: 'CSS: Styling the Interface' },
      { type: 'text', content: 'CSS stands for Cascading Style Sheets. CSS controls the visual presentation of HTML elements. It can control colors, fonts, spacing, borders, sizes, positioning, layouts, animations, and responsive behavior.' },
      { type: 'code', language: 'css', content: `body {
  font-family: Arial, sans-serif;
  background: #f5f5f5;
  color: #222;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 12px;
}

.card h2 {
  color: #2563eb;
}` },
      { type: 'text', content: 'Separating structure from presentation allows the same HTML to be styled in different ways. This makes websites easier to maintain and allows developers to create consistent visual designs across many pages.' },
      { type: 'heading', content: 'CSS Layout' },
      { type: 'text', content: 'Frontend developers use CSS layout systems to arrange elements on a page. Flexbox is useful for arranging elements along one dimension, while CSS Grid is useful for more complex two-dimensional layouts. These tools are fundamental for building modern interfaces.' },
      { type: 'code', language: 'css', content: `.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}` },
      { type: 'text', content: 'Flexbox is commonly used for navigation bars, button groups, and aligning items. Grid is commonly used for dashboards, card layouts, galleries, and page sections.' },
      { type: 'heading', content: 'Responsive Web Design' },
      { type: 'text', content: 'Users access websites from many different devices and screen sizes. Responsive web design allows an interface to adapt to phones, tablets, laptops, and desktop monitors. CSS media queries can change styles depending on the available screen size.' },
      { type: 'code', language: 'css', content: `.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .cards {
    grid-template-columns: 1fr;
  }
}` },
      { type: 'tip', content: 'Do not design only for your own screen. A good frontend should remain usable across different screen sizes and devices.' },
      { type: 'heading', content: 'JavaScript: Adding Behavior' },
      { type: 'text', content: 'JavaScript is a programming language that allows websites to respond to users and perform dynamic operations in the browser. It can handle clicks, keyboard input, forms, animations, calculations, data manipulation, and communication with external services.' },
      { type: 'code', language: 'javascript', content: `const button = document.querySelector('#button');
const message = document.querySelector('#message');

button.addEventListener('click', () => {
  message.textContent = 'Button clicked!';
});` },
      { type: 'text', content: 'Without JavaScript, many websites would be mostly static documents. JavaScript allows the interface to respond to user actions and update content without requiring the entire page to be manually rewritten.' },
      { type: 'heading', content: 'The DOM' },
      { type: 'text', content: 'The Document Object Model, or DOM, represents a webpage as a structure of objects that JavaScript can interact with. JavaScript can select elements, change their content, modify styles, respond to events, and create or remove elements.' },
      { type: 'code', language: 'javascript', content: `const title = document.querySelector('h1');

title.textContent = 'Welcome!';

title.style.color = 'blue';` },
      { type: 'text', content: 'The DOM is an important concept because it connects JavaScript with the webpage displayed in the browser.' },
      { type: 'heading', content: 'Events and User Interaction' },
      { type: 'text', content: 'Frontend applications need to respond to user actions. Events represent things that happen in the browser, such as clicks, keyboard input, form submissions, mouse movement, and page loading. JavaScript can listen for these events and execute code when they occur.' },
      { type: 'code', language: 'javascript', content: `const form = document.querySelector('#loginForm');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  console.log('Form submitted!');
});` },
      { type: 'tip', content: 'Interactive frontend development is largely about responding to events, changing application data, and updating what the user sees.' },
      { type: 'heading', content: 'HTML, CSS, and JavaScript Together' },
      { type: 'text', content: 'HTML, CSS, and JavaScript have different responsibilities, but they work together to create a complete frontend experience. HTML provides structure, CSS provides presentation, and JavaScript provides behavior.' },
      { type: 'code', language: 'html', content: `<!DOCTYPE html>
<html>
  <head>
    <style>
      button {
        background: blue;
        color: white;
        padding: 10px 20px;
      }
    </style>
  </head>

  <body>
    <h1 id="title">Hello!</h1>

    <button id="button">
      Change Message
    </button>

    <script>
      const button = document.querySelector('#button');
      const title = document.querySelector('#title');

      button.addEventListener('click', () => {
        title.textContent = 'Welcome to Frontend Development!';
      });
    </script>
  </body>
</html>` },
      { type: 'text', content: 'In this example, HTML creates the heading and button, CSS controls the button appearance, and JavaScript changes the heading when the user clicks the button.' },
      { type: 'heading', content: 'Working with Forms' },
      { type: 'text', content: 'Forms are a major part of frontend development. They allow users to enter information such as names, email addresses, passwords, search terms, and messages. JavaScript can validate and process form input before sending it to a server.' },
      { type: 'code', language: 'html', content: `<form id="signupForm">
  <label for="email">
    Email
  </label>

  <input
    id="email"
    type="email"
    required
  />

  <button type="submit">
    Sign Up
  </button>
</form>` },
      { type: 'text', content: 'Frontend validation improves the user experience by providing immediate feedback. However, frontend validation should not be treated as a security boundary. Data received by a backend must still be validated on the server.' },
      { type: 'heading', content: 'Fetching Data from an API' },
      { type: 'text', content: 'Modern frontend applications often need data from a backend or external service. JavaScript can communicate with APIs using tools such as fetch. The frontend sends a request, receives data, and then uses that data to update the interface.' },
      { type: 'code', language: 'javascript', content: `async function loadUsers() {
  const response = await fetch('/api/users');

  const users = await response.json();

  console.log(users);
}

loadUsers();` },
      { type: 'text', content: 'APIs allow the frontend and backend to communicate without requiring the frontend to directly access a database. The frontend requests the information it needs, and the backend determines how that information is retrieved.' },
      { type: 'heading', content: 'JSON and Frontend Data' },
      { type: 'text', content: 'JSON, or JavaScript Object Notation, is a common format for exchanging structured data between applications. Frontend applications frequently receive JSON responses from APIs and convert that data into information displayed to the user.' },
      { type: 'code', language: 'javascript', content: `const user = {
  name: 'Alex',
  role: 'Frontend Developer',
  skills: ['HTML', 'CSS', 'JavaScript']
};

console.log(user.name);
console.log(user.skills[0]);` },
      { type: 'heading', content: 'Frontend Frameworks' },
      { type: 'text', content: 'As frontend applications become larger, managing all the interface behavior with plain JavaScript can become difficult. Frontend frameworks and libraries provide patterns and tools for building reusable components, managing application state, handling navigation, and organizing complex interfaces.' },
      { type: 'code', language: 'text', content: `Frontend Technologies

Foundation
  ├── HTML
  ├── CSS
  └── JavaScript

Frameworks / Libraries
  ├── React
  ├── Vue
  └── Angular

Supporting Technologies
  ├── TypeScript
  ├── CSS Frameworks
  ├── Component Libraries
  └── Build Tools` },
      { type: 'text', content: 'React, Vue, and Angular are examples of technologies used to build modern frontend applications. They do not eliminate the need to understand HTML, CSS, and JavaScript. A strong frontend developer should understand the underlying web technologies before relying heavily on frameworks.' },
      { type: 'heading', content: 'Component-Based Development' },
      { type: 'text', content: 'Modern frontend development commonly uses components to break an interface into reusable pieces. A component can represent a button, navigation bar, product card, profile, form, or entire page section. Components make large interfaces easier to organize and reuse.' },
      { type: 'code', language: 'javascript', content: `function UserCard({ name, role }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}

function App() {
  return (
    <main>
      <UserCard
        name="Alex"
        role="Frontend Developer"
      />

      <UserCard
        name="Sam"
        role="UI Designer"
      />
    </main>
  );
}` },
      { type: 'text', content: 'Component-based development is one of the reasons frameworks such as React are useful. Instead of treating an application as one large page, developers can build it from smaller reusable pieces.' },
      { type: 'heading', content: 'Frontend Development Tools' },
      { type: 'text', content: 'Frontend developers use several tools throughout the development process. A code editor is used to write code, browser developer tools help inspect and debug applications, package managers install dependencies, and version control systems such as Git track changes.' },
      { type: 'code', language: 'text', content: `Common Frontend Tools

Code Editor
  → Write HTML, CSS, JavaScript

Browser
  → Run the application

DevTools
  → Inspect and debug

Terminal
  → Run development commands

Git
  → Track code changes

Package Manager
  → Install dependencies` },
      { type: 'heading', content: 'Frontend Build Tools' },
      { type: 'text', content: 'Modern frontend projects often use build tools to transform and optimize source code for the browser. These tools can bundle modules, process CSS, optimize assets, support development servers, and create production builds.' },
      { type: 'code', language: 'text', content: `Source Code
     |
     v
Build Tool
     |
     +--> Bundle JavaScript
     +--> Process CSS
     +--> Optimize Assets
     +--> Create Production Build
     |
     v
Browser` },
      { type: 'tip', content: 'You do not need to master every build tool immediately. First understand HTML, CSS, and JavaScript. Build tools become easier to understand once you know what they are helping you accomplish.' },
      { type: 'heading', content: 'Accessibility in Frontend Development' },
      { type: 'text', content: 'Frontend developers should build interfaces that can be used by as many people as possible, including users who rely on keyboards, screen readers, or other assistive technologies. Semantic HTML, meaningful labels, sufficient color contrast, keyboard-friendly interactions, and descriptive alternative text are important parts of accessible frontend development.' },
      { type: 'code', language: 'html', content: `<!-- Better -->
<button type="button">
  Save Changes
</button>

<!-- Better image accessibility -->
<img
  src="profile.jpg"
  alt="Alex's profile photo"
/>

<!-- Form label -->
<label for="email">
  Email address
</label>

<input
  id="email"
  type="email"
/>` },
      { type: 'heading', content: 'The Frontend Development Workflow' },
      { type: 'text', content: 'A typical frontend workflow begins with understanding the design or requirements, creating the structure with HTML, styling the interface with CSS, adding behavior with JavaScript, connecting the interface to APIs when necessary, testing across devices and browsers, and finally deploying the application.' },
      { type: 'code', language: 'text', content: `Requirements / Design
        ↓
      HTML
        ↓
       CSS
        ↓
   JavaScript
        ↓
   Components
        ↓
    API Data
        ↓
 Testing & Debugging
        ↓
    Production
        ↓
      Users` },
      { type: 'heading', content: 'Key Takeaways' },
      { type: 'text', content: 'Frontend development focuses on building the user-facing part of web applications. HTML provides structure and semantic meaning, CSS controls presentation and responsive layouts, and JavaScript adds logic and interactivity. The DOM allows JavaScript to interact with webpages, events allow applications to respond to users, and APIs allow frontend applications to communicate with external data sources. As applications become more complex, developers can use technologies such as React, Vue, and Angular to build reusable component-based interfaces.' },
      { type: 'tip', content: 'Master the foundation before the framework: HTML gives your interface structure, CSS gives it design, and JavaScript gives it behavior. Once these three are comfortable, React and other frontend technologies become much easier to understand.' },
    ],
  },
];