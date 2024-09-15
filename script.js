let clickCount = 0;

// Generates Movies
function displayRandomMedia(type) {
    const contentContainer = document.querySelector('.content-container');
    const content = contentContainer.querySelector('.content');
    if (content) {
        content.remove();
    }

    // creates pop up
    clickCount++;
    if (clickCount === 10) {
        promptForComment();
        clickCount = 0; // Reset click count after displaying the popup
    } else {
        const newContent = document.createElement('div');
        newContent.className = 'content'; // Add class for easier removal

        if (type === 'movie') {
            const randomMovie = getRandomMovie();
            newContent.innerHTML = `
                <h2>${randomMovie.title}</h2>
                <img src="${randomMovie.image}" alt="${randomMovie.title}" style="max-width: 40%;">
                <p>${randomMovie.description}</p>
            `;
        } else if (type === 'show') {
            const randomTVShow = getRandomTVShow();
            newContent.innerHTML = `
                <h2>${randomTVShow.title}</h2>
                <img src="${randomTVShow.image}" alt="${randomTVShow.title}" style="max-width: 40%;">
                <p>${randomTVShow.description}</p>
            `;
        }
        contentContainer.appendChild(newContent);
    }
}


// Array of movies
function getRandomMovie() {
    const movies = [
    {
  "title": "Black Panther (2018) - IMDb: 7.3/10",
  "image": "https://m.media-amazon.com/images/I/A1PaCX4oXjL.jpg",
  "description": "Marvel's superhero film follows T'Challa, the king of Wakanda, as he grapples with the responsibilities of the throne and the challenges to his nation. (PG-13)"
},
{
  "title": "Get Out (2017) - IMDb: 7.7/10",
  "image": "https://i.ebayimg.com/images/g/XgoAAOSwpnBjDKaF/s-l1600.jpg",
  "description": "A horror-thriller exploring racism and cultural appropriation as a young Black man discovers disturbing secrets during a visit to his white girlfriend's family estate. (R)"
},
{
  "title": "Hidden Figures (2016) - IMDb: 7.8/10",
  "image": "https://m.media-amazon.com/images/I/710stdsMzzL._AC_UF894,1000_QL80_.jpg",
  "description": "Based on true events, this film highlights the vital contributions of three African-American women mathematicians at NASA during the Space Race. (PG)"
},
{
  "title": "Moonlight (2016) - IMDb: 7.4/10",
  "image": "https://m.media-amazon.com/images/I/91Tu1WACkuL.jpg",
  "description": "A coming-of-age drama that chronicles the life of a young Black man named Chiron as he grapples with his identity and sexuality. (R)"
},
{
  "title": "Django Unchained (2012) - IMDb: 8.4/10",
  "image": "https://m.media-amazon.com/images/I/61xAjmBc-0L._AC_UF894,1000_QL80_.jpg",
  "description": "Quentin Tarantino's western follows a freed slave turned bounty hunter seeking to rescue his wife from a brutal plantation owner. (R)"
},
{
  "title": "The Help (2011) - IMDb: 8.0/10",
  "image": "https://m.media-amazon.com/images/M/MV5BMTM5OTMyMjIxOV5BMl5BanBnXkFtZTcwNzU4MjIwNQ@@._V1_.jpg",
  "description": "Set in 1960s Mississippi, this drama explores the relationships between Black maids and their white employers during the Civil Rights Movement. (PG-13)"
},
{
  "title": "Fruitvale Station (2013) - IMDb: 7.5/10",
  "image": "https://m.media-amazon.com/images/M/MV5BMDYxODgyOTItYWRjZS00ZTE5LWJkNmMtN2I4YmJjNTYxOWY5XkEyXkFqcGdeQXVyMTA4NjE0NjEy._V1_.jpg",
  "description": "Based on a true story, this film depicts the last day in the life of Oscar Grant, a young Black man shot by a transit officer in Oakland. (R)"
},
{
  "title": "Selma (2014) - IMDb: 7.5/10",
  "image": "https://amc-theatres-res.cloudinary.com/v1579119708/amc-cdn/production/2/movies/45900/45875/Poster/p_800x1200_Selma_En_030416.jpg",
  "description": "A historical drama focusing on Dr. Martin Luther King Jr.'s campaign for equal voting rights during the 1965 Selma to Montgomery marches. (PG-13)"
},
{
  "title": "12 Years a Slave (2013) - IMDb: 8.1/10",
  "image": "https://myhotposters.com/cdn/shop/products/HP3031_34e93235-ae75-43e0-a248-5133c24fd5e3_1024x1024.jpg?v=1571445096",
  "description": "An adaptation of Solomon Northup's memoir, this film tells the harrowing story of a free Black man kidnapped and sold into slavery. (R)"
},
{
  "title": "Ray (2004) - IMDb: 7.7/10",
  "image": "https://i.ebayimg.com/images/g/LiUAAOSwmGNfzUyE/s-l1600.jpg",
  "description": "A biopic depicting the life and career of legendary musician Ray Charles, exploring his triumphs and struggles. (PG-13)"
},
{
  "title": "Malcolm X (1992) - IMDb: 7.7/10",
  "image": "https://m.media-amazon.com/images/I/91x9FYikBIL._AC_UF894,1000_QL80_.jpg",
  "description": "Spike Lee directs this biographical film, chronicling the life and evolution of civil rights leader Malcolm X. (PG-13)"
},
{
  "title": "The Color Purple (1985) - IMDb: 7.8/10",
  "image": "https://m.media-amazon.com/images/M/MV5BYjBkNGE0NGYtYmU5Ny00NjRiLTk5MmYtMWU4NzYxMDE4YWY4XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg",
  "description": "Based on Alice Walker's novel, this film portrays the life of an African-American woman named Celie in the early 20th century. (PG-13)"
},
{
  "title": "Coming to America (1988) - IMDb: 7.1/10",
  "image": "https://image.tmdb.org/t/p/original/os1vUxxiRYNAq21phgH2B3eNX4r.jpg",
  "description": "Eddie Murphy stars as an African prince who travels to America to find true love and escape his arranged marriage. (R)"
},
{
  "title": "Coming 2 America (2021) - IMDb: 5.4/10",
  "image": "https://m.media-amazon.com/images/M/MV5BZTMyY2Q2MDctMDFlMS00MWEzLTk1NmEtNDcxNzg1ZGJlNGU5XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg",
  "description": "Prince Akeem returns to America when he discovers he has a long-lost son, igniting a new comedic adventure filled with hilarious encounters and cultural clashes. (PG-13)"
},
{
  "title": "Do the Right Thing (1989) - IMDb: 7.9/10",
  "image": "https://i.etsystatic.com/18242346/r/il/144e99/2458211731/il_fullxfull.2458211731_11kj.jpg",
  "description": "Spike Lee's iconic film explores racial tensions in a Brooklyn neighborhood during a scorching summer day. (R)"
},
{
  "title": "Precious (2009) - IMDb: 7.3/10",
  "image": "https://m.media-amazon.com/images/I/51p4BPTlr4L._AC_UF894,1000_QL80_.jpg",
  "description": "A powerful drama about an abused and illiterate teenager named Precious who strives for a better life. (R)"
},
{
  "title": "A Raisin in the Sun (1961) - IMDb: 8.0/10",
  "image": "https://d21ehp1kf1k9m9.cloudfront.net/wp-content/uploads/2022/08/22164914/a-raisin-in-the-sun-poster-250x455.jpg",
  "description": "Adapted from Lorraine Hansberry's play, this film explores the struggles of a Black family in 1950s Chicago. (NR)"
},
{
  "title": "The Pursuit of Happiness (2006) - IMDb: 8.0/10",
  "image": "https://m.media-amazon.com/images/M/MV5BMTQ5NjQ0NDI3NF5BMl5BanBnXkFtZTcwNDI0MjEzMw@@._V1_.jpg",
  "description": "Based on a true story, this film follows Chris Gardner's journey from homelessness to a successful career as a stockbroker. (PG-13)"
},
{
  "title": "Creed (2015) - IMDb: 7.6/10",
  "image": "https://cdn11.bigcommerce.com/s-yzgoj/images/stencil/1280x1280/products/2899156/5911624/MOVIB91465__73535.1679565231.jpg?c=2",
  "description": "A sports drama that follows Adonis Creed, the son of Apollo Creed, as he trains to become a professional boxer under the guidance of Rocky Balboa. (PG-13)"
},
{
  "title": "The Butler (2013) - IMDb: 7.2/10",
  "image": "https://m.media-amazon.com/images/M/MV5BMjA3MTg2MDk5OF5BMl5BanBnXkFtZTcwNjk5ODAxOQ@@._V1_.jpg",
  "description": "A historical drama about a White House butler who served eight American presidents and witnessed significant moments in American history. (PG-13)"
}



          

    ];
    return movies[Math.floor(Math.random() * movies.length)];
}

