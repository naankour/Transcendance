require("dotenv").config({
    path: "../.env"
});

const prisma = require("./prismaClient");
const bcrypt = require("bcryptjs");

const movies = [
    {
        title: "Inception",
        synopsis: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
        poster: "https://image.tmdb.org/t/p/w1280/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
        release_date: new Date("2010-07-16"),
        tmdb_id: 27205,
        average_rating: 0
    },
    {
        title: "Titanic",
        synopsis: "101-year-old Rose DeWitt Bukater tells the story of her life aboard the Titanic, where she fell in love with Jack Dawson during the ship's first and only voyage.",
        poster: "https://image.tmdb.org/t/p/w1280/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
        release_date: new Date("1997-12-19"),
        tmdb_id: 597,
        average_rating: 0
    },
    {
        title: "The Matrix",
        synopsis: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        poster: "https://image.tmdb.org/t/p/w1280/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        release_date: new Date("1999-03-31"),
        tmdb_id: 603,
        average_rating: 0
    },
    {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        synopsis: "A young hobbit is entrusted with an ancient ring and must leave his home to destroy it before the Dark Lord can use it.",
        poster: "https://image.tmdb.org/t/p/w1280/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
        release_date: new Date("2001-12-19"),
        tmdb_id: 120,
        average_rating: 0
    },
    {
        title: "The Lord of the Rings: The Two Towers",
        synopsis: "The surviving members of the Fellowship continue their journey while kingdoms prepare for war against the forces of darkness.",
        poster: "https://image.tmdb.org/t/p/w1280/rrGlNlzFTrXFNGXsD7NNlxq4BPb.jpg",
        release_date: new Date("2002-12-18"),
        tmdb_id: 121,
        average_rating: 0
    },
    {
        title: "The Lord of the Rings: The Return of the King",
        synopsis: "The final battle for Middle-earth begins as Frodo and Sam approach Mount Doom to destroy the One Ring.",
        poster: "https://image.tmdb.org/t/p/w1280/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
        release_date: new Date("2003-12-17"),
        tmdb_id: 122,
        average_rating: 0
    },
    {
        title: "Harry Potter and the Philosopher's Stone",
        synopsis: "An orphaned boy discovers he is a wizard and begins his first year at Hogwarts School of Witchcraft and Wizardry.",
        poster: "https://image.tmdb.org/t/p/w1280/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
        release_date: new Date("2001-11-16"),
        tmdb_id: 671,
        average_rating: 0
    },
    {
        title: "Harry Potter and the Chamber of Secrets",
        synopsis: "Harry returns to Hogwarts and discovers a mysterious chamber containing a dangerous secret.",
        poster: "https://image.tmdb.org/t/p/w1280/sdEOH0992YZ0QSxgXNIGLq1ToUi.jpg",
        release_date: new Date("2002-11-15"),
        tmdb_id: 672,
        average_rating: 0
    },
    {
        title: "Harry Potter and the Prisoner of Azkaban",
        synopsis: "Harry learns about Sirius Black and uncovers secrets about his parents and his past.",
        poster: "https://image.tmdb.org/t/p/w1280/aWxwnYoe8p2d2fcxOqtvAtJ72Rw.jpg",
        release_date: new Date("2004-06-04"),
        tmdb_id: 673,
        average_rating: 0
    },
    {
        title: "Spider-Man",
        synopsis: "After being bitten by a genetically altered spider, a teenager gains spider-like abilities and must embrace his responsibilities.",
        poster: "https://image.tmdb.org/t/p/w1280/gh4cZbhZxyTbgxQPxD0dOudNPTn.jpg",
        release_date: new Date("2002-05-03"),
        tmdb_id: 557,
        average_rating: 0
    },
    {
        title: "Men in Black",
        synopsis: "A police officer joins a secret organization that monitors extraterrestrial activity on Earth and must help stop a dangerous alien threat.",
        poster: "https://image.tmdb.org/t/p/w1280/f24UVKq3UiQWLqGWdqjwkzgB8j8.jpg",
        release_date: new Date("1997-07-02"),
        tmdb_id: 607,
        average_rating: 0
    },
    {
        title: "Hancock",
        synopsis: "A superhero with a bad reputation is convinced by a public relations expert to change his image and become a better hero.",
        poster: "https://image.tmdb.org/t/p/w1280/7DyuV2G0hLEqHeuefOQ3ZJbZ9a1.jpg",
        release_date: new Date("2008-07-02"),
        tmdb_id: 8960,
        average_rating: 0
    },
    {
        title: "Seven Pounds",
        synopsis: "A man with a mysterious plan tries to change the lives of seven strangers while carrying a heavy secret from his past.",
        poster: "https://image.tmdb.org/t/p/w1280/9j5Lx1L0g8L9kY2V2pG5dY2kJ.jpg",
        release_date: new Date("2008-12-19"),
        tmdb_id: 15357,
        average_rating: 0
    },
    {
        title: "Charlie and the Chocolate Factory",
        synopsis: "A young boy wins a golden ticket to visit Willy Wonka's mysterious chocolate factory and discovers its incredible secrets.",
        poster: "https://image.tmdb.org/t/p/w1280/wfGfxtu4O2mZf2tG7m7ZtYfQmX.jpg",
        release_date: new Date("2005-07-13"),
        tmdb_id: 118,
        average_rating: 0
    },
    {
        title: "The Dark Knight",
        synopsis: "Batman faces a criminal mastermind known as the Joker, who pushes Gotham City into chaos and challenges Batman's ideals.",
        poster: "https://image.tmdb.org/t/p/w1280/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        release_date: new Date("2008-07-18"),
        tmdb_id: 155,
        average_rating: 0
    },
    {
        title: "Pirates of the Caribbean: The Curse of the Black Pearl",
        synopsis: "A pirate captain, a blacksmith and a governor's daughter become involved in a quest to rescue her from cursed pirates.",
        poster: "https://image.tmdb.org/t/p/w1280/8V6s8jZ5s8K4Z5M8q4Yw1Q8QZ8.jpg",
        release_date: new Date("2003-07-09"),
        tmdb_id: 22,
        average_rating: 0
    },
    {
        title: "Pirates of the Caribbean: Dead Man's Chest",
        synopsis: "Captain Jack Sparrow owes a debt to the legendary Davy Jones and must find a way to escape his terrible fate.",
        poster: "https://image.tmdb.org/t/p/w1280/uXEqmloGyP7UXAiphJUu2v2H.jpg",
        release_date: new Date("2006-07-07"),
        tmdb_id: 58,
        average_rating: 0
    },
    {
        title: "Mr. & Mrs. Smith",
        synopsis: "A married couple discovers they are both secretly professional assassins working for competing organizations.",
        poster: "https://image.tmdb.org/t/p/w1280/dPrUPFcgLfNbmDL8V69vcrTyEfb.jpg",
        release_date: new Date("2005-06-10"),
        tmdb_id: 787,
        average_rating: 0
    },
    {
        title: "The Curious Case of Benjamin Button",
        synopsis: "A man is born with a strange condition that causes him to age backwards, experiencing life in an unusual way.",
        poster: "https://image.tmdb.org/t/p/w1280/26wEWZYt6yJkwRVkjcbwJEFh9IS.jpg",
        release_date: new Date("2008-12-25"),
        tmdb_id: 4922,
        average_rating: 0
    },
    {
        title: "Twilight",
        synopsis: "A teenage girl moves to a new town and falls in love with a mysterious vampire who struggles to control his nature.",
        poster: "https://image.tmdb.org/t/p/w1280/3Gkb6jm6962ADUPaCBqzz9CTbn9.jpg",
        release_date: new Date("2008-11-21"),
        tmdb_id: 8966,
        average_rating: 0
    },
    {
        title: "High School Musical",
        synopsis: "A popular high school athlete and an academically focused girl discover their shared love for singing and must overcome social expectations.",
        poster: "https://image.tmdb.org/t/p/w1280/8mW0xYxY6Y9QZ6Y6Y6Y6Y6Y6.jpg",
        release_date: new Date("2006-01-20"),
        tmdb_id: 10947,
        average_rating: 0
    },
    {
        title: "Camp Rock",
        synopsis: "A talented young singer attends a summer music camp where she discovers friendship, confidence and her own voice.",
        poster: "https://image.tmdb.org/t/p/w1280/7f5v5J5Y5Y5Y5Y5Y5Y5Y5Y5.jpg",
        release_date: new Date("2008-06-20"),
        tmdb_id: 13655,
        average_rating: 0
    },
    {
        title: "The Devil Wears Prada",
        synopsis: "A young woman lands a job as an assistant to a powerful fashion magazine editor and discovers the demanding world of fashion.",
        poster: "https://image.tmdb.org/t/p/w1280/8912AsVuS7Sj915apArUFbv6.jpg",
        release_date: new Date("2006-06-30"),
        tmdb_id: 350,
        average_rating: 0
    },
    {
        title: "Fight Club",
        synopsis: "An insomniac office worker and a mysterious soap maker create an underground fight club that evolves into something much bigger.",
        poster: "https://image.tmdb.org/t/p/w1280/pB9L0jAnEQLMKgexqCEocEW8TA.jpg",
        release_date: new Date("1999-10-15"),
        tmdb_id: 550,
        average_rating: 0
    },
    {
        title: "Avatar",
        synopsis: "A paraplegic marine is sent to Pandora and becomes involved with the native inhabitants while discovering a new world.",
        poster: "https://image.tmdb.org/t/p/w1280/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
        release_date: new Date("2009-12-18"),
        tmdb_id: 19995,
        average_rating: 0
    },
    {
        title: "Shutter Island",
        synopsis: "A U.S. marshal investigates the disappearance of a patient from a mysterious psychiatric facility located on an isolated island.",
        poster: "https://image.tmdb.org/t/p/w1280/nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg",
        release_date: new Date("2010-02-19"),
        tmdb_id: 11324,
        average_rating: 0
    },

    {
        title: "Alice in Wonderland",
        synopsis: "A young woman follows a strange rabbit into a magical world where she encounters unusual creatures and characters.",
        poster: "https://image.tmdb.org/t/p/w1280/9g0s9Q3z9Q3z9Q3z9Q3z9Q3z.jpg",
        release_date: new Date("2010-03-05"),
        tmdb_id: 12155,
        average_rating: 0
    },
    {
        title: "The Amazing Spider-Man",
        synopsis: "After Peter Parker is bitten by a genetically altered spider, he gains extraordinary abilities and begins to uncover the truth about his parents while facing a dangerous new enemy.",
        poster: "https://image.tmdb.org/t/p/w1280/fSbqPbqXa7ePo8bcnZYN9BDx0m.jpg",
        release_date: new Date("2012-07-03"),
        tmdb_id: 1930,
        average_rating: 0
    },
    {
        title: "Batman Begins",
        synopsis: "After witnessing his parents' murder as a child, Bruce Wayne travels the world and trains to become Batman, fighting crime and corruption in Gotham City.",
        poster: "https://image.tmdb.org/t/p/w1280/8RW2runSEc34IwKN2D1aPcJd2UL.jpg",
        release_date: new Date("2005-06-15"),
        tmdb_id: 272,
        average_rating: 0
    },
    {
        title: "King Kong",
        synopsis: "A filmmaker and his crew travel to a mysterious island where they discover a giant gorilla and a lost world filled with dangerous creatures.",
        poster: "https://image.tmdb.org/t/p/w1280/iQ7qjHqzqQqQqQqQqQqQqQqQ.jpg",
        release_date: new Date("2005-12-14"),
        tmdb_id: 254,
        average_rating: 0
    }
];

