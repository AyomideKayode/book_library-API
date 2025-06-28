import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Import models
import Author from '../src/models/Author.js';
import Book from '../src/models/Book.js';
import User from '../src/models/User.js';
import BorrowRecord from '../src/models/BorrowRecord.js';

// Connect to MongoDB
async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

// Sample data - Original authors (kept for development history)
const originalAuthorsData = [
  {
    name: 'J.K. Rowling',
    email: 'jk.rowling@hogwarts.com',
    biography: 'British author best known for the Harry Potter series.',
    birthDate: new Date('1965-07-31'),
    nationality: 'British',
  },
  {
    name: 'George R.R. Martin',
    email: 'grrm@winterfell.com',
    biography:
      'American novelist and short story writer, best known for A Song of Ice and Fire.',
    birthDate: new Date('1948-09-20'),
    nationality: 'American',
  },
  {
    name: 'Stephen King',
    email: 'stephen.king@scary.com',
    biography:
      'American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.',
    birthDate: new Date('1947-09-21'),
    nationality: 'American',
  },
  {
    name: 'Agatha Christie',
    email: 'agatha.christie@mystery.com',
    biography:
      'English writer known for her detective novels, particularly those featuring Hercule Poirot and Miss Marple.',
    birthDate: new Date('1890-09-15'),
    nationality: 'British',
  },
  {
    name: 'Isaac Asimov',
    email: 'isaac.asimov@foundation.com',
    biography:
      'American writer and professor of biochemistry, known for his works of science fiction and popular science.',
    birthDate: new Date('1920-01-02'),
    nationality: 'American',
  },
];

// African authors data
const africanAuthorsData = [
  {
    name: 'Chinua Achebe',
    email: 'chinua.achebe@literature.ng',
    biography:
      'Nigerian novelist, poet, professor, and critic. Best known for his novel Things Fall Apart, one of the most widely read books in modern African literature.',
    birthDate: new Date('1930-11-16'),
    nationality: 'Nigerian',
  },
  {
    name: 'Wole Soyinka',
    email: 'wole.soyinka@nobel.ng',
    biography:
      'Nigerian playwright, poet, and essayist. First African to win the Nobel Prize in Literature in 1986.',
    birthDate: new Date('1934-07-13'),
    nationality: 'Nigerian',
  },
  {
    name: 'Chimamanda Ngozi Adichie',
    email: 'chimamanda.adichie@feminism.ng',
    biography:
      'Nigerian writer whose works include novels, short stories, and nonfiction. Known for Americanah and Half of a Yellow Sun.',
    birthDate: new Date('1977-09-15'),
    nationality: 'Nigerian',
  },
  {
    name: 'Nadine Gordimer',
    email: 'nadine.gordimer@apartheid.za',
    biography:
      'South African writer and political activist. Winner of the Nobel Prize in Literature in 1991 for her anti-apartheid writings.',
    birthDate: new Date('1923-11-20'),
    nationality: 'South African',
  },
  {
    name: 'Ngugi wa Thiongo',
    email: 'ngugi.thiongo@literature.ke',
    biography:
      'Kenyan author and academic who writes primarily in Gikuyu. Known for novels like Weep Not, Child and A Grain of Wheat.',
    birthDate: new Date('1938-01-05'),
    nationality: 'Kenyan',
  },
  {
    name: 'Buchi Emecheta',
    email: 'buchi.emecheta@feminism.ng',
    biography:
      'Nigerian-born British novelist who wrote about the experiences of women in Nigeria and Britain. Known for The Joys of Motherhood.',
    birthDate: new Date('1944-07-21'),
    nationality: 'Nigerian',
  },
  {
    name: 'Ama Ata Aidoo',
    email: 'ama.aidoo@literature.gh',
    biography:
      'Ghanaian author, poet, playwright, and academic. Known for her feminist themes and works like Our Sister Killjoy.',
    birthDate: new Date('1942-03-23'),
    nationality: 'Ghanaian',
  },
  {
    name: 'Nuruddin Farah',
    email: 'nuruddin.farah@literature.so',
    biography:
      'Somali novelist and playwright. Known for his trilogy Variations on the Theme of an African Dictatorship.',
    birthDate: new Date('1945-11-24'),
    nationality: 'Somali',
  },
  {
    name: 'Mariama Bâ',
    email: 'mariama.ba@literature.sn',
    biography:
      'Senegalese author and feminist, best known for her novel So Long a Letter which won the first Noma Award for Publishing in Africa.',
    birthDate: new Date('1929-04-17'),
    nationality: 'Senegalese',
  },
  {
    name: 'Tsitsi Dangarembga',
    email: 'tsitsi.dangarembga@literature.zw',
    biography:
      'Zimbabwean novelist, playwright, and filmmaker. Known for her novel Nervous Conditions, the first published novel by a Black Zimbabwean woman.',
    birthDate: new Date('1959-02-04'),
    nationality: 'Zimbabwean',
  },
];

