// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

function getCategoryIds() {
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

function getCategory(catId) {
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO

class Board {
	constructor() {
		this.$thead = $("thead");
		this.$tbody = $("tbody");
		this.makeHtmlBoard();
	}
	/** Make rows and table cells for both head and body */
	makeHtmlBoard() {
		// Add cells to table head
		for (let col = 0; col < 6; col++) {
			const $th = $("<th></th>");
			this.$thead.append($th);
		}

		// Make rows, adds cells to rows, and add rows to table body
		for (let row = 0; row < 5; row ++) {
			const $tr = $("<tr></tr>")
			for (let col = 0; col < 6; col ++) {
				const $td = $("<td></td>");
				$tr.append($td);
			}
			this.$tbody.append($tr);
		}
	}
	addCategories(categories) {
		for (let i = 0; i < 6; i++) {
			$("th").eq(i).text(categories[i].title);
		}
	}
	addClues(categories) {
		// Loop thru each tr
		const $trs = $("tr");
		console.log(categories[0].clues);

		for (let i = 0; i < $trs.length; i++) {
			const $tds = $trs.eq(i).children;
			// Loop thru each category
			for (let j = 0; j < categories.length; j++) {
				const td = $tds[j];
				const clues = categories[j].clues
				// console.log(categories[j])
				// const {question, answer, showing} = categories[j].clues[i];
				
				const clueTile = this.makeClueTile(clues);
			}
		}
		for(let category of categories) {
			const clues = category.clues
			// console.log(typeof clues);
			for (let [k, v] of Object.entries(clues)) {
				console.log(`${k}: ${v}`)
			}
			// for (let clue of category.clues) {
			// 	console.log(clue)
			// }
		}
	}
	makeClueTile(clues) {
		const $div1 = $(`<div class=showing>`)
		for (let clue of clues) {
			console.log(clue)
		}
	}
}

class Category {
	constructor(id, title) {
		this.id = id
		this.title = title
		this.clues = []
	}
	/**
	 * Retrieve 5 random clues from category and store in object
	 */
	async getClues() {
		const cluesUrl = `http://jservice.io/api/clues?id=${this.id}`
		const clueIndices = getRandomIndices(5);

		try {
			const clues = await axios.get(cluesUrl)
			for (let i of clueIndices) {
				const clue = clues.data[i];
				this.clues.push({
					question: clue.question,
					answer: clue.answer,
					showing: null
				});
			}
		} catch {
			alert("Error: Could not retrieve clues")
		}
	}

	/**
	 * Retrieve 100 categories from API
	 */
	static async getCategories() {
		const categoriesUrl = `http://jservice.io/api/categories?count=100`;
		try {
			const resp = await axios.get(categoriesUrl);
			return resp;
		} catch {
			alert("Error: could not retrieve categories");
		}
	}
	static pickRandomCategories(categoriesResp, indices){
		for (let i of indices) {
			const id = categoriesResp.data[i].id;
			const title = categoriesResp.data[i].title;
			// console.log(id, title)
			const category = new Category(id, title);
			categories.push(category)
		}

		return categories;
	}
}

class Game {
	constructor() {
		this.categories = [];
	}
}

/** Generate specified number of random indices 
 * to select random categories and clues */
function getRandomIndices(numIndices) {
	const indices = [];
	while (indices.length < numIndices) {
		const index = Math.floor(Math.random() * 100);
		if (indices.indexOf(index) === -1) {
			indices.push(index)
		}
	}

	return indices;
}

/** Button to start a new game */
$("#startGameBttn").on("click", async function(evt) {
	// evt.preventDefault();
	const jeopardy = new Game();
	
	const categoriesResp = await Category.getCategories();	
	const categoryIndices = getRandomIndices(6);
	jeopardy.categories =  Category.pickRandomCategories(categoriesResp,
		categoryIndices);

	for ( let category of categories ) {
		category.getClues();
	}
	
	const board = new Board();
	board.addCategories(jeopardy.categories);

	for (let category of categories) {
		console.log(category.clues[0])
	}
	
	
	/*
	// Randomly select 6 categories
	const categoriesResp = await Category.getCategories();	
	const categoryIndices = getRandomIndices();
	jeopardy.categories = Category.pickRandomCategories(categoriesResp, categoryIndices);
	
	// Retrieve clues for each category and add to category object
	for ( let category of categories ) {
		category.getClues();
	}
	*/
})