const users = [
    {
        username: "nazihakun",
        email: "aankour.naziha@gmail.com",
        password: "Password123.",
    },
    {
        username: "NainPosteur",
        email: "chloe.montaigut@gmail.com",
        password: "Password123.",
    },
    {
        username: "Zainab",
        email: "zeinab0695@gmail.com",
        password: "Password123.",
    },
    {
        username: "macedoine",
        email: "maceopinguet@gmail.com",
        password: "Password123.",
    },
    {
        username: "hasnawww",
        email: "iliane.hsn@outlook.fr",
        password: "Password123.",
    }
];

const reviews = [
    // Inception
    { user_id: 1, movie_id: 1, rating: 5, content: "A masterpiece with an incredible story and amazing visuals." },
    { user_id: 2, movie_id: 1, rating: 4, content: "Very creative movie but it requires a lot of attention." },

    // Titanic
    { user_id: 3, movie_id: 2, rating: 5, content: "A timeless love story with unforgettable emotions." },
    { user_id: 4, movie_id: 2, rating: 4, content: "Beautiful movie with great acting and music." },

    // The Matrix
    { user_id: 5, movie_id: 3, rating: 5, content: "A revolutionary science fiction movie." },
    { user_id: 1, movie_id: 3, rating: 4, content: "Great action scenes and interesting ideas about reality." },

    // LOTR Fellowship
    { user_id: 2, movie_id: 4, rating: 5, content: "An amazing beginning to one of the greatest fantasy adventures." },
    { user_id: 3, movie_id: 4, rating: 5, content: "Fantastic world building and unforgettable characters." },

    // LOTR Two Towers
    { user_id: 4, movie_id: 5, rating: 5, content: "The battle scenes are legendary and very impressive." },
    { user_id: 5, movie_id: 5, rating: 4, content: "A great sequel with an epic atmosphere." },

    // LOTR Return of the King
    { user_id: 1, movie_id: 6, rating: 5, content: "A perfect ending for an incredible trilogy." },
    { user_id: 2, movie_id: 6, rating: 5, content: "Emotional, epic and beautifully made." },

    // Harry Potter 1
    { user_id: 3, movie_id: 7, rating: 5, content: "A magical movie that started an amazing saga." },
    { user_id: 4, movie_id: 7, rating: 4, content: "A nostalgic and charming fantasy movie." },

    // Harry Potter 2
    { user_id: 5, movie_id: 8, rating: 4, content: "A darker Hogwarts adventure with great moments." },
    { user_id: 1, movie_id: 8, rating: 4, content: "A fun continuation of Harry's story." },

    // Harry Potter 3
    { user_id: 2, movie_id: 9, rating: 5, content: "One of the best Harry Potter movies." },
    { user_id: 3, movie_id: 9, rating: 5, content: "Great atmosphere and excellent direction." },

    // Spider-Man
    { user_id: 4, movie_id: 10, rating: 4, content: "A classic superhero movie with a great story." },
    { user_id: 5, movie_id: 10, rating: 4, content: "Very nostalgic and entertaining." },

    // Men in Black
    { user_id: 1, movie_id: 11, rating: 4, content: "Funny and original sci-fi comedy." },
    { user_id: 2, movie_id: 11, rating: 4, content: "Great chemistry between the main characters." },

    // Hancock
    { user_id: 3, movie_id: 12, rating: 3, content: "Good concept but the story could be improved." },
    { user_id: 4, movie_id: 12, rating: 4, content: "An enjoyable superhero movie with a different style." },

    // Seven Pounds
    { user_id: 5, movie_id: 13, rating: 4, content: "A touching and emotional movie." },
    { user_id: 1, movie_id: 13, rating: 4, content: "Great performance and powerful message." },

    // Charlie and the Chocolate Factory
    { user_id: 2, movie_id: 14, rating: 4, content: "A colorful and creative fantasy movie." },
    { user_id: 3, movie_id: 14, rating: 3, content: "Fun movie but not as good as the original." },

    // The Dark Knight
    { user_id: 4, movie_id: 15, rating: 5, content: "One of the greatest superhero movies ever made." },
    { user_id: 5, movie_id: 15, rating: 5, content: "Amazing acting and an unforgettable villain." },

    // Pirates 1
    { user_id: 1, movie_id: 16, rating: 5, content: "A fantastic adventure with an iconic character." },
    { user_id: 2, movie_id: 16, rating: 4, content: "Funny, exciting and very entertaining." },

    // Pirates 2
    { user_id: 3, movie_id: 17, rating: 4, content: "Great action and another fun pirate adventure." },
    { user_id: 4, movie_id: 17, rating: 4, content: "Jack Sparrow makes this movie enjoyable." },

    // Mr & Mrs Smith
    { user_id: 5, movie_id: 18, rating: 4, content: "A fun action movie with great chemistry." },
    { user_id: 1, movie_id: 18, rating: 4, content: "Entertaining from beginning to end." },

    // Benjamin Button
    { user_id: 2, movie_id: 19, rating: 5, content: "A beautiful story about life and time." },
    { user_id: 3, movie_id: 19, rating: 4, content: "Emotional and very well acted." },

    // Twilight
    { user_id: 4, movie_id: 20, rating: 3, content: "A romantic fantasy movie for its fans." },
    { user_id: 5, movie_id: 20, rating: 3, content: "Interesting atmosphere but not perfect." },

    // High School Musical
    { user_id: 1, movie_id: 21, rating: 4, content: "A fun musical with memorable songs." },
    { user_id: 2, movie_id: 21, rating: 4, content: "A nostalgic Disney classic." },

    // Camp Rock
    { user_id: 3, movie_id: 22, rating: 3, content: "A nice movie with good music." },
    { user_id: 4, movie_id: 22, rating: 3, content: "Fun but mainly for younger audiences." },

    // Devil Wears Prada
    { user_id: 5, movie_id: 23, rating: 5, content: "Funny, stylish and brilliantly acted." },
    { user_id: 1, movie_id: 23, rating: 4, content: "A very entertaining fashion movie." },

    // Fight Club
    { user_id: 2, movie_id: 24, rating: 5, content: "A unique movie that stays in your mind." },
    { user_id: 3, movie_id: 24, rating: 5, content: "Excellent story with a powerful message." },

    // Avatar
    { user_id: 4, movie_id: 25, rating: 5, content: "Amazing visuals and incredible world building." },
    { user_id: 5, movie_id: 25, rating: 4, content: "A beautiful cinematic experience." },

    // Shutter Island
    { user_id: 1, movie_id: 26, rating: 5, content: "A brilliant psychological thriller." },
    { user_id: 2, movie_id: 26, rating: 5, content: "Great atmosphere and amazing ending." },

    // Alice in Wonderland
    { user_id: 3, movie_id: 27, rating: 4, content: "A strange but beautiful fantasy adventure." },
    { user_id: 4, movie_id: 27, rating: 3, content: "Visually impressive but confusing sometimes." },

    // Amazing Spider-Man
    { user_id: 5, movie_id: 28, rating: 4, content: "A good reboot with great action scenes." },
    { user_id: 1, movie_id: 28, rating: 3, content: "Interesting but not the best Spider-Man movie." },

    // Batman Begins
    { user_id: 2, movie_id: 29, rating: 5, content: "A great origin story for Batman." },
    { user_id: 3, movie_id: 29, rating: 4, content: "Dark atmosphere and excellent acting." },

    // King Kong
    { user_id: 4, movie_id: 30, rating: 4, content: "A spectacular adventure with impressive effects." },
    { user_id: 5, movie_id: 30, rating: 4, content: "A fun remake with great visuals." }
];