// Combine all authors
const authorsData = [...originalAuthorsData, ...africanAuthorsData];

// Original users data (kept for development history)
const originalUsersData = [
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    phone: '+1-555-0101',
    address: {
      street: '123 Library St',
      city: 'Booktown',
      state: 'Reading',
      zipCode: '12345',
      country: 'USA',
    },
    membershipDate: new Date('2023-01-15'),
  },
  {
    name: 'Bob Smith',
    email: 'bob.smith@email.com',
    phone: '+1-555-0102',
    address: {
      street: '456 Knowledge Ave',
      city: 'Learnville',
      state: 'Education',
      zipCode: '67890',
      country: 'USA',
    },
    membershipDate: new Date('2023-02-20'),
  },
  {
    name: 'Carol Davis',
    email: 'carol.davis@email.com',
    phone: '+1-555-0103',
    address: {
      street: '789 Wisdom Blvd',
      city: 'Studytown',
      state: 'Learning',
      zipCode: '54321',
      country: 'USA',
    },
    membershipDate: new Date('2023-03-10'),
  },
  {
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+1-555-0104',
    address: {
      street: '321 Scholar Lane',
      city: 'Academyville',
      state: 'Knowledge',
      zipCode: '98765',
      country: 'USA',
    },
    membershipDate: new Date('2023-04-05'),
  },
  {
    name: 'Emma Brown',
    email: 'emma.brown@email.com',
    phone: '+1-555-0105',
    address: {
      street: '654 Literature Dr',
      city: 'Noveltown',
      state: 'Fiction',
      zipCode: '13579',
      country: 'USA',
    },
    membershipDate: new Date('2023-05-12'),
  },
];

// African users data
const africanUsersData = [
  {
    name: 'Adaora Okafor',
    email: 'adaora.okafor@gmail.com',
    phone: '+234-803-123-4567',
    address: {
      street: '15 Victoria Island Road',
      city: 'Lagos',
      state: 'Lagos',
      zipCode: '101001',
      country: 'Nigeria',
    },
    membershipDate: new Date('2023-06-10'),
  },
  {
    name: 'Kofi Asante',
    email: 'kofi.asante@yahoo.com',
    phone: '+233-24-567-8901',
    address: {
      street: '42 Oxford Street',
      city: 'Accra',
      state: 'Greater Accra',
      zipCode: 'GA-039-5028',
      country: 'Ghana',
    },
    membershipDate: new Date('2023-07-22'),
  },
  {
    name: 'Amina Hassan',
    email: 'amina.hassan@hotmail.com',
    phone: '+254-722-345-678',
    address: {
      street: '78 Uhuru Highway',
      city: 'Nairobi',
      state: 'Nairobi',
      zipCode: '00100',
      country: 'Kenya',
    },
    membershipDate: new Date('2023-08-05'),
  },
  {
    name: 'Thandiwe Mthembu',
    email: 'thandiwe.mthembu@gmail.com',
    phone: '+27-82-901-2345',
    address: {
      street: '123 Nelson Mandela Boulevard',
      city: 'Cape Town',
      state: 'Western Cape',
      zipCode: '8001',
      country: 'South Africa',
    },
    membershipDate: new Date('2023-09-12'),
  },
  {
    name: 'Omar Diallo',
    email: 'omar.diallo@outlook.com',
    phone: '+221-77-567-8901',
    address: {
      street: '56 Avenue Léopold Sédar Senghor',
      city: 'Dakar',
      state: 'Dakar',
      zipCode: '12500',
      country: 'Senegal',
    },
    membershipDate: new Date('2023-10-18'),
  },
  {
    name: 'Fatoumata Keita',
    email: 'fatoumata.keita@gmail.com',
    phone: '+223-65-234-567',
    address: {
      street: '89 Boulevard du Peuple',
      city: 'Bamako',
      state: 'Bamako',
      zipCode: 'BP 2423',
      country: 'Mali',
    },
    membershipDate: new Date('2023-11-03'),
  },
];

