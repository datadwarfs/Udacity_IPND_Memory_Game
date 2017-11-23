(() => {
  'use strict';

  let click1 = {},
    click2 = {},
    level = "medium",
    numStars = 3,
    pairs = 8,
    gameStarted, matches, moves, timer, twoStar, oneStar;


  class Card {
    constructor(card, num) {
      let cardID = card.id + '-' + num;
      this.id = '#' + card.id + '-' + num;
      this.image = card.image;
      this.name = card.name;
      this.html = `<article class="card" id="${cardID}">
        <div class="card-back">
          <img src="images/${this.image}" class="card-image" >
        </div>
        <div class="card-front">
          <img src="images/rating-star.png" class="card-image" >
        </div>
      </article>`;
    }
  }


  const setLevel = (level) => {
    $('#startModal').hide();
    pairs = gameLevels[level].pairs;
    twoStar = gameLevels[level].twoStar;
    oneStar = gameLevels[level].oneStar;
    $('#game-board').removeClass('easy medium hard');
    $('#game-board').addClass(gameLevels[level].class);
  };


  // Card array set is based on level of difficulty
  const trimArray = (array) => {
    let newArray = array.slice();
    // arrays trimmed here
    while (newArray.length > pairs) {
      let randomIndex = Math.floor(Math.random() * newArray.length);
      newArray.splice(randomIndex, 1);
    }
    return newArray;
  };

  const makeCardArray = (data, level) => {

    let array = [];

    // array size determined here
    let trimmedData = trimArray(data, level);


    // Plus 2 of each trading card added to array
    trimmedData.forEach(function(card) {
      array.push(new Card(card, 1));
      array.push(new Card(card, 2));
    });

    return array;
  };

  const shuffle = (array) => {
    let currentIndex = array.length,
      temporaryValue, randomIndex;

    while (0 !== currentIndex) {

      // Randomization of element here
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      //toggle random element and current element
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  const displayCards = (cardArray) => {
    cardArray.forEach(function(card) {

      // Add cards to grid
      $('#game-board').append(card.html);

      // click listeners
      $(card.id).click(function() {

        // Start timer when the player begins playing the game
        if (!gameStarted) {
          // start the timer
          gameTimer();
          gameStarted = true;
        }

        // Check for match upon click
        checkMatch(card);
      });
    });
  };

  const checkMatch = (card) => {

    if (!click1.name) {
      click1 = card;
      $(card.id).addClass('flipped');
      return;

      // is the second card a different card??
    } else if (!click2.name && click1.id !== card.id) {
      click2 = card;
      $(card.id).addClass('flipped');

      // Update the move count
      moves++;
      $("#moves").text(moves);

      checkStars();
    } else return;

    if (click1.name === click2.name) {
      foundMatch();
    } else {
      hideCards();
    }

  };

  const foundMatch = () => {

    matches++;
    if (matches === pairs) {
      gameOver();
    }

    // this is for Unbinding click functions and also to reset the click objects
    $(click1.id).unbind('click');
    $(click2.id).unbind('click');
    // reset the click objects
    click1 = {};
    click2 = {};
  };

  const hideCards = () => {
    //hide cards
    setTimeout(function() {
      $(click1.id).removeClass('flipped');
      $(click2.id).removeClass('flipped');
      // reset click objects
      click1 = {};
      click2 = {};
    }, 600);
  };

  const gameOver = () => {
    clearInterval(timer);

    // Pause prior to shoe modal
    setTimeout(function() {
      $('#winModal').show();
    }, 500);

  };

  const checkStars = () => {
    let currentStars;
    if (moves >= oneStar) {
      currentStars = 1;
    } else if (moves >= twoStar) {
      currentStars = 2;
    } else currentStars = 3;
    if (numStars !== currentStars) {
      displayStars(currentStars);
    }

  };

  const gameTimer = () => {


    let startTime = new Date().getTime();

    // Update the timer every single second
    timer = setInterval(function() {

      var now = new Date().getTime();

      // Calculate elapsed time since player started playing the game
      var elapsed = now - startTime;

      // This will Calculate the minutes and seconds
      let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);


      // Add sttarting 0 if seconds are less than 10 seconds
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      let currentTime = minutes + ':' + seconds;

      // This will update the clock on game screen and modal
      $(".clock").text(currentTime);
    }, 750);

  };


  // THis will add starss to the game screen
  const displayStars = (num) => {
    const starImage = '<img src="images/rating-star.png">';
    $('.stars').empty();
    for (let i = 0; i < num; i++) {
      $('.stars').append(starImage);
    }
  };

  // This opens start modal on load
  $(window).on('load', function() {
    $('#startModal').show();
  });

  $('#openModal').click(function() {
    $('#winModal').show();
  });

  // This closes the modals when click outside modal
  $('#winModal #close-win, #overlay').click(function() {
    $('#winModal').hide();
  });


  $('#startModal #close-start, #overlay').click(function() {
    $('#startModal').hide();
  });


  $('.modal').click(function() {
    $('.modal').hide();
  });


  $('.modal-content').click(function(event) {
    event.stopPropagation();
  });


  // These are level modals
  $('#easy-level').click(function() {
    startGame(cardData, "easy");
  });


  $('#medium-level').click(function() {
    startGame(cardData, "medium");
  });


  $('#hard-level').click(function() {
    startGame(cardData, "hard");
  });


  // This allows the user to restart the game
  $('#restart').click(function() {
    $('#winModal').hide();
    $('#startModal').show();
  });

  const startGame = (cards, level) => {



    // These are the reset game variables
    gameStarted = false;
    moves = 0;
    matches = 0;
    setLevel(level);

    // resets HTML
    $('#game-board').empty();

    $(".clock").text('0:00');
    $("#moves").text('0');
    $('#winModal').hide();


    // This will get cards and start the game for the player.
    let cardArray = makeCardArray(cardData, level);


    shuffle(cardArray);
    displayCards(cardArray);
    displayStars(3);
  };

})();