async function test_seed() {
    try 
    {
        const createdMovies = [];

        for (const movie of movies)
        {
            const newMovie = await prisma.movies.create(
            {
                data: movie,
            });

            createdMovies.push(newMovie);
            console.log("Movie created:", newMovie);
        }


        const createdUsers = [];

        for (const user of users)
        {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            
            const newUser = await prisma.users.create(
            {
                data: {
                    username: user.username,
                    email: user.email,
                    password_hash: hashedPassword,
                },
            });

            createdUsers.push(newUser);
            console.log("User created:", newUser);
        }

        const reviewsWithIds = reviews.map((review) => ({
            ...review,
            user_id: createdUsers[review.user_id - 1].id,
            movie_id: createdMovies[review.movie_id - 1].id,
        }));

        for (const review of reviewsWithIds) {

            const newReview = await prisma.reviews.create({
                data: review,
            });

            console.log("Review created:", newReview);
        }
    }
    catch(error)
    {
        console.error(error);
    }
    finally
    {
        await prisma.$disconnect();
    }
}

module.exports = { test_seed };

if (require.main === module) {
  test_seed()
    .then(() => console.log("✅ Seed terminé avec succès !"))
    .catch((e) => {
      console.error("❌ Erreur pendant le seed :", e);
      process.exit(1);
    });
}



// async function test_seed() {
//     try {
//         const movie = await prisma.movies.create({
//             data: {
//                 title: "Inception",
//                 synopsis: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: 'inception', the implantation of another person's idea into a target's subconscious.",
//                 poster: "https://www.themoviedb.org/t/p/w1280/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
//                 release_date: new Date("2010-07-16"),
//                 tmdb_id: 27205,
//                 average_rating: 0
//             }
//         });
//         console.log("Movie created:", movie);
//     } catch (error) {
//         console.error("Error creating movie:", error);
//     } finally {
//         await prisma.$disconnect();
//     }
// }

// test_seed();