// Combine all users
const usersData = [...originalUsersData, ...africanUsersData];

// Books data (will be populated with author IDs after authors are created)
const getBooksData = (authors) => {
  // Original books data (kept for development history)
  const originalBooks = [
    {
      title: "Harry Potter and the Philosopher's Stone",
      isbn: '9780747532699',
      authorId: authors.find((a) => a.name === 'J.K. Rowling')._id,
      publicationDate: new Date('1997-06-26'),
      genre: 'Fantasy',
      pages: 223,
      description: 'The first book in the Harry Potter series.',
      copiesAvailable: 5,
      totalCopies: 5,
      language: 'English',
      publisher: 'Bloomsbury',
    },
    {
      title: 'Harry Potter and the Chamber of Secrets',
      isbn: '9780747538493',
      authorId: authors.find((a) => a.name === 'J.K. Rowling')._id,
      publicationDate: new Date('1998-07-02'),
      genre: 'Fantasy',
      pages: 251,
      description: 'The second book in the Harry Potter series.',
      copiesAvailable: 3,
      totalCopies: 3,
      language: 'English',
      publisher: 'Bloomsbury',
    },
    {
      title: 'A Game of Thrones',
      isbn: '9780553103540',
      authorId: authors.find((a) => a.name === 'George R.R. Martin')._id,
      publicationDate: new Date('1996-08-01'),
      genre: 'Fantasy',
      pages: 694,
      description: 'The first book in A Song of Ice and Fire series.',
      copiesAvailable: 2,
      totalCopies: 2,
      language: 'English',
      publisher: 'Bantam Spectra',
    },
    {
      title: 'A Clash of Kings',
      isbn: '9780553108033',
      authorId: authors.find((a) => a.name === 'George R.R. Martin')._id,
      publicationDate: new Date('1999-02-02'),
      genre: 'Fantasy',
      pages: 761,
      description: 'The second book in A Song of Ice and Fire series.',
      copiesAvailable: 1,
      totalCopies: 2,
      language: 'English',
      publisher: 'Bantam Spectra',
    },
    {
      title: 'The Shining',
      isbn: '9780385121675',
      authorId: authors.find((a) => a.name === 'Stephen King')._id,
      publicationDate: new Date('1977-01-28'),
      genre: 'Horror',
      pages: 447,
      description:
        'A horror novel about a family trapped in an isolated hotel.',
      copiesAvailable: 4,
      totalCopies: 4,
      language: 'English',
      publisher: 'Doubleday',
    },
    {
      title: 'It',
      isbn: '9780670813025',
      authorId: authors.find((a) => a.name === 'Stephen King')._id,
      publicationDate: new Date('1986-09-15'),
      genre: 'Horror',
      pages: 1138,
      description: 'A horror novel about a monster that terrorizes children.',
      copiesAvailable: 2,
      totalCopies: 3,
      language: 'English',
      publisher: 'Viking',
    },
    {
      title: 'Murder on the Orient Express',
      isbn: '9780007119318',
      authorId: authors.find((a) => a.name === 'Agatha Christie')._id,
      publicationDate: new Date('1934-01-01'),
      genre: 'Mystery',
      pages: 256,
      description: 'A classic detective novel featuring Hercule Poirot.',
      copiesAvailable: 3,
      totalCopies: 3,
      language: 'English',
      publisher: 'Collins Crime Club',
    },
    {
      title: 'And Then There Were None',
      isbn: '9780007136834',
      authorId: authors.find((a) => a.name === 'Agatha Christie')._id,
      publicationDate: new Date('1939-11-06'),
      genre: 'Mystery',
      pages: 272,
      description: "Christie's best-selling mystery novel.",
      copiesAvailable: 4,
      totalCopies: 4,
      language: 'English',
      publisher: 'Collins Crime Club',
    },
    {
      title: 'Foundation',
      isbn: '9780553293357',
      authorId: authors.find((a) => a.name === 'Isaac Asimov')._id,
      publicationDate: new Date('1951-05-01'),
      genre: 'Science Fiction',
      pages: 244,
      description: 'The first book in the Foundation series.',
      copiesAvailable: 2,
      totalCopies: 2,
      language: 'English',
      publisher: 'Gnome Press',
    },
    {
      title: 'I, Robot',
      isbn: '9780553294385',
      authorId: authors.find((a) => a.name === 'Isaac Asimov')._id,
      publicationDate: new Date('1950-12-02'),
      genre: 'Science Fiction',
      pages: 253,
      description: 'A collection of nine science fiction short stories.',
      copiesAvailable: 3,
      totalCopies: 3,
      language: 'English',
      publisher: 'Gnome Press',
    },
  ];

  // African authors' books data
  const africanBooks = [
    // Chinua Achebe books
    {
      title: 'Things Fall Apart',
      isbn: '9780385474542',
      authorId: authors.find((a) => a.name === 'Chinua Achebe')._id,
      publicationDate: new Date('1958-06-17'),
      genre: 'Literary Fiction',
      pages: 209,
      description:
        'A masterpiece that tells the story of Okonkwo, a proud Igbo warrior, and the arrival of European colonialism in Nigeria.',
      copiesAvailable: 4,
      totalCopies: 6,
      language: 'English',
      publisher: 'William Heinemann',
    },
    {
      title: 'No Longer at Ease',
      isbn: '9780385474559',
      authorId: authors.find((a) => a.name === 'Chinua Achebe')._id,
      publicationDate: new Date('1960-07-01'),
      genre: 'Literary Fiction',
      pages: 169,
      description:
        "The sequel to Things Fall Apart, following Okonkwo's grandson Obi as he navigates colonial and post-colonial Nigeria.",
      copiesAvailable: 3,
      totalCopies: 4,
      language: 'English',
      publisher: 'William Heinemann',
    },
    {
      title: 'Arrow of God',
      isbn: '9780385014809',
      authorId: authors.find((a) => a.name === 'Chinua Achebe')._id,
      publicationDate: new Date('1964-03-01'),
      genre: 'Literary Fiction',
      pages: 230,
      description:
        "The final book in Achebe's African Trilogy, exploring the collision between traditional African culture and colonial rule.",
      copiesAvailable: 2,
      totalCopies: 3,
      language: 'English',
      publisher: 'Eyre & Spottiswoode',
    },

    // Wole Soyinka books
    {
      title: 'The Lion and the Jewel',
      isbn: '9780195774276',
      authorId: authors.find((a) => a.name === 'Wole Soyinka')._id,
      publicationDate: new Date('1963-01-01'),
      genre: 'Drama',
      pages: 64,
      description:
        'A comedic play about the clash between tradition and modernity in a Nigerian village.',
      copiesAvailable: 3,
      totalCopies: 5,
      language: 'English',
      publisher: 'Oxford University Press',
    },
    {
      title: "Death and the King's Horseman",
      isbn: '9780393312836',
      authorId: authors.find((a) => a.name === 'Wole Soyinka')._id,
      publicationDate: new Date('1975-01-01'),
      genre: 'Drama',
      pages: 83,
      description:
        'A powerful play based on a true incident that occurred in colonial Nigeria in 1946.',
      copiesAvailable: 4,
      totalCopies: 4,
      language: 'English',
      publisher: 'Eyre Methuen',
    },

    // Chimamanda Ngozi Adichie books
    {
      title: 'Half of a Yellow Sun',
      isbn: '9781400095209',
      authorId: authors.find((a) => a.name === 'Chimamanda Ngozi Adichie')._id,
      publicationDate: new Date('2006-09-12'),
      genre: 'Historical Fiction',
      pages: 433,
      description:
        'A novel about the Nigerian Civil War and its impact on the lives of ordinary people.',
      copiesAvailable: 2,
      totalCopies: 5,
      language: 'English',
      publisher: 'Knopf',
    },
    {
      title: 'Americanah',
      isbn: '9780307455925',
      authorId: authors.find((a) => a.name === 'Chimamanda Ngozi Adichie')._id,
      publicationDate: new Date('2013-05-14'),
      genre: 'Literary Fiction',
      pages: 477,
      description:
        'A story about a Nigerian woman who travels to America for university and her experiences with race and identity.',
      copiesAvailable: 3,
      totalCopies: 6,
      language: 'English',
      publisher: 'Knopf',
    },
    {
      title: 'Purple Hibiscus',
      isbn: '9781565120273',
      authorId: authors.find((a) => a.name === 'Chimamanda Ngozi Adichie')._id,
      publicationDate: new Date('2003-10-01'),
      genre: 'Literary Fiction',
      pages: 307,
      description:
        'A coming-of-age story about a teenage girl in Nigeria dealing with her fundamentalist father.',
      copiesAvailable: 1,
      totalCopies: 4,
      language: 'English',
      publisher: 'Algonquin Books',
    },

    // Nadine Gordimer books
    {
      title: "July's People",
      isbn: '9780140061406',
      authorId: authors.find((a) => a.name === 'Nadine Gordimer')._id,
      publicationDate: new Date('1981-06-01'),
      genre: 'Literary Fiction',
      pages: 160,
      description:
        'A novel about a white South African family who must depend on their Black servant during a revolution.',
      copiesAvailable: 2,
      totalCopies: 3,
      language: 'English',
      publisher: 'Jonathan Cape',
    },
    {
      title: "Burger's Daughter",
      isbn: '9780140053852',
      authorId: authors.find((a) => a.name === 'Nadine Gordimer')._id,
      publicationDate: new Date('1979-06-01'),
      genre: 'Literary Fiction',
      pages: 361,
      description:
        'A novel about a young white woman growing up in apartheid South Africa.',
      copiesAvailable: 3,
      totalCopies: 3,
      language: 'English',
      publisher: 'Jonathan Cape',
    },

    // Ngugi wa Thiong'o books
    {
      title: 'Weep Not, Child',
      isbn: '9780435905200',
      authorId: authors.find((a) => a.name === 'Ngugi wa Thiongo')._id,
      publicationDate: new Date('1964-01-01'),
      genre: 'Literary Fiction',
      pages: 154,
      description:
        "A novel about a young Kenyan boy's experiences during the Mau Mau uprising.",
      copiesAvailable: 2,
      totalCopies: 4,
      language: 'English',
      publisher: 'Heinemann',
    },
    {
      title: 'A Grain of Wheat',
      isbn: '9780435905217',
      authorId: authors.find((a) => a.name === 'Ngugi wa Thiongo')._id,
      publicationDate: new Date('1967-01-01'),
      genre: 'Literary Fiction',
      pages: 264,
      description:
        'A novel set during the final days of British colonial rule in Kenya.',
      copiesAvailable: 1,
      totalCopies: 3,
      language: 'English',
      publisher: 'Heinemann',
    },

    // Buchi Emecheta books
    {
      title: 'The Joys of Motherhood',
      isbn: '9780807616116',
      authorId: authors.find((a) => a.name === 'Buchi Emecheta')._id,
      publicationDate: new Date('1979-01-01'),
      genre: 'Literary Fiction',
      pages: 224,
      description:
        "A novel about a Nigerian woman's struggle with traditional expectations of motherhood.",
      copiesAvailable: 3,
      totalCopies: 4,
      language: 'English',
      publisher: 'Allison & Busby',
    },
    {
      title: 'Second Class Citizen',
      isbn: '9780807616123',
      authorId: authors.find((a) => a.name === 'Buchi Emecheta')._id,
      publicationDate: new Date('1974-01-01'),
      genre: 'Literary Fiction',
      pages: 172,
      description:
        "A semi-autobiographical novel about a Nigerian woman's experiences in London.",
      copiesAvailable: 2,
      totalCopies: 3,
      language: 'English',
      publisher: 'Allison & Busby',
    },

    // Ama Ata Aidoo books
    {
      title: 'Our Sister Killjoy',
      isbn: '9780582642751',
      authorId: authors.find((a) => a.name === 'Ama Ata Aidoo')._id,
      publicationDate: new Date('1977-01-01'),
      genre: 'Literary Fiction',
      pages: 133,
      description:
        "A novel about a young Ghanaian woman's journey to Germany and her observations on African identity.",
      copiesAvailable: 2,
      totalCopies: 3,
      language: 'English',
      publisher: 'Longman',
    },
    {
      title: 'Changes: A Love Story',
      isbn: '9780935312980',
      authorId: authors.find((a) => a.name === 'Ama Ata Aidoo')._id,
      publicationDate: new Date('1991-01-01'),
      genre: 'Literary Fiction',
      pages: 171,
      description:
        "A novel exploring love, marriage, and women's independence in contemporary Ghana.",
      copiesAvailable: 3,
      totalCopies: 3,
      language: 'English',
      publisher: "Women's Press",
    },

    // Nuruddin Farah books
    {
      title: 'Maps',
      isbn: '9781611457681',
      authorId: authors.find((a) => a.name === 'Nuruddin Farah')._id,
      publicationDate: new Date('1986-01-01'),
      genre: 'Literary Fiction',
      pages: 246,
      description:
        'A novel about a young man growing up in the Somali-Ethiopian borderlands.',
      copiesAvailable: 2,
      totalCopies: 2,
      language: 'English',
      publisher: 'Pantheon Books',
    },
    {
      title: 'Sweet and Sour Milk',
      isbn: '9781555972684',
      authorId: authors.find((a) => a.name === 'Nuruddin Farah')._id,
      publicationDate: new Date('1979-01-01'),
      genre: 'Literary Fiction',
      pages: 204,
      description:
        'The first book in the Variations on the Theme of an African Dictatorship trilogy.',
      copiesAvailable: 1,
      totalCopies: 2,
      language: 'English',
      publisher: 'Allison & Busby',
    },

    // Mariama Bâ books
    {
      title: 'So Long a Letter',
      isbn: '9780435905286',
      authorId: authors.find((a) => a.name === 'Mariama Bâ')._id,
      publicationDate: new Date('1979-01-01'),
      genre: 'Literary Fiction',
      pages: 89,
      description:
        "A novel written as a letter from a Senegalese woman to her friend, exploring themes of polygamy and women's rights.",
      copiesAvailable: 2,
      totalCopies: 4,
      language: 'English',
      publisher: 'Nouvelles Éditions Africaines',
    },
    {
      title: 'Scarlet Song',
      isbn: '9780582642768',
      authorId: authors.find((a) => a.name === 'Mariama Bâ')._id,
      publicationDate: new Date('1981-01-01'),
      genre: 'Literary Fiction',
      pages: 118,
      description:
        'A novel about an interracial marriage between a Senegalese man and a French woman.',
      copiesAvailable: 3,
      totalCopies: 3,
      language: 'English',
      publisher: 'Longman',
    },

    // Tsitsi Dangarembga books
    {
      title: 'Nervous Conditions',
      isbn: '9780954702311',
      authorId: authors.find((a) => a.name === 'Tsitsi Dangarembga')._id,
      publicationDate: new Date('1988-01-01'),
      genre: 'Literary Fiction',
      pages: 204,
      description:
        "A coming-of-age novel about a young Zimbabwean girl's struggle for education and independence.",
      copiesAvailable: 2,
      totalCopies: 4,
      language: 'English',
      publisher: "Women's Press",
    },
    {
      title: 'The Book of Not',
      isbn: '9780954702328',
      authorId: authors.find((a) => a.name === 'Tsitsi Dangarembga')._id,
      publicationDate: new Date('2006-01-01'),
      genre: 'Literary Fiction',
      pages: 195,
      description:
        'The sequel to Nervous Conditions, continuing the story of Tambu as she attends a colonial school.',
      copiesAvailable: 3,
      totalCopies: 3,
      language: 'English',
      publisher: 'Ayebia Clarke',
    },
  ];

  // Combine all books
  return [...originalBooks, ...africanBooks];
};

