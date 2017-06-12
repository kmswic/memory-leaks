// Import React
import React from "react";

// Import Spectacle Core tags
import {
  BlockQuote,
  Cite,
  Deck,
  Heading,
  ListItem,
  List,
  Quote,
  Slide,
  Text, MarkdownSlides, Image, Fill, Appear, CodePane
} from "spectacle";

// Import image preloader util
import preloader from "spectacle/lib/utils/preloader";

// Import theme
import createTheme from "spectacle/lib/themes/default";

// Require CSS
require("normalize.css");
require("spectacle/lib/themes/default/index.css");


const images = {
  city: require("../assets/city.jpg"),
  kat: require("../assets/kat.png"),
  logo: require("../assets/formidable-logo.svg"),
  markdown: require("../assets/markdown.png"),
  mario: require("../assets/MegaCon_2010_-_Luigi_and_Mario_(4572045686).jpg"),
  mario2: require("../assets/grym-gatukonst.jpg")
};

preloader(images);

const theme = createTheme({
  primary: "#1F2022",
  secondary: "white",
  tertiary: "#03A9FC",
  quartenary: "#CECECE"
}, {
  primary: "Montserrat",
  secondary: "Montserrat"
});

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck transition={["zoom"]} transitionDuration={500} theme={theme} bgColor="primary" textColor="secondary">
        <Slide transition={["zoom"]}>
          <Heading size={1} fit>Memory leaks</Heading>
          <Text fit textColor="secondary"> What developers and plumbers have in common </Text>
        </Slide>

        <Slide>
          <Image src={images.mario}/>
        </Slide>

        <Slide>
          <Heading size={2} fit>What are they?</Heading>
          <Text textColor="secondary">
            Broadly speaking, a program leaks memory when it doesn't release memory that it's no longer using.
          </Text>
        </Slide>

        <Slide>
          <Heading size={2} fit>And why are they so bad?</Heading>
          <Fill>
            <List>
              <ListItem>GC pauses</ListItem>
              <ListItem>Swapping</ListItem>
              <ListItem>Crashing</ListItem>
            </List>
          </Fill>
        </Slide>

        <Slide>
          <Heading size={2} fit> Are memory leaks possible in JS?</Heading>
          <Appear>
            <Heading size={4} textColor="secondary">No. But yes.</Heading>
          </Appear>
          <Appear>
            <Text textColor="secondary">
              By some definitions, it's not a leak if memory can be reclaimed at least in theory.
            </Text>
          </Appear>
        </Slide>

        {MarkdownSlides`
## Gargbage Collector
- Piece of language runtime
- Naive: Reference counting (IE 6-7 DOM)
- Modern: Mark & Sweep algorithm
          `}

        <Slide textColor="secondary">
          <Heading size={4} style={{marginBottom: ".5em"}} textColor="secondary">Example 1 (warm-up)</Heading>
          <CodePane margin="1em" lang="javascript" source={`
function foo(arg) {
  this.bar = "bar";
}

foo();

`}
          />
          <Appear>
            <Text textColor="secondary">Accidental global variables</Text>
          </Appear>
        </Slide>

        <Slide transition={["fade"]}>
          <Heading size={4} style={{marginBottom: ".5em"}} textColor="secondary">Example 2</Heading>
          <CodePane lang="javascript" source={`
var element = document.getElementById('button');

function onClick(event) {
    element.innerHtml = 'text';
}

element.addEventListener('click', onClick);
// Do stuff
// ...
element.parentNode.removeChild(element);
`}
          />
        </Slide>

        <Slide transition={["fade"]}>
          <Heading size={4} style={{marginBottom: ".5em"}} textColor="secondary">Example 2</Heading>
          <CodePane lang="javascript" source={`
var element = document.getElementById('button');

function onClick(event) {
    element.innerHtml = 'text';
}

element.addEventListener('click', onClick);
// Do stuff
element.removeEventListener('click', onClick);
element.parentNode.removeChild(element);
`}
          />
          <Appear>
            <Text textColor="secondary">Forgotten event listeners</Text>
          </Appear>
        </Slide>

        <Slide transition={["fade"]}>
          <Heading size={4} style={{marginBottom: ".5em"}} textColor="secondary">Example 2</Heading>
          <CodePane lang="javascript" source={`
var element = document.getElementById('button');

function onClick(event) {
    element.innerHtml = 'text';
}

document.addEventListener('click', onClick);
// Do stuff
// ...
// Important!
document.removeEventListener('click', onClick);
`}
          />

          <Text textColor="secondary">Forgotten event listeners</Text>

        </Slide>

        <Slide transition={["fade"]}>
          <Heading size={4} style={{marginBottom: ".5em"}} textColor="secondary">Example 3</Heading>
          <CodePane lang="javascript" source={`
var elements = {
    button: document.getElementById('button'),
    image: document.getElementById('image'),
    text: document.getElementById('text')
};

function doStuff() {
    image.src = 'http://some.url/image';
    button.click();
    console.log(text.innerHTML);
    // ... Much more logic
}

function removeButton() {
    // The button is a direct child of body.
    document.body.removeChild(document.getElementById('button'));

}
`}
          />
          <Appear>
            <Text textColor="secondary">Detached DOM nodes</Text>
          </Appear>
        </Slide>

        <Slide><Heading size={4}/>Time for some plumbing!</Slide>

        <Slide>
          <Heading size={4} textColor="secondary">Tales from the trenches</Heading>
          <List>
            <Text textColor="secondary">Source 1: Incorrect cleanup/lifecycle management</Text>
            <Text textColor="secondary" style={{marginTop: '1em'}}>Moral: learn your framework/codebase well</Text>
          </List>
        </Slide>

        <Slide>
          <Heading size={4} textColor="secondary">Tales from the trenches</Heading>
          <List>
            <Text textColor="secondary">Source 2: Incorrect use (no cleanup) of external plugins</Text>
            <Text textColor="secondary" style={{marginTop: '1em'}}>Moral: learn your library APIs well</Text>
          </List>
        </Slide>

        <Slide>
          <Heading size={4} textColor="secondary">Tales from the trenches</Heading>
          <List>
            <Text textColor="secondary">Source 3: Bugs in framework code</Text>
            <Text textColor="secondary" style={{marginTop: '1em'}}>Moral: Make sure you know what you're doing. If in
              doubt, use tried and proven solutions.</Text>
          </List>
        </Slide>

        <Slide>
          <Heading size={2}>Sources</Heading>
          <List>
            <ListItem>https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/</ListItem>
            <ListItem>https://developer.chrome.com/devtools/docs/demos/memory</ListItem>
            <ListItem>http://point.davidglasser.net/2013/06/27/surprising-javascript-memory-leak.html</ListItem>
          </List>
        </Slide>

        <Slide>
          <Heading size={4} textColor="secondary">Thanks, and happy plumbing!</Heading>
          <Image src={images.mario2} width={300}/>
        </Slide>


        <Slide transition={["fade"]}>
          <Heading size={4} style={{marginBottom: ".5em"}} textColor="secondary">Bonus example</Heading>
          <CodePane lang="javascript" source={`
var run = function () {
  var str = new Array(1000000).join('*');
  var doSomethingWithStr = function () {
    if (str === 'something')
      console.log("str was something");
  };
  doSomethingWithStr();
}
setInterval(run, 1000);
`}
          />
          <Text textColor="secondary">Closures</Text>
        </Slide>


        <Slide transition={["fade"]}>
          <Heading size={4} style={{marginBottom: ".5em"}} textColor="secondary">Bonus example</Heading>
          <CodePane lang="javascript" source={`
var run = function () {
  var str = new Array(1000000).join('*');
  var logIt = function () {
    console.log('interval');
  };
  setInterval(logIt, 100);
};
setInterval(run, 1000);
`}
          />
          <Appear>
            <Text textColor="secondary">Closure with shared scope</Text>
          </Appear>
        </Slide>

        <Slide transition={["fade"]}>
          <Heading size={4} style={{marginBottom: ".5em"}} textColor="secondary">Bonus example</Heading>
          <CodePane lang="javascript" source={`
var run = function () {
  var str = new Array(1000000).join('*');
  var doSomethingWithStr = function () {
    if (str === 'something')
      console.log("str was something");
  };
  doSomethingWithStr();
  var logIt = function () {
    console.log('interval');
  }
  setInterval(logIt, 100);
};
setInterval(run, 1000);
`}
          />
          <Appear>
            <Text textColor="secondary">Closure with shared scope</Text>
          </Appear>
        </Slide>

        {/*-----------------------------------------------------------------------*/}

      </Deck>
    );
  }
}
