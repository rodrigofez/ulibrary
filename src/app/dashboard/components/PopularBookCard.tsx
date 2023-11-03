import { Button } from "@/components/ui/button";
import { Book } from "@prisma/client";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  onClick?: (book: Book) => void;
} & Book;

const PopularBookCard = ({ onClick, ...props }: Props) => {
  const handleClick = () => {
    if (onClick) onClick(props);
  };

  return (
    <div className="flex-none relative flex flex-row gap-8 rounded-xl border-border border-[1px] w-96 p-6 overflow-hidden">
      <div className="relative">
        <div className="z-10 relative w-24 h-32 rounded-[--radius] border-border border-[1px] overflow-hidden">
          <Image
            fill
            src={props.coverImage || "/placeholder.png"}
            alt="Book cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-blue-500 w-24 h-32 absolute rounded-lg rotate-12 top-0 z-0 "></div>
      </div>
      <div className="flex flex-col justify-between w-52">
        <div>
          <h3 className="text-md font-bold line-clamp-2 break-words">
            {props.title}
          </h3>
          <h3 className="text-sm line-clamp-2 break-words text-gray-600">
            {props.author}
          </h3>
        </div>
        <div className="flex gap-6 justify-between w-full items-center">
          <div className="flex gap-6">
            <div className="text-sm text-center">
              <h5 className="font-bold">{props.timesBorrowed}</h5>
              <div className="text-gray-500 text-xs">Borrowed</div>
            </div>
            <div className="text-sm text-center">
              <h5 className="font-bold">{props.stock}</h5>
              <div className="text-gray-500 text-xs">Stock</div>
            </div>
          </div>
          <Button onClick={handleClick} className="bg-blue-500" size="icon">
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopularBookCard;
