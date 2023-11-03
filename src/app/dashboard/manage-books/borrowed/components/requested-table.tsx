// "use client";

// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import useDebounce from "@/hooks/useDebounce";
// import { Book, BorrowedBook } from "@prisma/client";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import { redirect } from "next/navigation";
// import { useState } from "react";

// type Props = {};

// type NestedBook = {
//   book: Book;
// };

// type Borrow = NestedBook | BorrowedBook;
// const BooksTable = (props: Props) => {
//   const session = useSession();
//   if (!session) redirect("/login");

//   const {
//     data: books,
//     isLoading,
//     isError,
//     isSuccess,
//   } = useQuery<{
//     data: {
//       borrowedBooks: Borrow[];
//       requestedBooks: Borrow[];
//     };
//   }>({
//     queryKey: ["books-requested", debouncedKeyword, page],
//     queryFn: async () => {
//       const res = await axios.get(`/api/books/borrow`);
//       return res.data;
//     },
//     placeholderData: keepPreviousData,
//   });

//   if (isLoading) return <div>Loading...</div>;

//   if (isError) return <div>Error</div>;

//   return (
//     <Table className="rounded-lg">
//       <TableHeader>
//         <TableRow>
//           <TableHead className="w-[100px]">ID</TableHead>
//           <TableHead>Book</TableHead>
//           <TableHead>User name</TableHead>
//           <TableHead>Status</TableHead>
//           <TableHead>Requested at</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {books?.data.borrowedBooks.map((book) => (
//           <TableRow key={book}>
//             <TableCell>{book}</TableCell>
//             <TableCell className="font-medium">
//               <div className="relative w-10 h-16 flex flex-row gap-4 items-center overflow-hidden rounded-lg">
//                 <Image
//                   alt="book cover "
//                   fill
//                   style={{ objectFit: "cover" }}
//                   src={book.coverImage || "/placeholder.jpg"}
//                 />
//               </div>
//             </TableCell>

//             <TableCell className="font-medium">{book.title}</TableCell>
//             <TableCell className="font-medium">{book.author}</TableCell>
//             <TableCell>{book.genre}</TableCell>
//             <TableCell>{book.stock}</TableCell>
//             <TableCell>{book.copies}</TableCell>
//             <TableCell className="text-right">
//               {new Date(book.createdAt).toLocaleDateString()}
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// };

// export default BooksTable;
