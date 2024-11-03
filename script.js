function clicked() {
  //Main function to return results after button is clicked
  if (validateInputs()) { //Two mandatory questions MUST be filled
    clearQuestions(); //Clear anything prior here just in case
    document.querySelector(".back-ques").style.display = 'block';

    let length = document.getElementById("Length").value;
    let userContentInput = document.getElementById("book-content-input").value.trim();
    let userAuthorInput = document.getElementById("book-author-input").value.trim();
    let bookLocationInput = document.getElementById("location-author-input").value.trim();
    let ratingInput = document.getElementById("Rating").value;
    
    if (length == "L1") { //Check what length is equal to in order to determine upper/lower bounds
      book_lower_bound = 0;
      book_upper_bound = 301;
    }
    else if (length == "L2") {
      book_lower_bound = 300;
      book_upper_bound = 501;
    }
    else {
      book_lower_bound = 500;
      book_upper_bound = 2000; //A buffer as I doubt many books are above a median of two thousand pages
    }

    if (ratingInput == "R1") {
      min_rating = 4.5;
      max_rating = 5;
    }
    else if (ratingInput == "R2") {
      min_rating = 3.5;
      max_rating = 4.5;
    }
    else if (ratingInput == "R3") {
      min_rating = 2.5;
      max_rating = 3.5;
    }
    else if (ratingInput == "R4") {
      min_rating = 2.0;
      max_rating = 2.5;
    } 
    else {
      min_rating = 2.0;
      max_rating = 5;
    }

    //Content is always required so we always append it
    append_string = "subject=" + userContentInput;

    if(userAuthorInput != ""){ //Check if author has a value and append it if it does
      append_string += "&author=" + userAuthorInput;
    }
    
    if(bookLocationInput != ""){ //Check if location has a value and append if it does
      append_string += "&place=" + bookLocationInput;
    }

    fetch("https://openlibrary.org/search.json?" + append_string) //Fetches the information with the append string added on
      .then((response) => response.json())
      .then((response) => {
        console.log("Empty author input")
        parseAndPrintData(response); //Parse and print the data
      });

    document.getElementById('display').innerHTML = ' <img class="image-load" src="./loading.gif" />';
  }
}

function parseAndPrintData(response) {
  succesful_recommendations = 0;
  document.getElementById(
    "display"
  ).innerHTML = ""
 
 
  for (let i = 0; i < response.docs.length; i++) { //Either iterates to the end or after it returns 10 books
    if (succesful_recommendations == 10) { //Returns 10 recommendations at most
      break;
    }
 
 
    if(response.docs[i].number_of_pages_median < book_upper_bound && response.docs[i].number_of_pages_median > book_lower_bound){ //The book needs to be within the page bounds
      if(!response.docs[i].ratings_average || response.docs[i].ratings_average < 2){ //If there's no rating or it is lower than 2 ignore it
        continue;
      }
    else{
      if(response.docs[i].ratings_average <= max_rating && response.docs[i].ratings_average > min_rating){
          document.getElementById(
            "display"
          ).innerHTML += `
          <div class="title-container">
            <div class="grid-container">
              <h2 class="title">${response.docs[i].title}</h2>  
              <p class="info"><strong>Author:</strong> ${response.docs[i].author_name ? response.docs[i].author_name.join(', ') : 'Unknown'}</p>
              <p class="info"><strong>Publish Year:</strong> ${response.docs[i].first_publish_year || 'N/A'}</p>
              <p class="info"><strong>First Sentence:</strong> ${response.docs[i].first_sentence?.[0] || 'N/A'}</p>
              <p class="info"><strong>Bookp Length:</strong> ${response.docs[i].number_of_pages_median || 'N/A'}</p>
              <p class="info"><strong>Rating:</strong> ${response.docs[i].ratings_average || 'N/A'}</p>
              
            </div>
            <div class="more-container">
            <div class="image-container">
              <img src="https://covers.openlibrary.org/b/isbn/${response.docs[i].isbn[0]}-M.jpg"/>
            </div>
            </div>
          </div>
          `;
        
          succesful_recommendations += 1;
          
        }
      }
    }
  }

  if (succesful_recommendations == 0) { //No reccomendation happened, so no books fitting the parameter were found
    document.getElementById("display").innerHTML += '<h3>Either no books were found with these parameters or none had an average rating higher than 2</h3>';
  }
  console.log(document.getElementById("display").innerHTML);
  console.log("end");
}


function clearQuestions() { //Clears the question area
  document.getElementById('question-section').style.display = 'none';
  document.getElementById('display').style.display = 'grid';
  document.getElementById('result-title').style.display = 'grid';
}


function clearCustom() {
  // clear the entry slide
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('question-section').style.display = 'block';

}


function displayError() { //Displays the error if they try to run it without filling in the required field
  const display = document.getElementById("display");
  Swal.fire({
    title: "Error",
    text: "Must answer all required questions",
    icon: "error"
  });
}

function validateInputs() {
  // Get selected values for genre and length

  const length = document.getElementById("Length").value;
  console.log(length);
  const userContentInput = document.getElementById("book-content-input").value.trim();

  // Check if either genre or length is not selected
  if (!length || !userContentInput) {
    displayError();
    return false; // Stop form submission
  }

  // Clear any previous error messages if validation passes
  return true; // Allow form submission
}

function backMenu() {
  document.getElementById('question-section').style.display = 'none';
  document.getElementById('welcome').style.display = 'block';
}

function backQuestions() {
  document.getElementById('display').style.display = 'none';
  document.getElementById('result-title').style.display = 'none';
  document.getElementById('question-section').style.display = 'block';
  document.querySelector(".back-ques").style.display = 'none';
}

function backHome() {
  document.getElementById('question-section').style.display = 'none';
  document.getElementById('welcome').style.display = 'block';
  document.getElementById('display').style.display = 'none';
  document.getElementById('result-title').style.display = 'none';
}