import { Pagination, Stack } from "@mui/material";
import { useState, useEffect } from "react";

interface ClientSidePaginationProps<T> {
  mode?: "client";
  data: T[];
  itemsPerPage: number;
  onPageDataChange: (data: T[]) => void;
}

interface ServerSidePaginationProps {
  mode: "server";
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type CommonPaginationProps<T> = ClientSidePaginationProps<T> | ServerSidePaginationProps;

const CommonPagination = <T,>(props: CommonPaginationProps<T>) => {
  const [page, setPage] = useState(1);

  // Server-side pagination
  if (props.mode === "server") {
    if (props.totalPages <= 1) return null;

    return (
      <div className="flex-shrink-0 py-4 px-4 bg-white border-t border-gray-200 flex justify-center">
        <Pagination
          count={props.totalPages}
          page={props.currentPage}
          onChange={(_, value) => props.onPageChange(value)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </div>
    );
  }

  // Client-side pagination
  const { data, itemsPerPage, onPageDataChange } = props;

  useEffect(() => {
    onPageDataChange(data.slice(0, itemsPerPage));
  }, [data, itemsPerPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (_: unknown, value: number) => {
    setPage(value);

    onPageDataChange(
      data.slice(
        (value - 1) * itemsPerPage,
        value * itemsPerPage
      )
    );
  };

  if (totalPages <= 1) return null;

  return (
    <Stack direction="row" justifyContent="center">
      <Pagination
        count={totalPages}
        page={page}
        variant="outlined"
        shape="rounded"
        onChange={handlePageChange}
      />
    </Stack>
  );
};

export default CommonPagination;