// Function to clear existing data
async function clearData() {
  try {
    console.log('🧹 Clearing existing data...');
    await BorrowRecord.deleteMany({});
    await Book.deleteMany({});
    await User.deleteMany({});
    await Author.deleteMany({});
    console.log('✅ Existing data cleared');
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
    throw error;
  }
}

// Function to seed authors
async function seedAuthors() {
  try {
    console.log('👤 Seeding authors...');
    const authors = await Author.insertMany(authorsData);
    console.log(`✅ Created ${authors.length} authors`);
    return authors;
  } catch (error) {
    console.error('❌ Error seeding authors:', error.message);
    throw error;
  }
}

// Function to seed users
async function seedUsers() {
  try {
    console.log('👥 Seeding users...');
    const users = await User.insertMany(usersData);
    console.log(`✅ Created ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
}

// Function to seed books
async function seedBooks(authors) {
  try {
    console.log('📚 Seeding books...');
    const booksData = getBooksData(authors);
    const books = await Book.insertMany(booksData);
    console.log(`✅ Created ${books.length} books`);
    return books;
  } catch (error) {
    console.error('❌ Error seeding books:', error.message);
    throw error;
  }
}

// Function to seed some borrow records (optional)
async function seedBorrowRecords(users, books) {
  try {
    console.log('📋 Seeding sample borrow records...');

    // Create some sample borrow records
    const borrowRecordsData = [
      {
        userId: users[0]._id, // Alice Johnson
        bookId: books[3]._id, // A Clash of Kings (1 available, 2 total)
        borrowDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'active',
      },
      {
        userId: users[1]._id, // Bob Smith
        bookId: books[5]._id, // It (2 available, 3 total)
        borrowDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
        status: 'active',
      },
      {
        userId: users[2]._id, // Carol Davis
        bookId: books[0]._id, // Harry Potter 1 (returned)
        borrowDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        dueDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), // 16 days ago
        returnDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        status: 'returned',
      },
    ];

    const borrowRecords = await BorrowRecord.insertMany(borrowRecordsData);
    console.log(`✅ Created ${borrowRecords.length} borrow records`);

    return borrowRecords;
  } catch (error) {
    console.error('❌ Error seeding borrow records:', error.message);
    throw error;
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    await connectDB();
    await clearData();

    const authors = await seedAuthors();
    const users = await seedUsers();
    const books = await seedBooks(authors);
    const borrowRecords = await seedBorrowRecords(users, books);

    console.log('\n📊 Seeding Summary:');
    console.log(`   Authors: ${authors.length}`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Books: ${books.length}`);
    console.log(`   Borrow Records: ${borrowRecords.length}`);

    console.log('\n🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('\n💥 Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
