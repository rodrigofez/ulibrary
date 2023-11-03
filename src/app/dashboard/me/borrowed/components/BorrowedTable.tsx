import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";

const BorrowedTable = async () => {
  const session = await getAuthSession();
  const borrowedBooks = await prisma.borrowedBook.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      book: {
        include: {
          book: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Table>
      <TableCaption>A list of your recent borrowed books</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Requested at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {borrowedBooks.map((borrowedBook) => (
          <TableRow key={borrowedBook.id}>
            <TableCell>{borrowedBook.bookId}</TableCell>
            <TableCell className="font-medium">
              {borrowedBook.book.book.title}
            </TableCell>
            <TableCell className="font-medium">
              {borrowedBook.book.book.author}
            </TableCell>
            <TableCell>{borrowedBook.status}</TableCell>
            <TableCell className="text-right">
              {new Date(borrowedBook.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BorrowedTable;
