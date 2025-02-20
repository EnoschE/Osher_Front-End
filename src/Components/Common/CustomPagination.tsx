import React from 'react';
import { Pagination } from "@mui/material";
import { borderRadius } from '../../Utils/spacings';
import { useSelector } from '../../Redux/reduxHooks';
import { selectColors } from '../../Redux/Slices/generalSlice';

interface CustomPaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    const colors = useSelector(selectColors);

    return (
        <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => onPageChange(page)}
            sx={{
                "& button": {
                    color: colors.text,
                    borderRadius: borderRadius.xs,
                    fontWeight: 400,

                    "&.Mui-selected": {
                        fontWeight: 600,
                        color: colors.primary,
                        bgcolor: colors.primaryMidLight,
                    },
                },
            }}
        />
    );
}

export default CustomPagination;
