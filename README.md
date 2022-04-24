# Jeopardy
## General structure
* HTML table w/ categories in the thead and questions in tbody

## Category class
* Hold the name of the category and each question
* Does it need any methods?

## Board class
* Methods to fill each row with questions
* thead: 6 columns
* tbody: 5 rows of questions, 6 columns per row


## Game class
* Mostly event handlers methods
* Does it need any properties?





## Game board
7. Append categories to th elements and clues to td elements
8. Add 


**Ask Archana how to refactor the functions for the API calls to a more generalized version that can be used for both categories and clues!**


**Day 1**
* 2.5 hrs
* Created rough outline of program's logic
* Finished w/ API calls
* (Probably) done with category class
* Ready to tackle the HTML elements tomorrow!

* Create new game object
* Move logic for creating categories into methods in game


**Day 2**
Realized that JS refuses to retrieve clues from the data structure I created, have to scrap it and start again (or at least dramatically refactor code)

* Retrieve all of the categories, store id and title
* Winnow down to 6
* Loop thru categories
    * Each time make API call for clues
* Remake the 