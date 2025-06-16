async function getRecommendations() {
  const genre = document.getElementById("genre").value;
  const tropes = Array.from(document.getElementById("tropes").selectedOptions).map(opt => opt.value);
  const lastRead = document.getElementById("lastRead").value.trim().toLowerCase();

  let response;
  try {
    response = await fetch("books.json");
    if (!response.ok) throw new Error("Failed to load book data.");
  } catch (err) {
    alert("Could not fetch books.json. Make sure Live Server is running.");
    return;
  }

  const books = await response.json();

  const filteredBooks = books.filter(book => {
    const bookGenre = book.genre?.toLowerCase();
    const bookTropes = (book.tropes || []).map(t => t.toLowerCase());
    const matchesGenre = genre ? bookGenre === genre.toLowerCase() : true;
    const matchesTropes = tropes.length === 0 || tropes.some(trope => bookTropes.includes(trope.toLowerCase()));
    const notLastRead = lastRead ? book.title.toLowerCase() !== lastRead : true;

    return matchesGenre && matchesTropes && notLastRead;
  });

  showResults(filteredBooks);
}

function showResults(books) {
  let resultsDiv = document.getElementById("results");

  if (!resultsDiv) {
    resultsDiv = document.createElement("div");
    resultsDiv.id = "results";
    document.body.appendChild(resultsDiv);
  }

  resultsDiv.innerHTML = "";

  if (books.length === 0) {
    resultsDiv.innerHTML = "<p>No matching books found.</p>";
    return;
  }

  books.forEach(book => {
    const div = document.createElement("div");
    div.classList.add("book-card");
    div.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Genre:</strong> ${book.genre}</p>
      <p><strong>Tropes:</strong> ${book.tropes?.join(", ")}</p>
    `;
    resultsDiv.appendChild(div);
  });
}
