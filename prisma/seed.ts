const { PrismaClient, BorrowedStatus } = require("@prisma/client");
const prisma = new PrismaClient();
const { faker } = require("@faker-js/faker");

async function main() {
  const bookCount = 50;

  for (let i = 1; i <= bookCount; i++) {
    const title = faker.lorem.words(3);
    const genre = faker.helpers.arrayElement([
      "Science Fiction",
      "Fantasy",
      "Mystery",
      "Romance",
      "Non-Fiction",
      "Science",
      "Programming",
    ]);
    const description = faker.lorem.paragraph();
    const stock = faker.number.int({ min: 1, max: 3 });
    const author = faker.person.fullName();
    const coverImage = faker.image.urlPicsumPhotos();
    const isbn = faker.random.alphaNumeric(13);

    const book = await prisma.book.create({
      data: {
        title,
        genre,
        description,
        stock,
        author,
        coverImage,
        copies: stock,
        timesBorrowed: 0,
        isbn,
      },
    });

    for (let j = 0; j < stock; j++) {
      const status = faker.helpers.arrayElement([BorrowedStatus.RETURNED]);

      await prisma.bookCopy.create({
        data: {
          status,
          bookId: book.id,
        },
      });
    }
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
