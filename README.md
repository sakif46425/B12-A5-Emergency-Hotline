1. Difference between getElementById, getElementsByClassName, and querySelector / querySelectorAll
•	getElementById("idName")
o	Selects one element by its id.
o	Returns a single element object (or null if not found).
o	Example:
o	document.getElementById("header");
•	getElementsByClassName("className")
o	Selects all elements with a given class.
o	Returns a live HTMLCollection (updates automatically if DOM changes).
o	Must be accessed by index if multiple elements exist.
o	document.getElementsByClassName("item")[0];
•	querySelector("selector")
o	Selects the first element that matches a CSS selector.
o	Example:
o	document.querySelector(".item"); // first element with class "item"
•	querySelectorAll("selector")
o	Selects all elements that match a CSS selector.
o	Returns a static NodeList (does not update if DOM changes).
o	Example:
o	document.querySelectorAll(".item"); // all elements with class "item"
 In short:
•	getElementById → single element (by ID)
•	getElementsByClassName → multiple elements (live list)
•	querySelector → first match (any CSS selector)
•	querySelectorAll → all matches (static list)

2. How to create and insert a new element into the DOM?
You can use createElement + appendChild / append / prepend / insertBefore.
Example:
// Create a new <p> element
let newPara = document.createElement("p");
newPara.textContent = "This is a new paragraph.";

// Insert into the DOM (inside a div with id="container")
document.getElementById("container").appendChild(newPara);
Other insertion methods:
•	element.append(newNode) → add at end (can also append text).
•	element.prepend(newNode) → add at beginning.
•	parent.insertBefore(newNode, referenceNode) → insert before a specific child.

3. What is Event Bubbling and how does it work?
•	Event Bubbling: When an event (like click) happens on an element, it first runs the handler on that element, then moves upward through its ancestors (parent → grandparent → document → window).
•	Example:
•	<div id="parent">
•	  <button id="child">Click Me</button>
•	</div>
•	document.getElementById("child").addEventListener("click", () => {
•	  console.log("Child clicked");
•	});
•	
•	document.getElementById("parent").addEventListener("click", () => {
•	  console.log("Parent clicked");
•	});
Clicking the button will log:
Child clicked
Parent clicked

4. What is Event Delegation in JavaScript? Why is it useful?
•	Event Delegation: Instead of adding event listeners to multiple child elements, you add a single event listener on a parent element and use event.target to detect which child triggered the event.
•	This works because of event bubbling.
Example:
document.getElementById("list").addEventListener("click", function(e) {
  if (e.target.tagName === "LI") {
    console.log("You clicked on:", e.target.textContent);
  }
});
•	Useful because:
1.	Improves performance (fewer listeners in memory).
2.	Works for dynamically added elements (you don’t need to reattach listeners).

5. Difference between preventDefault() and stopPropagation()
•	preventDefault()
o	Prevents the default browser behavior of an event.
o	Example: Stop a form from submitting.
o	document.querySelector("form").addEventListener("submit", function(e) {
o	  e.preventDefault(); // prevents page reload
o	  console.log("Form submission stopped");
o	});
•	stopPropagation()
o	Stops the event from bubbling up (or capturing down) the DOM tree.
o	Example: Stop parent from reacting when a child is clicked.
o	document.getElementById("child").addEventListener("click", function(e) {
o	  e.stopPropagation(); // parent won't be triggered
o	  console.log("Child only, no bubbling");
o	});
 In short:
•	preventDefault() → stop default browser action.
•	stopPropagation() → stop event from traveling through DOM.

