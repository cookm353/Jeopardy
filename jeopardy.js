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
	/** Add category titles to table head */
	addCategories(categories) {
		for (let i = 0; i < 6; i++) {
			const title = categories[i].title;
			$("th").eq(i).text(title.toUpperCase());
		}
	}
	/** Add clues to table body */
	addClues(categories) {
		// Loop thru each tr
		const $trs = $("tr");

		for (let i = 0; i < $trs.length; i++) {
			// Loop thru each category
			for (let j = 0; j < categories.length; j++) {
				const $td = $trs.eq(i).children().eq(j)
				const clues = categories[j].clues

				const divs = this.makeClueTile(clues[i], i)
				$td.append(...divs);
			}
		}

	}
	makeClueTile(clue, i) {
		const { question, answer } = clue;
		const clueValue = `$${200 + 200*i}`
		const $div1 = $(`<div class="tile value">${clueValue}</div>`)
		const $div2 = $(`<div class="tile question">${question}</div>`)
		const $div3 = $(`<div class="tile answer">${answer}</div>`)
		
		return [$div1, $div2, $div3];
	}
}

class Category {
	constructor(id, title) {
		this.id = id
		this.title = title
		this.clues = []
	}
	/**
	 * Retrieve clues and store
	 */
	async getClues() {
		const cluesUrl = `https://jservice.io/api/clues?category=${this.id}`

		try {
			const cluesResp = await axios.get(cluesUrl)
			const clues = cluesResp.data
			clues.map(clue => {
				this.clues.push({
					question: clue.question,
					answer: clue.answer
				})
			})
		} catch {
			alert("Error: Could not retrieve clues")
		}
	}

	/**
	 * Retrieve 100 categories from API
	 */
	static async getCategories() {
		const categoriesUrl = `http://jservice.io/api/categories?count=40`;
		try {
			const resp = await axios.get(categoriesUrl);
			return resp;
		} catch {
			alert("Error: could not retrieve categories");
		}
	}
	/**
	 * Pick 6 random categories
	 */
	static pickRandomCategories(categoriesResp){
		const indices = getRandomIndices(6);

		return indices.map(i => {
			const id = categoriesResp.data[i].id;
			const title = categoriesResp.data[i].title;
			const category = new Category(id, title);
			return category
		})
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
		const index = Math.floor(Math.random() * 40);
		if (indices.indexOf(index) === -1) {
			indices.push(index);
		}
	}
	return indices;
}

/** Capitalize the first letter of each word */
function toTitleCase(string) {
	const words = string.split(" ");
	return words.map(word => newWord = word[0].toUpperCase() 
		+ word.slice(1)).join(" ");
}

function removeTile(tile) {
	if (tile.classList != "tile answer" ) {
		tile.nextSibling.style.display = "block";
		tile.remove()
	}
}

/** Button to start a new game */
$("#startGameBttn").on("click", async function(evt) {
	
	$("thead").html("")
	$("tbody").html("")

	const jeopardy = new Game();
	
	// Get 6 random categories
	const categoriesResp = await Category.getCategories();	
	const categories = Category.pickRandomCategories(categoriesResp);

	// Get clues for each category
	for (let category of categories) {
		await category.getClues();
		jeopardy.categories.push(category);
	}

	// Make a board then add clues and categories
	const board = new Board();
	board.addCategories(jeopardy.categories);
	board.addClues(jeopardy.categories);
})

// $("tbody").on("click", ".tile", (evt) => {
$("tbody, .tile").on("click", "td", (evt) => {
	if (evt.target.tagName === "TD") {
		const tiles = evt.target.children;
		for (let tile of tiles) {
			removeTile(tile)
		}
	} else if (evt.target.tagName === "DIV") {
		const tile = evt.target;
		removeTile(tile)
	}
})