// Array of shows
function getRandomTVShow() {
    const tvShows = [
        
    {
        "title": "The Wire (2002–2008) - IMDb: 9.3",
        "image": "https://image.tmdb.org/t/p/original/nRaqqDDnIFFjJfWEK0yMlZ3FXc6.jpg",
        "description": "A gritty crime drama set in Baltimore, Maryland, exploring the interconnected lives of law enforcement, drug dealers, and residents. (TV-MA)"
    },
    {
        "title": "Atlanta (2016– ) - IMDb: 8.6",
        "image": "https://m.media-amazon.com/images/M/MV5BZGU1MzRhNmMtNDExOS00NTk2LWJlYzMtMzc4YWYyN2Q3M2ZmXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg",
        "description": "Follows the lives of two cousins navigating the Atlanta rap scene while addressing social and cultural issues with a unique blend of humor and drama. (TV-MA)"
    },
    {
        "title": "Black-ish (2014– ) - IMDb: 7.1",
        "image": "https://m.media-amazon.com/images/M/MV5BNzYwNmQwZGItNzdmNy00Y2ZkLWIxYzUtNDY3ZGIyYzY2M2MzXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_.jpg",
        "description": "A comedic series that tackles contemporary African-American family life, with a focus on cultural identity, race, and social issues. (TV-PG)"
    },
    {
        "title": "Insecure (2016– ) - IMDb: 7.8",
        "image": "https://i.ebayimg.com/images/g/8K0AAOSwMvJizCJR/s-l1600.jpg",
        "description": "Chronicles the friendship and experiences of two Black women as they navigate love, work, and life in Los Angeles. (TV-MA)"
    },
    {
        "title": "The Fresh Prince of Bel-Air (1990–1996) - IMDb: 7.9",
        "image": "https://m.media-amazon.com/images/I/81rHaJP+yIL._AC_UF894,1000_QL80_.jpg",
        "description": "Will Smith, a West Philadelphia teenager, moves to the affluent neighborhood of Bel-Air, California, to live with his wealthy relatives. (TV-PG)"
    },
    {
        "title": "Power (2014–2020) - IMDb: 8.1",
        "image": "https://ew.com/thmb/UdUyr5lTm431n436rL1g_TNgKHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/power-b811bdc302fe4a1fa32c6e2bc8e02847.jpg",
        "description": "Explores the world of a wealthy New York City nightclub owner involved in a dangerous and complex life of crime. (TV-MA)"
    },
    {
        "title": "Luke Cage (2016–2018) - IMDb: 7.3",
        "image": "https://pics.filmaffinity.com/Luke_Cage_TV_Series-482642394-large.jpg",
        "description": "Marvel's superhero series follows Luke Cage, a bulletproof Harlem vigilante, as he battles crime and corruption. (TV-MA)"
    },
    {
        "title": "The Cosby Show (1984–1992) - IMDb: 7.3",
        "image": "https://m.media-amazon.com/images/M/MV5BMzA3NDIwMjU3Nl5BMl5BanBnXkFtZTcwMTcxODgyMQ@@._V1_.jpg",
        "description": "A classic sitcom depicting the daily lives and humorous adventures of the Huxtable family, led by patriarch Dr. Heathcliff Huxtable. (TV-G)"
    },
    {
        "title": "How to Get Away with Murder (2014–2020) - IMDb: 8.1",
        "image": "https://i.ebayimg.com/images/g/y6AAAOSwYVNk~Am6/s-l1200.webp",
        "description": "A legal thriller that follows law professor Annalise Keating and her students as they become entangled in murder mysteries. (TV-14)"
    },
    {
        "title": "Dear White People (2017–2021) - IMDb: 6.2",
        "image": "https://myhotposters.com/cdn/shop/products/mL1003_1024x1024.jpg?v=1571445246",
        "description": "Examines race relations at a predominantly white Ivy League college through the experiences of several Black students. (TV-MA)"
    },
    {
        "title": "Empire (2015–2020) - IMDb: 6.8",
        "image": "https://m.media-amazon.com/images/I/613K6yNiB6L._AC_UF894,1000_QL80_.jpg",
        "description": "A family drama centered around a hip-hop music and entertainment empire, focusing on the Lyon family's power struggles. (TV-14)"
    },
    {
        "title": "Martin (1992–1997) - IMDb: 7.4",
        "image": "https://image.tmdb.org/t/p/original/inQQEpHiaSy8BEd9XEFF2W39vO0.jpg",
        "description": "A sitcom showcasing the comedic misadventures of Martin Payne and his friends in Detroit. (TV-PG)"
    },
    {
        "title": "A Different World (1987–1993) - IMDb: 6.8",
        "image": "https://m.media-amazon.com/images/I/516iM72nm1L._AC_UF894,1000_QL80_.jpg",
        "description": "A spin-off of The Cosby Show, it follows students at the fictional HBCU, Hillman College. (TV-PG)"
    },
    {
        "title": "Queen Sugar (2016– ) - IMDb: 7.5",
        "image": "https://pics.filmaffinity.com/Queen_Sugar_TV_Series-531790542-large.jpg",
        "description": "Chronicles the lives of the Bordelon siblings as they inherit their father's sugarcane farm in Louisiana. (TV-14)"
    },
    {
        "title": "Grown-ish (2018– ) - IMDb: 6.4",
        "image": "https://lh3.googleusercontent.com/proxy/QPS-TwGR-NT1jnbGm5v_jQhhsq6WTVp8yDJwz_yko8LelhE9l42j-x81hn9ZQPjFpZoI_7JzzCbSOU2RHraepEpTEGuCYIGKRnrpD7I",
        "description": "A spin-off of Black-ish, it follows the Johnson family's eldest daughter, Zoey, as she navigates college life. (TV-14)"
    },
    {
        "title": "The Jeffersons (1975–1985) - IMDb: 7.5",
        "image": "https://image.tmdb.org/t/p/original/wOuW8GYmZxmfloJ8aMolgE6TVOb.jpg",
        "description": "A classic sitcom that follows George and Weezy Jefferson as they move up to the Upper East Side of New York City. (TV-PG)"
    },
    {
        "title": "Orange Is the New Black (2013–2019) - IMDb: 8.1",
        "image": "https://i.ebayimg.com/images/g/IKsAAOSwc8xjBjRP/s-l1600.jpg",
        "description": "Explores the lives of female inmates at a minimum-security federal prison. (TV-MA)"
    },
    {
        "title": "Living Single (1993–1998) - IMDb: 7.2",
        "image": "https://m.media-amazon.com/images/M/MV5BNzA3ZjQzYjktMmQ5YS00YmZlLTk1YTAtYjIwMjNiMTYwMGUwXkEyXkFqcGdeQXVyMTkzODUwNzk@._V1_.jpg",
        "description": "Follows the lives and friendships of four single Black women living in a Brooklyn brownstone. (TV-PG)"
    },
    {
        "title": "Sister, Sister (1994–1999) - IMDb: 6.3",
        "image": "https://m.media-amazon.com/images/M/MV5BNmZmOGM2ZGMtNzc1Yi00NWVjLTlhZjktZDQ2MzFkOWVlODk1XkEyXkFqcGdeQXVyMjczOTU2NTI@._V1_.jpg",
        "description": "Twin sisters Tia and Tamera reunite and discover each other after being separated at birth. (TV-G)"
    },
    {
        "title": "Snowfall (2017– ) - IMDb: 8.2",
        "image": "https://pics.filmaffinity.com/Snowfall_TV_Series-726709842-large.jpg",
        "description": "Dives into the rise of the crack cocaine epidemic in 1980s Los Angeles and its impact on the city. (TV-MA)"
    },
    {
        "title": "Good Times (1974–1979) - IMDb: 7.4",
        "image": "https://flxt.tmsimg.com/assets/p55348_i_h8_ab.jpg",
        "description": "A sitcom focusing on the struggles and triumphs of a Black family living in a Chicago housing project. (TV-PG)"
    }




    ];
    return tvShows[Math.floor(Math.random() * tvShows.length)];
}